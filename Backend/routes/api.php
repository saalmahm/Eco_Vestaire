<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;

// AUT H E N T I C A T I O N
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
// I T E M S
Route::get('/items/trending', [ItemController::class, 'trending']);
Route::get('/items/search', [ItemController::class, 'search']);
Route::get('/items/seller', [ItemController::class, 'bySeller']);
Route::get('/items/category/{categoryId}', [ItemController::class, 'byCategory']);  
Route::apiResource('items', ItemController::class);
// C A T E G O R Y
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
});
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
// O R D E R S
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class)->except(['destroy']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
});