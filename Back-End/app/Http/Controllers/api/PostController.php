<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function publicIndex(Request $request)
    {
        $query = Post::query()
            ->with(['author:id,name,email'])
            ->where('is_published', true)
            ->orderByRaw('published_at IS NULL')
            ->orderByDesc('published_at')
            ->orderByDesc('post_id')
            ;

        $perPage = (int) $request->query('per_page', 0);
        $page = (int) $request->query('page', 1);

        if ($perPage > 0) {
            $perPage = max(1, min($perPage, 50));
            $page = max(1, $page);

            $paginator = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'status' => 'success',
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ], 200);
        }

        $posts = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $posts,
        ], 200);
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        
        $perPage = (int) $request->query('per_page', 10);
        $page = (int) $request->query('page', 1);
        $status = $request->query('status');
        
        $query = Post::query()
            ->with(['author:id,name,email']);
        
        // Super admin: lihat semua blog
        if ($user && $user->isSuperAdmin()) {
            // Super admin bisa lihat semua
        } else {
            // Blog author: hanya lihat blog mereka sendiri
            $query->where('author_id', $user?->id);
        }
        
        // Filter by status jika ada
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        
        $paginator = $query
            ->orderByDesc('post_id')
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

    public function show(string $id)
    {
        $post = Post::query()->with(['author:id,name,email'])->where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ], 200);
    }

    public function showBySlug(string $slug)
    {
        $post = Post::query()
            ->with(['author:id,name,email'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ], 200);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Only super admin dan blog author bisa buat post
        if (!$user || ($user->role !== 'super_admin' && $user->role !== 'blog_author')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:160',
            'excerpt' => 'sometimes|nullable|string|max:255',
            'content' => 'required|string',
            'cover_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'sometimes|nullable|date',
        ]);

        $slugBase = Str::slug($request->title);
        $slug = $slugBase;
        $suffix = 2;
        while (Post::query()->where('slug', $slug)->exists()) {
            $slug = $slugBase . '-' . $suffix;
            $suffix++;
        }

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = ImageService::uploadAndCompressToWebp($request->file('cover_image'), 'posts', 75);
        }

        // Blog author: status = pending_approval, super admin: published langsung
        $status = $user->isBlogAuthor() ? 'pending_approval' : 'published';
        $isPublished = $user->isSuperAdmin() && $request->boolean('is_published', true);

        $post = Post::create([
            'title' => $request->title,
            'slug' => $slug,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'cover_image' => $coverPath,
            'author_id' => $user->id,
            'is_published' => $isPublished,
            'published_at' => $isPublished ? now() : null,
            'status' => $status,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $post = Post::where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $user = auth()->user();
        
        // Blog author hanya bisa edit post mereka sendiri
        if ($user && $user->isBlogAuthor() && $post->author_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:160',
            'excerpt' => 'sometimes|nullable|string|max:255',
            'content' => 'sometimes|required|string',
            'cover_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'sometimes|nullable|date',
            'status' => 'sometimes|in:draft,pending_approval,published,archived',
        ]);

        $data = $request->only(['title', 'excerpt', 'content', 'published_at', 'status']);

        if ($request->has('is_published')) {
            $data['is_published'] = $request->boolean('is_published');
        }

        // ✅ Enforce rules for blog author
        if ($user && $user->isBlogAuthor()) {
            unset($data['is_published']);
            unset($data['published_at']);

            // Blog author changes always go back to pending approval
            $data['status'] = 'pending_approval';
            $data['is_published'] = false;
            $data['published_at'] = null;
        }

        if ($request->has('title') && is_string($request->title) && $request->title !== $post->title) {
            $slugBase = Str::slug($request->title);
            $slug = $slugBase;
            $suffix = 2;
            while (Post::query()->where('slug', $slug)->where('post_id', '!=', $post->post_id)->exists()) {
                $slug = $slugBase . '-' . $suffix;
                $suffix++;
            }
            $data['slug'] = $slug;
        }

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image && Storage::disk('public')->exists($post->cover_image)) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $data['cover_image'] = ImageService::uploadAndCompressToWebp($request->file('cover_image'), 'posts', 75);
        }

        $post->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ], 200);
    }

    public function destroy(string $id)
    {
        $post = Post::where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        // Super admin can delete any post; blog author only their own
        if ($user->isBlogAuthor() && $post->author_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        if ($post->cover_image && Storage::disk('public')->exists($post->cover_image)) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $post->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully',
        ], 200);
    }

    // Approve blog (only super admin)
    public function approve(Request $request, string $id)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized - Only super admin can approve',
            ], 403);
        }

        $post = Post::where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $post->update([
            'status' => 'published',
            'is_published' => true,
            'published_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Post approved successfully',
            'data' => $post,
        ], 200);
    }

    // Archive blog (only super admin)
    public function archive(Request $request, string $id)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized - Only super admin can archive',
            ], 403);
        }

        $post = Post::where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $post->update([
            'status' => 'archived',
            'is_published' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Post archived successfully',
            'data' => $post,
        ], 200);
    }

    // Unarchive blog
    public function unarchive(Request $request, string $id)
    {
        $user = auth()->user();
        
        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized - Only super admin can unarchive',
            ], 403);
        }

        $post = Post::where('post_id', $id)->first();
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $post->update([
            'status' => 'published',
            'is_published' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Post unarchived successfully',
            'data' => $post,
        ], 200);
    }
}
