<!-- Wrapper to give it breathing room from the top and keep it sticky -->
<div class="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none">
    <nav x-data="{ open: false }" class="max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-100/80 dark:border-gray-800/80 rounded-2xl shadow-sm pointer-events-auto transition-all duration-300">
        <!-- Primary Navigation Menu -->
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <!-- Logo -->
                    <div class="shrink-0 flex items-center">
                        <a href="{{ route('dashboard') }}" class="flex items-center gap-2 group">
                            <div class="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                                L
                            </div>
                            <span class="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Logis<span class="text-brand-600">Maghreb</span></span>
                        </a>
                    </div>

                    <!-- Navigation Links -->
                    <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                        <x-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                            {{ __('Dashboard') }}
                        </x-nav-link>
                        
                        @if(auth()->user()->role === 'admin')
                            <x-nav-link href="#" :active="false">
                                Users
                            </x-nav-link>
                            <x-nav-link href="#" :active="false">
                                All Orders
                            </x-nav-link>
                            <x-nav-link href="#" :active="false">
                                Finances
                            </x-nav-link>
                        @elseif(auth()->user()->role === 'merchant')
                            <x-nav-link href="#" :active="false">
                                Order History
                            </x-nav-link>
                            <x-nav-link href="#" :active="false">
                                API & Webhooks
                            </x-nav-link>
                        @endif
                    </div>
                </div>

                <!-- Settings Dropdown -->
                <div class="hidden sm:flex sm:items-center sm:ms-6">
                    <!-- Balance Badge -->
                    <div class="mr-4 px-3 py-1 rounded-full text-sm font-medium {{ auth()->user()->balance >= 0 ? 'bg-accent-100 text-accent-700' : 'bg-red-100 text-red-700' }}">
                        {{ auth()->user()->role === 'livreur' ? 'Collected: ' : 'Balance: ' }} {{ number_format(auth()->user()->balance, 2) }} MAD
                    </div>

                    <x-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 backdrop-blur-sm">
                                <div>{{ Auth::user()->name }} <span class="text-xs text-brand-500 ml-1">({{ ucfirst(Auth::user()->role) }})</span></div>

                                <div class="ms-1">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </x-slot>

                        <x-slot name="content">
                            <x-dropdown-link :href="route('profile.edit')">
                                {{ __('Profile') }}
                            </x-dropdown-link>

                            <!-- Authentication -->
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf

                                <x-dropdown-link :href="route('logout')"
                                        onclick="event.preventDefault();
                                                    this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown>
                </div>

                <!-- Hamburger -->
                <div class="-me-2 flex items-center sm:hidden">
                    <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out">
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Responsive Navigation Menu -->
        <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-b-2xl border-t border-gray-100 dark:border-gray-800">
            <div class="pt-2 pb-3 space-y-1">
                <x-responsive-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                    {{ __('Dashboard') }}
                </x-responsive-nav-link>
            </div>

            <!-- Responsive Settings Options -->
            <div class="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                <div class="px-4">
                    <div class="font-medium text-base text-gray-800 dark:text-gray-200">{{ Auth::user()->name }}</div>
                    <div class="font-medium text-sm text-gray-500">{{ Auth::user()->email }}</div>
                </div>

                <div class="mt-3 space-y-1">
                    <x-responsive-nav-link :href="route('profile.edit')">
                        {{ __('Profile') }}
                    </x-responsive-nav-link>

                    <!-- Authentication -->
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf

                        <x-responsive-nav-link :href="route('logout')"
                                onclick="event.preventDefault();
                                            this.closest('form').submit();">
                            {{ __('Log Out') }}
                        </x-responsive-nav-link>
                    </form>
                </div>
            </div>
        </div>
    </nav>
</div>