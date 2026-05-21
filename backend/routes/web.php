<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'LogiMorocco API Server',
        'status' => 'active'
    ]);
});

Route::middleware(['auth'])->group(function () {
    // Merchant Routes
    Route::get('/api-settings', \App\Livewire\MerchantApiSettings::class)
        ->name('merchant.api-settings');
    Route::get('/merchant/orders', \App\Livewire\MerchantOrders::class)->name('merchant.orders');
    Route::get('/merchant/finances', \App\Livewire\MerchantFinances::class)->name('merchant.finances');

    // Livreur Routes
    Route::get('/livreur/orders', \App\Livewire\LivreurOrders::class)->name('livreur.orders');
    Route::get('/livreur/finances', \App\Livewire\LivreurFinances::class)->name('livreur.finances');

    // Admin Routes
    Route::get('/admin/users', \App\Livewire\AdminUserManagement::class)
        ->name('admin.users');
        
    Route::get('/admin/orders', \App\Livewire\AdminOrderSupervision::class)
        ->name('admin.orders');

    Route::get('/admin/finances', \App\Livewire\AdminFinancialControl::class)
        ->name('admin.finances');
});

Route::post('logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return response()->json(['message' => 'Logged out successfully']);
})->middleware(['auth'])->name('logout');

require __DIR__.'/auth.php';
