<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedController extends Controller
{
    /**
     * Get items from users the authenticated user is following
     */
    public function getFollowingItems(Request $request)
    {
        $followingIds = Auth::user()->following()->pluck('users.id');

        $items = Item::with(['category', 'seller'])
            ->whereIn('seller_id', $followingIds)
            ->where('is_sold', false)
            ->withCount(['comments', 'favoritedBy as favorites_count'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}