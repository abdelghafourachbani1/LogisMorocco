<?php

use App\Livewire\Forms\LoginForm;
use Illuminate\Support\Facades\Session;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public LoginForm $form;

    public function login(): void
    {
        $this->validate();

        $this->form->authenticate();

        Session::regenerate();

        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div class="min-h-screen flex w-full bg-[#F9FAFB]">
    <!-- Left: Form Area (approx 65% width) -->
    <div class="w-full lg:w-[65%] flex flex-col justify-center items-center p-8 sm:p-12 relative z-10">
        
        <!-- Header / Logo Area -->
        <div class="flex flex-col items-center mb-8 text-center">
            <div class="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4">
                <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    <!-- Using a truck-like generic icon for now -->
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path>
                </svg>
            </div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">LogiMorocco</h1>
            <p class="text-sm text-gray-500 mt-2 font-medium">Secure Admin Console access for dispatch & logistics management.</p>
        </div>

        <!-- Login Card -->
        <div class="w-full max-w-[460px] bg-white rounded-2xl border border-pink-100 shadow-[0_8px_30px_rgb(219,0,135,0.04)] p-8 sm:p-10">
            
            <!-- Role Selector Tabs -->
            <div class="flex bg-gray-50/80 p-1.5 rounded-xl mb-8">
                <button type="button" class="flex-1 flex flex-col items-center justify-center gap-1.5 bg-white text-brand-500 rounded-lg shadow-sm py-3 transition-all border border-gray-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span class="text-xs font-bold">Admin</span>
                </button>
                <button type="button" class="flex-1 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-900 rounded-lg py-3 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    <span class="text-xs font-semibold">Dispatch</span>
                </button>
                <button type="button" class="flex-1 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-900 rounded-lg py-3 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span class="text-xs font-semibold">Manager</span>
                </button>
            </div>

            <form wire:submit="login">
                <!-- Email Address -->
                <div class="mb-5">
                    <label for="email" class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <input wire:model="form.email" id="email" type="email" placeholder="name@logimorocco.ma" required autofocus autocomplete="username" class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 placeholder-gray-400 transition-colors">
                    </div>
                    <x-input-error :messages="$errors->get('form.email')" class="mt-2 text-xs" />
                </div>

                <!-- Password -->
                <div class="mb-5">
                    <div class="flex items-center justify-between mb-2">
                        <label for="password" class="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Password</label>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition-colors" wire:navigate>Forgot password?</a>
                        @endif
                    </div>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <!-- We use type password but for visual mockup we could show dots, wire:model keeps it functional -->
                        <input wire:model="form.password" id="password" type="password" placeholder="••••••••" required autocomplete="current-password" class="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 placeholder-gray-400 tracking-widest transition-colors">
                        <button type="button" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                    </div>
                    <x-input-error :messages="$errors->get('form.password')" class="mt-2 text-xs" />
                </div>

                <!-- Remember Me -->
                <div class="mb-6 flex items-center">
                    <input wire:model="form.remember" id="remember" type="checkbox" class="rounded border-gray-200 text-brand-500 shadow-sm focus:ring-brand-500 w-4 h-4">
                    <label for="remember" class="ml-2 text-[13px] font-medium text-gray-600">Stay logged in for 30 days</label>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg shadow-md shadow-brand-500/20 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5">
                    Sign In to Dashboard
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </form>

            <!-- Card Footer Links -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs font-semibold text-gray-500">
                <a href="#" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Support
                </a>
                <span class="text-gray-300">•</span>
                <a href="#" class="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    Français / Arabic
                </a>
            </div>
        </div>

        <!-- Trust Badges -->
        <div class="mt-8 flex items-center justify-center gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                ISO 9001 Certified
            </div>
            <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                TLS 1.3 Encryption
            </div>
        </div>

        <!-- Copyright footer -->
        <div class="absolute bottom-8 w-full text-center text-[11px] font-medium text-gray-400">
            &copy; {{ date('Y') }} LogiMorocco Solutions. All Rights Reserved. Morocco Logistics Infrastructure.
        </div>
    </div>

    <!-- Right: Visual/Image Background (approx 35% width) -->
    <div class="hidden lg:block lg:w-[35%] relative">
        <div class="absolute inset-0 bg-[url('/images/login-bg.png')] bg-cover bg-center"></div>
        <!-- Very light white overlay to match the reference image's faded right side style, or keep it striking if it fits -->
        <div class="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        <!-- Gradient to blend the hard edge into the white section -->
        <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F9FAFB] to-transparent"></div>
    </div>
</div>
