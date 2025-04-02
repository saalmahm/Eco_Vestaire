<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Get comments for an item
     */
    public function index(Item $item)
    {
        $comments = $item->comments()
            ->with('user')
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $comments
        ]);
    }

    /**
     * Add a comment to an item
     */
    public function store(Request $request, Item $item)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:500'
        ]);

        $comment = $item->comments()->create([
            'user_id' => Auth::id(),
            'item_id' => $item->id,
            'comment' => $validated['comment']
        ]);

        $comment->load('user');

        return response()->json([
            'data' => $comment
        ], 201);
    }

    /**
     * Update a comment
     */
    public function update(Request $request, Comment $comment)
    {
        if (Auth::id() !== $comment->user_id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:500'
        ]);

        $comment->update($validated);

        return response()->json([
            'data' => $comment->fresh('user')
        ]);
    }

    /**
     * Delete a comment
     */
    public function destroy(Comment $comment)
    {
        if (Auth::id() !== $comment->user_id && Auth::user()->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }
}