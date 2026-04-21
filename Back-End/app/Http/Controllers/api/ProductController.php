<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $products
        ], 200);
    }

    public function order()
    {
        $products = Product::whereNotNull('order_by')->orderBy('order_by', 'asc')->take(3)->get();

        if ($products->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $products
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:500',
            'product_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'required|integer',
            'link' => 'required|url|max:2048',
        ]);

        $path = ImageService::uploadAndCompressToWebp($request->file('product_image'), 'products', 75);


        $product = Product::create([
            'title' => $request->title,
            'description' => $request->description,
            'product_image' => $path,
            'order_by' => $request->order_by,
            'link' => $request->link,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        if (is_null($product)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        if (is_null($product)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:500',
            'product_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'sometimes|nullable|integer',
            'link' => 'sometimes|nullable|url|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'order_by', 'link']);
        $image = $product->product_image;

        if ($request->hasFile('product_image')) {
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }

            $image = ImageService::uploadAndCompressToWebp($request->file('product_image'), 'products', 75);
            $data['product_image'] = $image;
        }

        $product->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        if (is_null($product)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        $image = $product->product_image;
        if ($image && Storage::disk('public')->exists($image)) {
            Storage::disk('public')->delete($image);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ], 200);
    }
}
