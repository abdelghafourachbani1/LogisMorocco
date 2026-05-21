@if(auth()->user()->role === 'admin')
    @component('layouts.admin-iframe')
        <iframe src="http://localhost:3001" style="width: 100%; height: 100%; border: 0; display: block; margin: 0; padding: 0;"></iframe>
    @endcomponent
@else
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-2xl text-gray-800 dark:text-gray-100 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 dark:border-gray-700">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    @if(auth()->user()->role === 'merchant')
                        <livewire:merchant-dashboard />
                    @elseif(auth()->user()->role === 'livreur')
                        <livewire:livreur-dashboard />
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
@endif
