<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categoryId = $request->query('category_id');

        $query = Partner::with('category')
            ->when($categoryId, fn($q) => $q->where('category_id', $categoryId));

        if ($request->has('page')) {
            $partners = $query->paginate(6);

            if ($partners->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => $partners,
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $partners
            ], 200);
        }

        $partners = $query->get();

        if ($partners->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $partners
        ], 200);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'partner_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480',
            'category_id' => 'required|exists:categories,category_id',
        ]);

        $path = ImageService::uploadAndCompressToWebp($request->file('partner_image'), 'partners', 75);


        $partner = Partner::create([
            'name' => $request->name,
            'partner_image' => $path,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $partner
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $partner = Partner::find($id);
        if (is_null($partner)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Partner not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $partner
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $partner = Partner::find($id);
        if (is_null($partner)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Partner not found'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'partner_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'category_id' => 'required|exists:categories,category_id',
        ]);

        $image = $partner->partner_image;

        if ($request->hasFile('partner_image')) {
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }

            $image = ImageService::uploadAndCompressToWebp($request->file('partner_image'), 'partners', 75);
        }

        $partner->update([
            'name' => $request->name,
            'category_id' => $request->category_id,
            'partner_image' => $image,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $partner
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $partner = Partner::find($id);

        if (is_null($partner)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Partner not found'
            ], 404);
        }

        if ($partner->partner_image && Storage::disk('public')->exists($partner->partner_image)) {
            Storage::disk('public')->delete($partner->partner_image);
        }

        $partner->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Partner deleted successfully'
        ], 200);
    }
}
