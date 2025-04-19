<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Item;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Charge;
use Illuminate\Support\Facades\Auth;
use App\Mail\PaymentMail;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class PaymentController extends Controller
{
    public function processPayment(Request $request, Order $order)
    {
        if ($order->buyer_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }
        
        if ($order->status !== 'accepted') {
            return response()->json([
                'message' => 'Order still not accepted'
            ], 403);
        }
        
        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Order already paid'
            ], 422);
        }
        
        Stripe::setApiKey(env('STRIPE_SECRET'));
        
        try {
            $charge = Charge::create([
                "amount" => $order->item->price * 100,
                "currency" => "MAD",
                "source" => $request->stripeToken,
                "description" => "Payment for Order #{$order->id}",
            ]);
            
            // Update the payment status of the order
            $order->update([
                'payment_status' => 'paid',
                'payment_id' => $charge->id,
                'amount_paid' => $order->item->price,
                'paid_at' => now()
            ]);
            
            // Mark the item as sold after payment
            $item = Item::find($order->item_id);
            if ($item) {
                $item->update(['is_sold' => true]);
            }
            
            Mail::to($order->buyer->email)->send(
                new PaymentMail($order, $order->buyer, $order->item)
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Payment successful',
                'data' => $order->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}