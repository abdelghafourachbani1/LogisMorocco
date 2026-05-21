<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'LogiMorocco') }}</title>

        <!-- Fonts: Using Inter for a clean, industrial SaaS look -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased bg-white selection:bg-brand-500 selection:text-white" x-data="{ 
        scrolledFromTop: false,
        mobileMenuOpen: false
    }" 
    @scroll.window="scrolledFromTop = (window.pageYOffset > 50)">
        
        <!-- Navigation matching Figma Mockup -->
        <nav :class="{'bg-white/60 backdrop-blur-xl shadow-sm border-b border-gray-100 py-3': scrolledFromTop, 'bg-transparent py-5': !scrolledFromTop}" class="fixed w-full z-50 transition-all duration-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center">
                    <!-- Logo & Left Links -->
                    <div class="flex items-center gap-10">
                        <a href="/" class="flex items-center gap-2 group" wire:navigate>
                            <span class="text-xl font-black text-gray-900 tracking-tight group-hover:text-brand-500 transition-colors">Logi<span class="text-brand-500">Morocco</span></span>
                        </a>
                        
                        <!-- Center Links -->
                        <div class="hidden md:flex items-center space-x-8">
                            <a href="/#features" class="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">Product</a>
                            <a href="/#network" class="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">Network</a>
                            <a href="/#pricing" class="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">Pricing</a>
                            <a href="/about" class="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors" wire:navigate>About</a>
                            <a href="/contact" class="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors" wire:navigate>Contact</a>
                        </div>
                    </div>

                    <!-- Right Buttons -->
                    <div class="hidden md:flex items-center space-x-6">
                        <button class="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Search">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        
                        <div class="h-4 w-px bg-gray-200"></div>

                        @if (Route::has('login'))
                            @auth
                                <a href="{{ url('/dashboard') }}" class="text-sm font-bold text-gray-900 hover:text-brand-500 transition-colors" wire:navigate>Dashboard</a>
                            @else
                                <a href="{{ route('login') }}" class="text-sm font-semibold text-gray-900 hover:text-brand-500 transition-colors border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-900" wire:navigate>Log In</a>
                                @if (Route::has('register'))
                                    <a href="{{ route('register') }}" class="px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5" wire:navigate>Start Shipping</a>
                                @endif
                            @endauth
                        @endif
                    </div>
                    
                    <!-- Mobile menu button -->
                    <div class="flex md:hidden items-center gap-4">
                        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-900 focus:outline-none">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path x-show="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path x-show="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x-cloak d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div x-show="mobileMenuOpen" class="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-full shadow-xl" x-cloak x-transition>
                <div class="px-4 py-6 space-y-2 flex flex-col">
                    <a href="/#features" @click="mobileMenuOpen = false" class="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">Product</a>
                    <a href="/#network" @click="mobileMenuOpen = false" class="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">Network</a>
                    <a href="/#pricing" @click="mobileMenuOpen = false" class="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">Pricing</a>
                    <a href="/about" @click="mobileMenuOpen = false" class="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50" wire:navigate>About</a>
                    <a href="/contact" @click="mobileMenuOpen = false" class="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50" wire:navigate>Contact</a>
                    <div class="border-t border-gray-100 pt-6 mt-4 flex flex-col gap-3">
                        @if (Route::has('login'))
                            @auth
                                <a href="{{ url('/dashboard') }}" class="block w-full text-center px-4 py-3 rounded-lg font-bold text-white bg-brand-500">Dashboard</a>
                            @else
                                <a href="{{ route('login') }}" class="block w-full text-center px-4 py-3 rounded-lg font-bold text-gray-900 border border-gray-200">Log In</a>
                                @if (Route::has('register'))
                                    <a href="{{ route('register') }}" class="block w-full text-center px-4 py-3 rounded-lg font-bold text-white bg-brand-500">Start Shipping</a>
                                @endif
                            @endauth
                        @endif
                    </div>
                </div>
            </div>
        </nav>

        <main>
            {{ $slot }}
        </main>

        <!-- Minimal Footer matching Figma -->
        <footer class="bg-white border-t border-gray-100 pt-20 pb-12 mt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <!-- Brand Column -->
                    <div class="col-span-1 md:col-span-1">
                        <a href="/" class="flex items-center gap-2 mb-6" wire:navigate>
                            <span class="text-xl font-black text-gray-900 tracking-tight">Logi<span class="text-brand-500">Morocco</span></span>
                        </a>
                        <p class="text-sm text-gray-500 leading-relaxed pr-4">
                            The Kingdom's leading delivery management engine. Precision, velocity, and local expertise.
                        </p>
                        <div class="flex gap-4 mt-6">
                            <a href="#" class="text-gray-400 hover:text-brand-500 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-brand-500 transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Links Columns -->
                    <div>
                        <h4 class="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Product</h4>
                        <ul class="space-y-4 text-sm text-gray-500 font-medium">
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Features</a></li>
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Integrations</a></li>
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Merchant Portal</a></li>
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Driver App</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul class="space-y-4 text-sm text-gray-500 font-medium">
                            <li><a href="/about" class="hover:text-brand-500 transition-colors" wire:navigate>About Us</a></li>
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Careers</a></li>
                            <li><a href="#" class="hover:text-brand-500 transition-colors">Network Map</a></li>
                            <li><a href="/contact" class="hover:text-brand-500 transition-colors" wire:navigate>Contact</a></li>
                        </ul>
                    </div>
                    
                    <!-- Newsletter -->
                    <div>
                        <h4 class="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Updates</h4>
                        <p class="text-sm text-gray-500 mb-4 font-medium">Subscribe to our logistics newsletter</p>
                        <form class="flex w-full gap-2">
                            <input type="email" placeholder="Email address" class="w-full bg-gray-50 border-gray-200 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 px-4 py-2" required>
                            <button type="submit" class="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Send</button>
                        </form>
                    </div>
                </div>

                <div class="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="text-sm text-gray-500 font-medium">
                        &copy; {{ date('Y') }} LogiMorocco Logistics. All rights reserved.
                    </div>
                    <div class="flex gap-6 text-sm font-medium text-gray-500">
                        <a href="#" class="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" class="hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" class="hover:text-gray-900 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>
</html>

