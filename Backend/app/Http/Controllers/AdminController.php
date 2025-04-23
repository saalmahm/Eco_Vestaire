<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Item;
use App\Models\Order;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Middleware\AdminMiddleware;
use App\Mail\AccountApprovalMail;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    /**
     * User Management
     */
    public function manageUsers(Request $request)
    {
        $request->validate([
            'status' => 'sometimes|in:active,pending,suspended',
            'search' => 'sometimes|string'
        ]);
    
        $query = User::where('role', '!=', 'admin')
            ->withCount([
                'items',
                'sellingOrders',
                'buyingOrders'
            ]);
        
        // Appliquer le filtre de statut si présent
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Appliquer le filtre de recherche par nom si présent
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
            });
        }
        
        $users = $query->paginate(15);
    
        return response()->json([
            'data' => $users->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->first_name.' '.$user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'profile_photo' => $user->profile_photo,  
                    'items_count' => $user->items_count,
                    'selling_orders_count' => $user->selling_orders_count,
                    'buying_orders_count' => $user->buying_orders_count,
                    'created_at' => $user->created_at,
                ];
            })
        ]);
    }

    public function updateUserStatus(User $user, Request $request)
    {
        $request->validate([
            'status' => 'required|in:active,pending,suspended'
        ]);

        $user->update(['status' => $request->status]);

        if ($request->status) {
            Mail::to($user->email)->send(
                new AccountApprovalMail($user, $request->status)
            );
        }

        return response()->json([
            'message' => 'User status updated',
            'data' => $user
        ]);
    }

    /**
     * Content Moderation
     */
    public function getItems(Request $request)
    {
        $items = Item::with(['seller', 'category'])
            ->withCount(['favorites', 'comments'])
            ->paginate(10);
    
        return response()->json(['data' => $items]);
    }

    public function deleteItem(Item $item)
    {
        $item->delete();
        return response()->json([
            'message' => 'Item deleted successfully'
        ]);
    }

    public function getComments(Request $request)
    {
        $comments = Comment::with(['user', 'item'])
            ->latest()
            ->paginate(20);

        return response()->json(['data' => $comments]);
    }

    public function deleteComment(Comment $comment)
    {
        $comment->delete();
        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Order Management
     */
    public function getOrders(Request $request)
    {
        $orders = Order::with(['item', 'buyer', 'seller'])
                ->latest()
                ->paginate(10);
    
        return response()->json(['data' => $orders]);
    }

    /**
     * Statistics Dashboard
     */
    public function getStatistics()
    {
        return response()->json([
            'data' => [
                'users' => [
                    'total' => User::count(),
                    'active' => User::where('status', 'active')->count(),
                    'new_today' => User::whereDate('created_at', today())->count()
                ],
                'items' => [
                    'total' => Item::count(),
                    'sold' => Item::where('is_sold', true)->count(),
                    'new_today' => Item::whereDate('created_at', today())->count()
                ],
                'orders' => [
                    'total' => Order::count(),
                    'completed' => Order::where('status', 'completed')->count(),
                    'revenue' => Order::where('payment_status', 'paid')->sum('amount_paid')
                ],
                'popular_categories' => DB::table('items')
                    ->selectRaw('category_id, count(*) as total')
                    ->groupBy('category_id')
                    ->orderByDesc('total')
                    ->limit(5)
                    ->get()
            ]
        ]);
    }

    /**
     * delete user
     */
    
     public function deleteUser(User $user)
{
    // Vérifier si l'utilisateur a des transactions en cours
    $hasActiveOrders = $user->sellingOrders()->whereNotIn('status', ['completed', 'cancelled'])->exists() 
        || $user->buyingOrders()->whereNotIn('status', ['completed', 'cancelled'])->exists();
    
    if ($hasActiveOrders) {
        return response()->json([
            'message' => 'Impossible de supprimer cet utilisateur car il a des commandes en cours.'
        ], 422);
    }
    
    // Suppression de l'utilisateur
    $user->delete();
    
    return response()->json([
        'message' => 'Utilisateur supprimé avec succès'
    ]);
}
}