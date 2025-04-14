<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BuyerSellerController extends Controller
{
    /**
     * Get authenticated user's profile
     */
    public function getProfile()
    {
        $user = Auth::user()->loadCount([
            'items',
            'followers',
            'following',
            'sellingOrders',
            'buyingOrders'
        ]);

        return response()->json([
            'data' => $user
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $validated['profile_photo'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user->fresh()
        ]);
    }

    /**
     * Get user's listed items
     */
    public function getMyItems(Request $request)
    {
        $items = Auth::user()->items()
            ->with(['category', 'favorites'])
            ->withCount(['comments'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $items
        ]);
    }

    /**
     * Get user's purchase history
     */
    public function getPurchaseHistory()
    {
        $orders = Auth::user()->buyingOrders()
            ->with(['item.category', 'seller'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $orders
        ]);
    }

    /**
     * Get user's sales history
     */
    public function getSalesHistory()
    {
        $orders = Auth::user()->sellingOrders()
            ->with(['item.category', 'buyer'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $orders
        ]);
    }

    /**
     * Get user's followers
     */
    public function getFollowers()
    {
        $followers = Auth::user()->followers()
            ->withCount(['items', 'followers'])
            ->paginate(10);

        return response()->json([
            'data' => $followers
        ]);
    }

    /**
     * Get users being followed
     */
    public function getFollowing()
    {
        $following = Auth::user()->following()
            ->withCount(['items', 'followers'])
            ->paginate(10);

        return response()->json([
            'data' => $following
        ]);
    }
    /**
 * Get user by ID
 */
public function getUserById(User $user) {
    $user->loadCount(['items', 'followers', 'following']);
    return response()->json([
        'data' => $user
    ]);
}

public function getUserItems(User $user) {
    $items = $user->items()
        ->with(['category'])
        ->withCount(['comments', 'favorites as likes_count'])
        ->latest()
        ->get();
        
    return response()->json([
        'data' => $items
    ]);
}
}