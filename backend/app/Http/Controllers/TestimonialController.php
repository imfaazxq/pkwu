<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the testimonials for web view.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();
        return view('testimonials.index', compact('testimonials'));
    }

    /**
     * Display active and approved testimonials for public API.
     *
     * @return \Illuminate\Http\Response
     */
    public function apiIndex()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'position' => $testimonial->position,
                    'text' => $testimonial->text,
                    'media_url' => $testimonial->media_url,
                    'media_type' => $testimonial->media_type,
                    'status' => $testimonial->status,
                    'created_at' => $testimonial->created_at,
                ];
            });
        
        return response()->json($testimonials);
    }

    /**
     * Display ALL testimonials for admin (including pending, approved, rejected).
     *
     * @return \Illuminate\Http\Response
     */
    public function adminIndex()
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($testimonial) {
                return [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'position' => $testimonial->position,
                    'text' => $testimonial->text,
                    'media_url' => $testimonial->media_url,
                    'media_type' => $testimonial->media_type,
                    'status' => $testimonial->status,
                    'is_active' => $testimonial->is_active,
                    'created_at' => $testimonial->created_at,
                ];
            });
        
        return response()->json($testimonials);
    }

    /**
     * Get a specific testimonial for API.
     *
     * @param \App\Models\Testimonial $testimonial
     * @return \Illuminate\Http\Response
     */
    public function apiShow(Testimonial $testimonial)
    {
        return response()->json([
            'id' => $testimonial->id,
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'text' => $testimonial->text,
            'media_url' => $testimonial->media_url,
            'media_type' => $testimonial->media_type,
            'status' => $testimonial->status,
            'is_active' => $testimonial->is_active,
            'created_at' => $testimonial->created_at,
        ]);
    }

    /**
     * Store a newly created testimonial.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        \Log::info('Testimonial submission received', $request->all());
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'text' => 'required|string',
            'media' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,webm|max:20480', // 20MB max
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $mediaFile = $request->file('media');
            $mediaType = substr($mediaFile->getMimeType(), 0, 5) === 'video' ? 'video' : 'image';
            $path = $mediaFile->store('testimonials', 'public');

            $testimonial = Testimonial::create([
                'name' => $request->name,
                'position' => $request->position,
                'text' => $request->text,
                'media_path' => $path,
                'media_type' => $mediaType,
                'is_active' => true,
                'status' => 'pending', // Default to pending for admin review
            ]);

            \Log::info('Testimonial created successfully', ['id' => $testimonial->id]);

            return response()->json([
                'message' => 'Testimonial created successfully',
                'testimonial' => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'position' => $testimonial->position,
                    'text' => $testimonial->text,
                    'media_url' => $testimonial->media_url,
                    'media_type' => $testimonial->media_type,
                    'status' => $testimonial->status,
                    'created_at' => $testimonial->created_at,
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating testimonial', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create testimonial: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified testimonial.
     *
     * @param  \App\Models\Testimonial  $testimonial
     * @return \Illuminate\Http\Response
     */
    public function show(Testimonial $testimonial)
    {
        return view('testimonials.show', compact('testimonial'));
    }

    /**
     * Update the specified testimonial.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Testimonial  $testimonial
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        \Log::info('Testimonial update received', ['id' => $testimonial->id, 'data' => $request->all()]);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'text' => 'sometimes|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,webm|max:20480', // 20MB max
            'is_active' => 'sometimes|boolean',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed for update', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = [];

            // Update fields if they are provided
            if ($request->has('name')) $data['name'] = $request->name;
            if ($request->has('position')) $data['position'] = $request->position;
            if ($request->has('text')) $data['text'] = $request->text;
            if ($request->has('is_active')) $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
            if ($request->has('status')) $data['status'] = $request->status;

            if ($request->hasFile('media')) {
                // Delete old media file
                if ($testimonial->media_path) {
                    Storage::disk('public')->delete($testimonial->media_path);
                }

                // Store new media file
                $mediaFile = $request->file('media');
                $mediaType = substr($mediaFile->getMimeType(), 0, 5) === 'video' ? 'video' : 'image';
                $path = $mediaFile->store('testimonials', 'public');

                $data['media_path'] = $path;
                $data['media_type'] = $mediaType;
            }

            $testimonial->update($data);
            $testimonial->refresh(); // Refresh the model to ensure media_url is updated

            \Log::info('Testimonial updated successfully', ['id' => $testimonial->id]);

            return response()->json([
                'message' => 'Testimonial updated successfully',
                'testimonial' => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'position' => $testimonial->position,
                    'text' => $testimonial->text,
                    'media_url' => $testimonial->media_url,
                    'media_type' => $testimonial->media_type,
                    'status' => $testimonial->status,
                    'is_active' => $testimonial->is_active,
                    'created_at' => $testimonial->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating testimonial', ['id' => $testimonial->id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update testimonial: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified testimonial.
     *
     * @param  \App\Models\Testimonial  $testimonial
     * @return \Illuminate\Http\Response
     */
    public function destroy(Testimonial $testimonial)
    {
        try {
            // Delete media file
            if ($testimonial->media_path) {
                Storage::disk('public')->delete($testimonial->media_path);
            }

            $testimonial->delete();
            \Log::info('Testimonial deleted successfully', ['id' => $testimonial->id]);

            return response()->json(['message' => 'Testimonial deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Error deleting testimonial', ['id' => $testimonial->id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete testimonial: ' . $e->getMessage()], 500);
        }
    }
}