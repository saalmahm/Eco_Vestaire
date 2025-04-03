<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            "first_name" => "required|string|max:300",
            "last_name" => "required|string|max:300",
            "email" => "required|string|max:300|email|unique:users",
            "password" => "required|min:4",
            "profile_photo" => "nullable|image|max:2048",
        ]);
    
        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('profile_photos', 'public');
        }
    
        $user = User::create([
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "role" => 'buyer_seller',
            "status" => 'pending',
            'profile_photo' => $profilePhotoPath,
        ]);
    
        return response()->json([
            'message' => 'User registered successfully. Account pending approval.',
            'user' => [
                'id' => $user->id,
                'status' => $user->status
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|string|max:300|email",
            "password" => "required|min:4"
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Your account has been suspended. Please contact support.',
            ], 403);
        }
    
        if ($user->status === 'pending') {
            return response()->json([
                'message' => 'Your account is pending approval. Please wait or contact support.',
            ], 403);
        }
    
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name.' '.$user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged Out Successfully']);
    }
}
