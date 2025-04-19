<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // Get user's orders (both as buyer and seller)
    public function index()
    {
        $orders = Order::where('buyer_id', Auth::id())
                      ->orWhere('seller_id', Auth::id())
                      ->with(['item', 'buyer', 'seller'])
                      ->latest()
                      ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // Create a new order (Purchase an item)
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id'
        ]);

        $item = Item::findOrFail($request->item_id);

        // Check if the item is already sold
        if ($item->is_sold) {
            return response()->json([
                'success' => false,
                'message' => 'This item has already been sold'
            ], 422);
        }

        // Check if there's already an order in progress for this item
        $existingOrder = Order::where('item_id', $item->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('payment_status', '!=', 'paid')
            ->first();

        if ($existingOrder) {
            return response()->json([
                'success' => false,
                'message' => 'An order is already in progress for this item'
            ], 422);
        }

        $order = Order::create([
            'buyer_id' => Auth::id(),
            'seller_id' => $item->seller_id,
            'item_id' => $item->id,
            'status' => 'pending',
            'ordered_at' => now(),
            'payment_status' => 'pending'
        ]);

        // The item remains available (is_sold = false) at this stage

        return response()->json([
            'success' => true,
            'data' => $order->load('item', 'seller', 'buyer')
        ], 201);
    }

    // Get order details
    public function show(Order $order)
    {
        if (Auth::id() != $order->buyer_id && Auth::id() != $order->seller_id) {
            return response()->json(['message' => 'Not authorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order->load(['item', 'buyer', 'seller'])
        ]);
    }

    // Update order status (seller only)
    public function update(Request $request, Order $order)
    {
        // Check that the user is the seller
        if ($order->seller_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:accepted,declined,rejected'  // Added 'declined' as a valid status
        ]);

        $order->update([
            'status' => $request->status
        ]);


        return response()->json([
            'success' => true,
            'data' => $order->fresh()->load('item', 'buyer')
        ]);
    }

    // Cancel order (buyer only)
    public function cancel(Order $order)
    {
        // Check if the user is buyer or seller
        if ($order->buyer_id !== Auth::id() && $order->seller_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Cannot cancel an order that's already paid
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel an order that has already been paid'
            ], 422);
        }

        // Specific rules based on order status
        if ($order->status === 'pending') {
            // A pending order can be canceled by the buyer
            if ($order->buyer_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the buyer can cancel a pending order'
                ], 403);
            }
        } 
        else if ($order->status === 'accepted') {
            // An accepted order can be canceled by the seller or the buyer
        }

        // Update the order status
        $order->update([
            'status' => 'cancelled'
        ]);

        // Make sure the item is released
        $item = Item::find($order->item_id);
        if ($item) {
            $item->update(['is_sold' => false]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order successfully cancelled',
            'data' => $order->fresh()->load('item', 'buyer')
        ]);
    }
}