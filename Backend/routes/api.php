<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
// });

Route::get('/items/trending', [ItemController::class, 'trending']);
Route::get('/items/search', [ItemController::class, 'search']);
Route::get('/items/seller', [ItemController::class, 'bySeller']);
Route::get('/items/category/{categoryId}', [ItemController::class, 'byCategory']);
Route::apiResource('items', ItemController::class);