<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MerchantSettingsController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\DriverController;

// Public Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Users Management
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    Route::post('/admin/users/{id}/approve', [UserController::class, 'approve']);

    // Finances Management
    Route::get('/finance', [FinanceController::class, 'index']);
    Route::post('/finance/payout', [FinanceController::class, 'processPayout']);
    Route::post('/finance/collect', [FinanceController::class, 'processCollection']);

    // Dashboard Metrics
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/import/template', [OrderController::class, 'importTemplate']);
    Route::post('/orders/import/preview', [OrderController::class, 'previewImport']);
    Route::post('/orders/import/confirm', [OrderController::class, 'confirmImport']);
    Route::post('/orders/{id}/claim', [OrderController::class, 'claim']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Merchant Api Settings
    Route::get('/merchant/tokens', [MerchantSettingsController::class, 'index']);
    Route::post('/merchant/tokens', [MerchantSettingsController::class, 'generate']);
    Route::delete('/merchant/tokens/{tokenId}', [MerchantSettingsController::class, 'delete']);
    Route::post('/merchant/webhook', [MerchantSettingsController::class, 'updateWebhook']);
    Route::post('/merchant/webhook/test', [MerchantSettingsController::class, 'testWebhook']);

    // Merchant Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Merchant Customers
    Route::get('/customers', [CustomerController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Merchant Team Management
    Route::get('/team', [TeamController::class, 'index']);
    Route::post('/team', [TeamController::class, 'store']);
    Route::put('/team/{id}', [TeamController::class, 'update']);
    Route::delete('/team/{id}', [TeamController::class, 'destroy']);

    // Driver Operations
    Route::get('/driver/dashboard', [DriverController::class, 'dashboard']);
    Route::get('/driver/orders/available', [DriverController::class, 'availableOrders']);
    Route::post('/driver/orders/{id}/claim', [DriverController::class, 'claimOrder']);
    Route::post('/driver/orders/{id}/reject', [DriverController::class, 'rejectOrder']);
    Route::get('/driver/orders/active', [DriverController::class, 'activeDeliveries']);
    Route::post('/driver/orders/{id}/status', [DriverController::class, 'updateStatus']);
    Route::get('/driver/history', [DriverController::class, 'history']);
    Route::get('/driver/wallet', [DriverController::class, 'wallet']);
    Route::get('/driver/performance', [DriverController::class, 'performance']);
    Route::put('/driver/profile', [DriverController::class, 'updateProfile']);
});
