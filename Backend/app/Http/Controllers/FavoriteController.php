<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Get all user's liked items
     */
    public function index()
    {
        $favorites = Auth::user()
            ->favorites()
            ->with(['item.seller', 'item.category'])
            ->paginate(10);

        return response()->json(['data' => $favorites]);
    }

    /**
     * Like an item
     */
    public function like(Item $item)
    {
        if (Auth::user()->hasLiked($item)) {
            return response()->json(['message' => 'Item already liked'], 422);
        }

        $favorite = Favorite::create([
            'user_id' => Auth::id(),
            'item_id' => $item->id
        ]);

        return response()->json([
            'data' => $favorite->load('item')
        ], 201);
    }

    /**
     * Unlike an item
     */
    public function unlike(Item $item)
    {
        $deleted = Auth::user()
            ->favorites()
            ->where('item_id', $item->id)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Like not found'], 404);
        }

        return response()->json(['message' => 'Removed Item from favorites'], 200);
    }

    /**
     * Check if user liked an item
     */
    public function checkLike(Item $item)
    {
        return response()->json([
            'liked' => Auth::user()->hasLiked($item)
        ]);
    }

    /**
     * Get the number of likes for an item
     */
    public function likesCount(Item $item)
    {
        $likesCount = $item->likesCount();

        return response()->json(['likes_count' => $likesCount]);
    }
}