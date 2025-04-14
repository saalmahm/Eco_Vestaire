<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with(['category', 'seller'])
            ->where('is_sold', false)
            ->latest()
            ->paginate(4);

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|max:2048',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:new,like_new,good,fair,poor',
        ]);
        
        $imagePath = $request->file('image')->store('items', 'public');
        $validatedData['image'] = 'items/'.basename($imagePath);        
        

        $item = Auth::user()->items()->create($validatedData + [
            'published_at' => now(),
            'is_sold' => false
        ]);


        return response()->json([
            'success' => true,
            'data' => $item
        ], 201);
    }

    public function show(Item $item) 
    {
        return response()->json([
            'success' => true,
            'data' => $item->load(['seller', 'category'])
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'image' => 'sometimes|image|max:2048',
            'price' => 'sometimes|numeric|min:0',
            'condition' => 'sometimes|in:new,like_new,good,fair,poor',
        ]);

        if ($request->hasFile('image')) {
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }
            
            $imagePath = $request->file('image')->store('items', 'public');
            $validatedData['image'] = $imagePath;
        }

        $item->update($validatedData);

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully'
        ]);
    }

    /**
     * Get trending items (most favorites)
     */
    public function trending()
    {
        $items = Item::with(['category', 'seller'])
            ->where('is_sold', false)
            ->withCount(['favoritedBy as favorites_count'])
            ->orderBy('favorites_count', 'desc')
            ->paginate(10);
    
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
    /**
     * Search items by keyword
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2'
        ]);
    
        $searchTerm = $request->input('query');
    
        $items = Item::with('category')
            ->where('is_sold', false)
            ->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            })
            ->latest()
            ->paginate(10);
    
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
    /**
     * Search items by seller (@username format)
     */
    public function bySeller(Request $request)
    {
        $request->validate([
            'username' => 'required|string|min:1'
        ]);
    
        $username = $request->username;
        
        // Remove @ symbol if present
        if (str_starts_with($username, '@')) {
            $username = substr($username, 1);
        }
    
        $seller = User::where(function($q) use ($username) {
                $q->where('first_name', 'LIKE', "%{$username}%")
                  ->orWhere('last_name', 'LIKE', "%{$username}%")
                  ->orWhere('email', 'LIKE', "%{$username}%");
            })
            ->first();
    
        if (!$seller) {
            return response()->json([
                'success' => false,
                'message' => 'Seller not found'
            ], 404);
        }
    
        return response()->json([
            'success' => true,
            'data' => $seller
        ]);
    }

    /**
     * Filter items by category
     */
    public function byCategory($categoryId)
    {
        $items = Item::with(['category', 'seller'])
            ->where('is_sold', false)
            ->where('category_id', $categoryId)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }
}

