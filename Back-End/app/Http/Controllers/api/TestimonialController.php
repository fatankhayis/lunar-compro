<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('page')) {
            $testi = Testimonial::paginate(6);
        } else {
            $testi = Testimonial::all();
        }

        if ($testi->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No testimonials found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $testi
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
            'testimonial' => 'required|string|max:255',
            'video_url' => 'required|url|max:2048',
        ]);

        $testi = Testimonial::create([
            'name' => $request->name,
            'role' => $request->role,
            'testimonial' => $request->testimonial,
            'video_url' => $request->video_url,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $testi
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $testi = Testimonial::find($id);
        if (is_null($testi)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Testimonial not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $testi
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $testi = Testimonial::find($id);

        if (is_null($testi)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Testimonial not found'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:100',
            'testimonial' => 'required|string|max:255',
            'video_url' => 'required|url|max:2048',
        ]);

        $testi->update([
            'name' => $request->name,
            'role' => $request->role,
            'testimonial' => $request->testimonial,
            'video_url' => $request->video_url,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $testi
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $testi = Testimonial::find($id);

        if (is_null($testi)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Testimonial not found'
            ], 404);
        }

        $testi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted successfully'
        ], 200);
    }
}
