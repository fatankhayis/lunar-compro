<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    // Get all users (super admin only)
    public function index(Request $request)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $perPage = (int) $request->query('per_page', 10);
        $page = (int) $request->query('page', 1);

        $paginator = User::query()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'data' => [
                'data' => $paginator->items(),
                'current_page' => $paginator->currentPage(),
                'next_page_url' => $paginator->nextPageUrl(),
                'prev_page_url' => $paginator->previousPageUrl(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ], 200);
    }

    // Create new blog author (super admin only)
    public function store(Request $request)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized - Only super admin can create users',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
            'role' => 'required|in:blog_author,super_admin',
        ]);

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'data' => $newUser->only(['id', 'name', 'email', 'role']),
        ], 201);
    }

    // Update user (super admin can update anyone, user can update own password/name)
    public function update(Request $request, string $id)
    {
        $authUser = auth()->user();
        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        // Only super admin can update other users
        if ($authUser->id !== $targetUser->id && !$authUser->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $data = [];

        if ($request->has('name')) {
            $request->validate(['name' => 'string|max:255']);
            $data['name'] = $request->name;
        }

        if ($request->has('email')) {
            $request->validate(['email' => 'email|unique:users,email,' . $targetUser->id]);
            $data['email'] = $request->email;
        }

        if ($request->has('password')) {
            $request->validate(['password' => ['required', Password::min(8)->mixedCase()->numbers()]]);
            $data['password'] = Hash::make($request->password);
        }

        // Only super admin can change role
        if ($request->has('role') && $authUser->isSuperAdmin()) {
            $request->validate(['role' => 'in:blog_author,super_admin']);
            $data['role'] = $request->role;
        }

        $targetUser->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully',
            'data' => $targetUser->only(['id', 'name', 'email', 'role']),
        ], 200);
    }

    // Delete user (super admin only)
    public function destroy(string $id)
    {
        $authUser = auth()->user();
        
        if (!$authUser || !$authUser->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',
            ], 404);
        }

        // Prevent deleting self
        if ($authUser->id === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete yourself',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully',
        ], 200);
    }
}
