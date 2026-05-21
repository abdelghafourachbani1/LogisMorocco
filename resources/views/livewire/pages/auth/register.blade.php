<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public string $name = '';
    public string $email = '';
    public string $phone = '';
    public string $password = '';
    public string $password_confirmation = '';
    public string $role = 'merchant'; // default role

    public function setRole($newRole)
    {
        $this->role = $newRole;
    }

    public function register(): void
    {
        $validated = $this->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:merchant,livreur,admin'],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        // Format phone with Morocco country code
        if (!empty($validated['phone']) && !str_starts_with($validated['phone'], '+')) {
            $validated['phone'] = '+212' . ltrim($validated['phone'], '0');
        }

        // If this is the very first user, make them admin regardless of selected role
        if (User::count() === 0) {
            $validated['role'] = 'admin';
        }

        $user = User::create($validated);

        event(new Registered($user));

        Auth::login($user);

        $this->redirect(route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div class="min-h-screen flex w-full">
    <!-- Left: Dark Panel -->
    <div class="hidden lg:flex lg:w-[45%] bg-[#1c1c1e] relative overflow-hidden flex-col justify-between p-12">
        <div class="relative z-10 pt-8">
            <h1 class="text-[42px] font-black text-white tracking-tight leading-none mb-4">LogiMorocco</h1>
            <p class="text-lg text-gray-400 max-w-sm font-medium leading-snug">The next generation of logistics management for the Moroccan marketplace.</p>
        </div>

        <div class="relative z-10 pb-8">
            <!-- Pink Highlight Card -->
            <div class="bg-brand-500 rounded-2xl p-6 text-white max-w-[320px] mb-8 shadow-xl shadow-brand-500/20">
                <svg class="w-7 h-7 mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 011-1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                <p class="font-bold text-[15px] leading-relaxed">Join over 5,000+ logistics professionals optimizing their supply chain today.</p>
            </div>

            <!-- Circular Icons -->
            <div class="flex gap-4">
                <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Right: Registration Form -->
    <div class="w-full lg:w-[55%] bg-white flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <div class="w-full max-w-[480px]">
            
            <div class="mb-10">
                <h2 class="text-[32px] font-bold text-gray-900 tracking-tight mb-2">Create an Account</h2>
                <p class="text-[14px] text-gray-500 font-medium">Fill in your details to start shipping and delivering across Morocco.</p>
            </div>

            <form wire:submit="register">
                <!-- Role Toggle -->
                <div class="grid grid-cols-3 gap-3 mb-8">
                    <button type="button" wire:click="setRole('merchant')" class="relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all {{ $role === 'merchant' ? 'bg-pink-50/50 border-brand-500' : 'bg-white border-gray-200 hover:border-gray-300' }}">
                        @if($role === 'merchant')
                            <div class="absolute top-3 right-3 text-brand-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        @endif
                        <svg class="w-6 h-6 mb-2 {{ $role === 'merchant' ? 'text-gray-900' : 'text-gray-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span class="text-[13px] font-bold {{ $role === 'merchant' ? 'text-gray-900' : 'text-gray-500' }}">Merchant</span>
                    </button>
                    
                    <button type="button" wire:click="setRole('livreur')" class="relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all {{ $role === 'livreur' ? 'bg-pink-50/50 border-brand-500' : 'bg-white border-gray-200 hover:border-gray-300' }}">
                        @if($role === 'livreur')
                            <div class="absolute top-3 right-3 text-brand-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        @endif
                        <svg class="w-6 h-6 mb-2 {{ $role === 'livreur' ? 'text-gray-900' : 'text-gray-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 011-1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                        <span class="text-[13px] font-bold {{ $role === 'livreur' ? 'text-gray-900' : 'text-gray-500' }}">Driver</span>
                    </button>

                    <button type="button" wire:click="setRole('admin')" class="relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all {{ $role === 'admin' ? 'bg-pink-50/50 border-brand-500' : 'bg-white border-gray-200 hover:border-gray-300' }}">
                        @if($role === 'admin')
                            <div class="absolute top-3 right-3 text-brand-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        @endif
                        <svg class="w-6 h-6 mb-2 {{ $role === 'admin' ? 'text-gray-900' : 'text-gray-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span class="text-[13px] font-bold {{ $role === 'admin' ? 'text-gray-900' : 'text-gray-500' }}">Admin</span>
                    </button>
                </div>

                <div class="space-y-5">
                    <!-- Full Name -->
                    <div>
                        <label for="name" class="block text-[12px] font-bold text-gray-600 mb-1.5">Full Name</label>
                        <input wire:model="name" id="name" type="text" placeholder="John Doe" class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300">
                        <x-input-error :messages="$errors->get('name')" class="mt-2 text-xs" />
                    </div>

                    <!-- Email Address -->
                    <div>
                        <label for="email" class="block text-[12px] font-bold text-gray-600 mb-1.5">Email Address</label>
                        <input wire:model="email" id="email" type="email" placeholder="john@company.ma" class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300">
                        <x-input-error :messages="$errors->get('email')" class="mt-2 text-xs" />
                    </div>

                    <!-- Phone Number -->
                    <div>
                        <label for="phone" class="block text-[12px] font-bold text-gray-600 mb-1.5">Phone Number</label>
                        <div class="flex rounded-lg shadow-sm">
                            <span class="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-semibold">+212</span>
                            <input wire:model="phone" id="phone" type="text" placeholder="600-000000" class="flex-1 block w-full rounded-none rounded-r-lg border border-gray-200 bg-white text-gray-900 focus:ring-brand-500 focus:border-brand-500 sm:text-sm px-4 py-3 placeholder-gray-300">
                        </div>
                        <x-input-error :messages="$errors->get('phone')" class="mt-2 text-xs" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-[12px] font-bold text-gray-600 mb-1.5">Password</label>
                        <div class="relative">
                            <input wire:model="password" id="password" type="password" placeholder="••••••••" class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 pr-10 placeholder-gray-300 tracking-widest">
                            <button type="button" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                        <p class="text-[11px] text-gray-500 mt-2 font-medium">Must be at least 8 characters long.</p>
                        <x-input-error :messages="$errors->get('password')" class="mt-2 text-xs" />
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="password_confirmation" class="block text-[12px] font-bold text-gray-600 mb-1.5">Confirm Password</label>
                        <input wire:model="password_confirmation" id="password_confirmation" type="password" placeholder="••••••••" class="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300 tracking-widest">
                        <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2 text-xs" />
                    </div>
                </div>

                <div class="mt-6 flex items-start">
                    <div class="flex items-center h-5">
                        <input id="terms" type="checkbox" required class="w-4 h-4 bg-white border-gray-200 rounded text-brand-500 focus:ring-brand-500">
                    </div>
                    <label for="terms" class="ml-2 text-[13px] font-medium text-gray-600">
                        I agree to the <a href="#" class="text-brand-500 hover:underline font-bold">Terms of Service</a> and <a href="#" class="text-brand-500 hover:underline font-bold">Privacy Policy</a>.
                    </label>
                </div>

                <div class="mt-8">
                    <button type="submit" class="w-full flex items-center justify-center py-4 px-4 rounded-xl shadow-md shadow-brand-500/20 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5">
                        Create Account
                    </button>
                </div>
            </form>
            
            <p class="mt-8 text-center text-[13px] text-gray-500 font-medium">
                Already have an account? 
                <a href="{{ route('login') }}" class="font-bold text-gray-900 hover:text-brand-500 transition-colors" wire:navigate>Log in here</a>
            </p>
        </div>
    </div>
</div>
