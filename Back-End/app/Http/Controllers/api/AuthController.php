<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:100',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email not found'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Wrong password'
            ], 401);
        }

        $token = auth('api')->login($user);

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer'
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'authorization' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }


    public function remaining()
    {
        try {
            $token = JWTAuth::getToken();
            $payload = JWTAuth::getPayload($token);
            $exp = $payload->get('exp');
            $remaining = $exp - time();
            return response()->json(['remaining_seconds' => max(0, $remaining)]);
        } catch (\Exception $e) {
            return response()->json(['remaining_seconds' => 0]);
        }
    }
}
