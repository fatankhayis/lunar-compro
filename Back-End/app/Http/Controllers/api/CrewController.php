<?php

namespace App\Http\Controllers\api;

use App\Services\ImageService;
use App\Http\Controllers\Controller;
use App\Models\Crew;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CrewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $crews = Crew::all();

        if ($crews->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $crews
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:100',
            'crew_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'nullable|integer',
            'title' => 'nullable|string|max:100',
        ]);

        $path = ImageService::uploadAndCompressToWebp($request->file('crew_image'), 'crews', 75);

        $crew = Crew::create([
            'name' => $request->name,
            'role' => $request->role,
            'crew_image' => $path,
            'order_by' => $request->order_by,
            'title' => $request->title,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $crew
        ], 201);
    }


    public function order()
    {
        $crew = Crew::whereNotNull('order_by')->orderBy('order_by', 'asc')->get();

        if ($crew->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $crew
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $crew = Crew::find($id);
        if (is_null($crew)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Crew not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $crew
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $crew = Crew::find($id);
        if (is_null($crew)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Crew not found'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:100',
            'crew_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'sometimes|nullable|integer',
            'title' => 'sometimes|nullable|string|max:100',
        ]);

        $data = $request->only(['name', 'role', 'order_by', 'title']);
        $image = $crew->crew_image;

        if ($request->hasFile('crew_image')) {
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }
            $image = ImageService::uploadAndCompressToWebp($request->file('crew_image'), 'crews', 75);
            $data['crew_image'] = $image;
        }

        $crew->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $crew
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $crew = Crew::find($id);

        if (is_null($crew)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Crew not found'
            ], 404);
        }

        if ($crew->crew_image && Storage::disk('public')->exists($crew->crew_image)) {
            Storage::disk('public')->delete($crew->crew_image);
        }

        $crew->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Crew deleted successfully'
        ], 200);
    }
}
