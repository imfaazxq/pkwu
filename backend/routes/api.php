<?php

use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\AdminAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Route yang butuh autentikasi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);
});

// Client routes
Route::get('/clients', [ClientController::class, 'index']);
Route::post('/clients', [ClientController::class, 'store']);
Route::get('/clients/{id}', [ClientController::class, 'show']);
Route::put('/clients/{id}', [ClientController::class, 'update']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy']);

// Testimonial routes - FIXED

Route::get('/testimonials', [TestimonialController::class, 'adminIndex']); // For admin - get all testimonials
Route::get('/testimonials/public', [TestimonialController::class, 'apiIndex']); // For public - get active only
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'apiShow']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);