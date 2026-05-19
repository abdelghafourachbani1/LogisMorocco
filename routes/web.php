<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');
Route::view('/about', 'about')->name('about');
Route::view('/contact', 'contact')->name('contact');

Route::middleware(['auth'])->group(function () {
    Route::view('/dashboard', 'dashboard')->name('dashboard');
    
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

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

Route::post('logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->middleware(['auth'])->name('logout');

require __DIR__.'/auth.php';
