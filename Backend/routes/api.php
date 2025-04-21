<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BuyerSellerController;
use App\Http\Controllers\FeedController;

// AUT H E N T I C A T I O N
Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// I T E M S 
Route::get('/items/search', [ItemController::class, 'search']);

// USER ROUTES
Route::get('/users/{user}', [BuyerSellerController::class, 'getUserById']);
Route::get('/items/user/{user}', [BuyerSellerController::class, 'getUserItems']);

Route::get('/items/trending', [ItemController::class, 'trending']);
Route::get('/items/search/by-seller', [ItemController::class, 'bySeller']);
Route::get('/items/category/{categoryId}', [ItemController::class, 'byCategory']);
Route::get('/items/{item}/order-status', [ItemController::class, 'checkOrderStatus']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('items', ItemController::class)->except(['index', 'show']);
});
Route::apiResource('items', ItemController::class)->only(['index', 'show']);

// C A T E G O R Y
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
});
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
// O R D E R S
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class)->except(['destroy']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
    // P A Y M E N T
    Route::post('/orders/{order}/pay', [PaymentController::class, 'processPayment']);
});

// F A V O R I T E S
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/items/{item}/like', [FavoriteController::class, 'like']);
    Route::delete('/items/{item}/like', [FavoriteController::class, 'unlike']);
    Route::get('/items/{item}/like-status', [FavoriteController::class, 'checkLike']);
});
Route::get('/items/{item}/likes-count', [FavoriteController::class, 'likesCount']);

// C O M M E N T S
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('comments', CommentController::class)->except(['index', 'store']);
    Route::post('items/{item}/comments', [CommentController::class, 'store']);
});
Route::get('items/{item}/comments', [CommentController::class, 'index']); 

// S U B S C R I P T I O N
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/followers', [SubscriptionController::class, 'followers']);
    Route::get('/following', [SubscriptionController::class, 'following']);
    Route::post('/users/{user}/follow', [SubscriptionController::class, 'follow']);
    Route::delete('/users/{user}/follow', [SubscriptionController::class, 'unfollow']);
    Route::get('/users/{user}/follow-status', [SubscriptionController::class, 'checkFollowing']);
    Route::delete('/users/{user}/follower', [SubscriptionController::class, 'removeFollower']);
});

// A D M I N
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/users', [AdminController::class, 'manageUsers']);
    Route::put('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
    
    Route::get('/items', [AdminController::class, 'getItems']);
    Route::delete('/items/{item}', [AdminController::class, 'deleteItem']);
    Route::get('/comments', [AdminController::class, 'getComments']);
    Route::delete('/comments/{comment}', [AdminController::class, 'deleteComment']);
    
    Route::get('/orders', [AdminController::class, 'getOrders']);
    
    Route::get('/stats', [AdminController::class, 'getStatistics']);
});

// U S E R
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [BuyerSellerController::class, 'getProfile']);
    Route::post('/profile', [BuyerSellerController::class, 'updateProfile']);
    
    Route::get('/profile/items', [BuyerSellerController::class, 'getMyItems']);
    
    Route::get('/profile/purchases', [BuyerSellerController::class, 'getPurchaseHistory']);
    Route::get('/profile/sales', [BuyerSellerController::class, 'getSalesHistory']);
    
    Route::get('/profile/followers', [BuyerSellerController::class, 'getFollowers']);
    Route::get('/profile/following', [BuyerSellerController::class, 'getFollowing']);
});

// F E E D
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/feed/following-items', [FeedController::class, 'getFollowingItems']);
});