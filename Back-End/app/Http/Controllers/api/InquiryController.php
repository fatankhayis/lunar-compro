<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    public function index()
    {
        $items = Inquiry::query()->orderByDesc('inquiry_id')->get();

        return response()->json([
            'status' => 'success',
            'data' => $items,
        ], 200);
    }

    public function show(string $id)
    {
        $item = Inquiry::find($id);
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Inquiry not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $item,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:200',
            'phone' => 'sometimes|nullable|string|max:40',
            'message' => 'required|string|max:5000',
            'source_url' => 'sometimes|nullable|string|max:2048',
        ]);

        $inquiry = Inquiry::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'source_url' => $request->source_url,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
            'status' => 'new',
        ]);

        $emailSent = false;
        $receiver = env('CONTACT_RECEIVER_EMAIL');
        if (is_string($receiver) && trim($receiver) !== '') {
            try {
                Mail::raw(
                    "New inquiry from {$inquiry->name}\n\nEmail: {$inquiry->email}\nPhone: {$inquiry->phone}\nSource: {$inquiry->source_url}\n\nMessage:\n{$inquiry->message}",
                    function ($message) use ($receiver) {
                        $message->to($receiver)->subject('New Request a Quote / Consultation');
                    }
                );
                $emailSent = true;
            } catch (\Throwable $e) {
                Log::warning('Inquiry email failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $inquiry,
            'email_sent' => $emailSent,
        ], 201);
    }

    public function destroy(string $id)
    {
        $item = Inquiry::find($id);
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Inquiry not found',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Inquiry deleted successfully',
        ], 200);
    }
}
