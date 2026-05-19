<?php

use App\Livewire\Actions\Logout;
use Livewire\Volt\Component;

new class extends Component
{
    /**
     * Log the current user out of the application.
     */
    public function logout(Logout $logout): void
    {
        $logout();

        $this->redirect('/', navigate: true);
    }
}; ?>

<header class="z-10 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
    <div class="container flex items-center justify-between h-full px-6 mx-auto">
        <!-- Mobile hamburger -->
        <button class="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-brand-500" aria-label="Menu">
            <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
        </button>

        <div class="flex justify-center flex-1 lg:mr-32">
            <!-- Global Search (Optional placeholder) -->
            <div class="relative w-full max-w-xl mr-6 focus-within:text-brand-500 hidden md:block">
                <div class="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input class="w-full pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 bg-gray-100 dark:bg-gray-900 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-500" type="text" placeholder="Search for projects, orders, drivers..." aria-label="Search" />
            </div>
        </div>

        <ul class="flex items-center flex-shrink-0 space-x-6">
            <!-- Theme toggler -->
            <li class="flex">
                <button class="rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" @click="darkMode = !darkMode" aria-label="Toggle color mode">
                    <template x-if="!darkMode">
                        <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                    </template>
                    <template x-if="darkMode">
                        <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </template>
                </button>
            </li>

            <!-- Notifications menu -->
            <li class="relative">
                <x-dropdown align="right" width="80">
                    <x-slot name="trigger">
                        <button class="relative align-middle rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Notifications" aria-haspopup="true">
                            <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <!-- Notification badge -->
                            @if(auth()->user()->unreadNotifications->count() > 0)
                                <span aria-hidden="true" class="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-brand-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                            @endif
                        </button>
                    </x-slot>

                    <x-slot name="content">
                        <div class="max-h-96 overflow-y-auto">
                            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span class="font-bold text-sm text-gray-700 dark:text-gray-200">Notifications</span>
                                @if(auth()->user()->unreadNotifications->count() > 0)
                                    <span class="bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 text-xs px-2 py-0.5 rounded-full font-bold">{{ auth()->user()->unreadNotifications->count() }} new</span>
                                @endif
                            </div>
                            
                            @forelse(auth()->user()->notifications->take(5) as $notification)
                                <div class="px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors {{ is_null($notification->read_at) ? 'bg-brand-50/50 dark:bg-brand-900/10' : '' }}">
                                    <p class="text-sm text-gray-800 dark:text-gray-200">{{ $notification->data['message'] ?? 'New notification' }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $notification->created_at->diffForHumans() }}</p>
                                </div>
                            @empty
                                <div class="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                    <svg class="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    No new notifications.
                                </div>
                            @endforelse
                        </div>
                    </x-slot>
                </x-dropdown>
            </li>

            <!-- Profile menu -->
            <li class="relative">
                <x-dropdown align="right" width="48">
                    <x-slot name="trigger">
                        <button class="flex items-center gap-2 align-middle rounded-full focus:shadow-outline-brand focus:outline-none" aria-label="Account" aria-haspopup="true">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {{ substr(auth()->user()->name, 0, 1) }}
                            </div>
                            <div class="hidden md:flex flex-col items-start text-left">
                                <span class="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight" x-data="{{ json_encode(['name' => auth()->user()->name ?? '']) }}" x-text="name" x-on:profile-updated.window="name = $event.detail.name"></span>
                                <span class="text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">{{ auth()->user()->role }}</span>
                            </div>
                            <svg class="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                    </x-slot>

                <x-slot name="content">
                        <div class="px-4 py-3 border-b border-gray-100">
                            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Signed in as</p>
                            <p class="text-sm font-semibold text-gray-900 truncate mt-0.5">{{ auth()->user()->name }}</p>
                            <p class="text-xs text-brand-500 font-bold uppercase tracking-wider mt-0.5">{{ auth()->user()->role }}</p>
                        </div>

                        <div class="py-1">
                            <a href="{{ route('profile') }}" wire:navigate
                               class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Profile Settings
                            </a>
                        </div>

                        <div class="border-t border-gray-100">
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit"
                                        class="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    Log Out
                                </button>
                            </form>
                        </div>
                    </x-slot>
                </x-dropdown>
            </li>
        </ul>
    </div>
</header>
