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

        $item = Item::find($request->item_id);

        if ($item->is_sold) {
            return response()->json([
                'success' => false,
                'message' => 'Item already sold'
            ], 400);
        }

        if ($item->seller_id == Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot buy your own item'
            ], 400);
        }

        $order = Order::create([
            'seller_id' => $item->seller_id,
            'buyer_id' => Auth::id(),
            'item_id' => $item->id,
            'status' => 'pending',
            'ordered_at' => now()
        ]);

        $item->update(['is_sold' => true]);

        return response()->json([
            'success' => true,
            'data' => $order
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
        if (Auth::id() != $order->seller_id) {
            return response()->json(['message' => 'Only seller can update'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,accepted,declined,cancelled,completed'
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
    // Cancel order (buyer only)
    public function cancel(Order $order)
    {
        if (Auth::id() != $order->buyer_id) {
            return response()->json(['message' => 'Only buyer can cancel'], 403);
        }

        if ($order->status == 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Completed orders cannot be cancelled'
            ], 400);
        }

        $order->update(['status' => 'cancelled']);
        $order->item()->update(['is_sold' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled'
        ]);
    }
}