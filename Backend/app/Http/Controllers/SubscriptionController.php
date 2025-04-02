<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    /**
     * List users I'm following
     */
    public function following()
    {
        $following = Auth::user()->following()
            ->with('following')
            ->paginate(10);

        return response()->json([
            'data' => $following
        ]);
    }

    /**
     * List my followers
     */
    public function followers()
    {
        $followers = Auth::user()->followers()
            ->with('follower')
            ->paginate(10);

        return response()->json([
            'data' => $followers
        ]);
    }

    /**
     * Follow a user
     */
    public function follow(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json([
                'message' => 'You cannot follow yourself'
            ], 422);
        }

        if (Auth::user()->isFollowing($user)) {
            return response()->json([
                'message' => 'Already following this user'
            ], 422);
        }

        Auth::user()->following()->attach($user->id);

        return response()->json([
            'message' => 'Successfully followed user',
            'data' => $user
        ], 201);
    }

    /**
     * Unfollow a user
     */
    public function unfollow(User $user)
    {
        if (!Auth::user()->isFollowing($user)) {
            return response()->json([
                'message' => 'Not following this user'
            ], 422);
        }

        Auth::user()->following()->detach($user->id);

        return response()->json([
            'message' => 'Successfully unfollowed user'
        ]);
    }

    /**
     * Check if following a user
     */
    public function checkFollowing(User $user)
    {
        return response()->json([
            'following' => Auth::user()->isFollowing($user)
        ]);
    }
}