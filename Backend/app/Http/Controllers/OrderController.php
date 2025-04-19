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

        // Vérifier si l'article est déjà vendu
        if ($item->is_sold) {
            return response()->json([
                'success' => false,
                'message' => 'Cet article a déjà été vendu'
            ], 422);
        }

        // Vérifier s'il y a déjà une commande en cours pour cet article
        $existingOrder = Order::where('item_id', $item->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('payment_status', '!=', 'paid')
            ->first();

        if ($existingOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Une commande est déjà en cours pour cet article'
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

        // L'article reste disponible (is_sold = false) à ce stade

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
        // Vérifier que l'utilisateur est bien le vendeur
        if ($order->seller_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:accepted,declined,rejected'  // Ajout de 'declined' comme statut valide
        ]);

        $order->update([
            'status' => $request->status
        ]);

        // Ne PAS marquer l'article comme vendu ici
        // L'article ne sera marqué comme vendu que lors du paiement

        return response()->json([
            'success' => true,
            'data' => $order->fresh()->load('item', 'buyer')
        ]);
    }

    // Cancel order (buyer only)
    public function cancel(Order $order)
    {
        // Vérifier si l'utilisateur est acheteur ou vendeur
        if ($order->buyer_id !== Auth::id() && $order->seller_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // On ne peut pas annuler une commande déjà payée
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler une commande déjà payée'
            ], 422);
        }

        // Règles spécifiques selon le statut de la commande
        if ($order->status === 'pending') {
            // Une commande en attente peut être annulée par l'acheteur
            if ($order->buyer_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Seul l\'acheteur peut annuler une commande en attente'
                ], 403);
            }
        } 
        else if ($order->status === 'accepted') {
            // Une commande acceptée peut être annulée par le vendeur ou l'acheteur
        }

        // Mettre à jour le statut de la commande
        $order->update([
            'status' => 'cancelled'
        ]);

        // S'assurer que l'article est libéré
        $item = Item::find($order->item_id);
        if ($item) {
            $item->update(['is_sold' => false]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Commande annulée avec succès',
            'data' => $order->fresh()->load('item', 'buyer')
        ]);
    }
}