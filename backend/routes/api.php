<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MerchantSettingsController;

// Public Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Users Management
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    Route::post('/admin/users/{id}/approve', [UserController::class, 'approve']);

    // Finances Management
    Route::get('/finances', [FinanceController::class, 'index']);
    Route::post('/admin/finances/payout', [FinanceController::class, 'processPayout']);
    Route::post('/admin/finances/collect', [FinanceController::class, 'processCollection']);

    // Dashboard Metrics
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{id}/claim', [OrderController::class, 'claim']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Merchant Api Settings
    Route::get('/merchant/tokens', [MerchantSettingsController::class, 'index']);
    Route::post('/merchant/tokens', [MerchantSettingsController::class, 'generate']);
    Route::delete('/merchant/tokens/{tokenId}', [MerchantSettingsController::class, 'delete']);
});
