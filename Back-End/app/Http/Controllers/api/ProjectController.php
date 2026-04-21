<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::all();

        if ($projects->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $projects
        ], 200);
    }

    public function order()
    {
        $project = Project::whereNotNull('order_by')->orderBy('order_by', 'asc')->take(3)->get();

        if ($project->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $project
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
            'project_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'nullable|integer',
            'link' => 'nullable|url|max:2048',
        ]);

        $path = ImageService::uploadAndCompressToWebp($request->file('project_image'), 'projects', 75);

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'project_image' => $path,
            'order_by' => $request->order_by,
            'link' => $request->link,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::find($id);
        if (is_null($project)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $project
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::find($id);
        if (is_null($project)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:500',
            'project_image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'order_by' => 'sometimes|nullable|integer',
            'link' => 'sometimes|nullable|url|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'order_by', 'link']);
        $image = $project->project_image;

        if ($request->hasFile('project_image')) {
            if ($image && Storage::disk('public')->exists($image)) {
                Storage::disk('public')->delete($image);
            }

            $image = ImageService::uploadAndCompressToWebp($request->file('project_image'), 'projects', 75);
            $data['project_image'] = $image;
        }

        $project->update($data);

        return response()->json([
            'status' => 'success',
            'data' => $project
        ], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::find($id);

        if (is_null($project)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found'
            ], 404);
        }

        if ($project->project_image && Storage::disk('public')->exists($project->project_image)) {
            Storage::disk('public')->delete($project->project_image);
        }

        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Project deleted successfully'
        ], 200);
    }
}
