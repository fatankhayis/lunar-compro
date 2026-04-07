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

    public function index()
    {
        $posts = Post::query()
            ->with(['author:id,name,email'])
            ->orderByDesc('post_id')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $posts,
        ], 200);
    }

    public function show(string $id)
    {
        $post = Post::query()->with(['author:id,name,email'])->find($id);
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

        $post = Post::create([
            'title' => $request->title,
            'slug' => $slug,
            'excerpt' => $request->excerpt,
            'content' => $request->content,
            'cover_image' => $coverPath,
            'author_id' => $request->user()?->id,
            'is_published' => $request->boolean('is_published', true),
            'published_at' => $request->published_at,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $post,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:160',
            'excerpt' => 'sometimes|nullable|string|max:255',
            'content' => 'sometimes|required|string',
            'cover_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'sometimes|nullable|date',
        ]);

        $data = $request->only(['title', 'excerpt', 'content', 'published_at']);

        if ($request->has('is_published')) {
            $data['is_published'] = $request->boolean('is_published');
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
        $post = Post::find($id);
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found',
            ], 404);
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
}
