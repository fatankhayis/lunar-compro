<?php

use App\Http\Controllers\api\AnalyticsController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\CategoryController;
use App\Http\Controllers\api\CrewController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\PartnerController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\InquiryController;
use App\Http\Controllers\api\PostController;
use App\Http\Controllers\api\TestimonialController;
use App\Http\Controllers\DashboardController;
// auth
Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:api'])->group(function () {
    // auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('remaining', [AuthController::class, 'remaining']);

    // projects
    Route::post('projects', [ProjectController::class, 'store']);
    Route::post('projects/{project_id}', [ProjectController::class, 'update']);
    Route::delete('projects/{project_id}', [ProjectController::class, 'destroy']);

    // product
    Route::post('products', [ProductController::class, 'store']);
    Route::post('products/{product_id}', [ProductController::class, 'update']);
    Route::delete('products/{product_id}', [ProductController::class, 'destroy']);

    // crews
    Route::post('crews', [CrewController::class, 'store']);
    Route::post('crews/{crew_id}', [CrewController::class, 'update']);
    Route::delete('crews/{crew_id}', [CrewController::class, 'destroy']);

    // partners
    Route::post('partners', [PartnerController::class, 'store']);
    Route::post('partners/{partner_id}', [PartnerController::class, 'update']);
    Route::delete('partners/{partner_id}', [PartnerController::class, 'destroy']);


    // testimonials
    Route::post('testimonials', [TestimonialController::class, 'store']);
    Route::post('testimonials/{testimonial_id}', [TestimonialController::class, 'update']);
    Route::delete('testimonials/{testimonial_id}', [TestimonialController::class, 'destroy']);

    // blog posts (admin)
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{post_id}', [PostController::class, 'show'])->whereNumber('post_id');
    Route::post('posts', [PostController::class, 'store']);
    Route::post('posts/{post_id}', [PostController::class, 'update'])->whereNumber('post_id');
    Route::delete('posts/{post_id}', [PostController::class, 'destroy'])->whereNumber('post_id');

    // inquiries (admin)
    Route::get('inquiries', [InquiryController::class, 'index']);
    Route::get('inquiries/{inquiry_id}', [InquiryController::class, 'show']);
    Route::delete('inquiries/{inquiry_id}', [InquiryController::class, 'destroy']);

    // categories
    Route::get('categories', [CategoryController::class, 'index']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::post('categories/{category_id}', [CategoryController::class, 'update']);
    Route::delete('categories/{category_id}', [CategoryController::class, 'destroy']);
    Route::get('categories/{category_id}', [CategoryController::class, 'show']);
});


// Public routes projects
Route::get('projects/order', [ProjectController::class, 'order']);
Route::get('projects/{project_id}', [ProjectController::class, 'show']);
Route::get('projects', [ProjectController::class, 'index']);

// Public routes products
Route::get('products/order', [ProductController::class, 'order']);
Route::get('products/{product_id}', [ProductController::class, 'show']);
Route::get('products', [ProductController::class, 'index']);

// public route crews
Route::get('crews/order', [CrewController::class, 'order']);
Route::get('crews/{crew_id}', [CrewController::class, 'show']);
Route::get('crews', [CrewController::class, 'index']);

// public route partners
Route::get('partners', [PartnerController::class, 'index']);
Route::get('partners/{partner_id}', [PartnerController::class, 'show']);

// public route testimonials
Route::get('testimonials', [TestimonialController::class, 'index']);
Route::get('testimonials/{testimonial_id}', [TestimonialController::class, 'show']);

// Public routes posts (blog)
Route::get('posts/public', [PostController::class, 'publicIndex']);
Route::get('posts/slug/{slug}', [PostController::class, 'showBySlug']);

// Public route inquiries (lead capture)
Route::post('inquiries', [InquiryController::class, 'store']);

// analytics
Route::get('analytics', [AnalyticsController::class, 'getAnalytics']);