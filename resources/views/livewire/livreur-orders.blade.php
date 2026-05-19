<div class="py-8 space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Delivery Scanner</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Claim new orders and update active deliveries.</p>
        </div>
        
        <!-- Tabs -->
        <div class="flex p-1 space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto">
            <button wire:click="setTab('available')" class="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $activeTab === 'available' ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300' }}">
                Available to Claim
            </button>
            <button wire:click="setTab('active')" class="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-colors {{ $activeTab === 'active' ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300' }}">
                Active Deliveries
            </button>
        </div>
    </div>

    @if (session()->has('message'))
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm" role="alert">
            {{ session('message') }}
        </div>
    @endif

    @if($activeTab === 'available')
        <!-- Available Orders -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @forelse($availableOrders as $order)
                <div class="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
                    <div class="p-5 flex-1">
                        <div class="flex justify-between items-start mb-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                {{ $order->tracking_number }}
                            </span>
                            <span class="text-xs text-gray-500">{{ $order->created_at->diffForHumans() }}</span>
                        </div>
                        
                        <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ number_format($order->amount_cod, 2) }} MAD</h4>
                        <p class="text-xs font-medium text-brand-600 dark:text-brand-400 mb-4 uppercase tracking-wider">COD to Collect</p>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex gap-3">
                                <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span class="text-gray-600 dark:text-gray-300">{{ $order->customer_name }} ({{ $order->customer_phone }})</span>
                            </div>
                            <div class="flex gap-3">
                                <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span class="text-gray-600 dark:text-gray-300">{{ $order->customer_address }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                        <button wire:click="claimOrder({{ $order->id }})" class="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Claim Order
                        </button>
                    </div>
                </div>
            @empty
                <div class="col-span-1 md:col-span-2 xl:col-span-3 p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                    <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">No available orders</p>
                    <p class="text-xs text-gray-500 mt-1">Check back later when merchants add new orders.</p>
                </div>
            @endforelse

            <div class="col-span-1 md:col-span-2 xl:col-span-3">
                {{ $availableOrders->links() }}
            </div>
        </div>
    @else
        <!-- Active Deliveries -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @forelse($activeDeliveries as $order)
                <div class="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-sm overflow-hidden flex flex-col relative">
                    <!-- Status Indicator Line -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    
                    <div class="p-5 flex-1">
                        <div class="flex justify-between items-start mb-4 mt-1">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                {{ $order->tracking_number }}
                            </span>
                            <a href="tel:{{ $order->customer_phone }}" class="text-brand-500 hover:text-brand-600 bg-brand-50 dark:bg-brand-900/20 p-2 rounded-lg">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </a>
                        </div>
                        
                        <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ number_format($order->amount_cod, 2) }} MAD</h4>
                        <p class="text-xs font-medium text-brand-600 dark:text-brand-400 mb-4 uppercase tracking-wider">COD to Collect</p>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex gap-3">
                                <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span class="text-gray-600 dark:text-gray-300">{{ $order->customer_name }}</span>
                            </div>
                            <div class="flex gap-3">
                                <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span class="text-gray-600 dark:text-gray-300">{{ $order->customer_address }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 grid grid-cols-2 gap-2">
                        <button wire:click="updateStatus({{ $order->id }}, 'delivered')" wire:confirm="Confirm delivery and cash collection?" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors">
                            Delivered
                        </button>
                        <div class="grid grid-cols-2 gap-2">
                            <button wire:click="updateStatus({{ $order->id }}, 'refused')" wire:confirm="Mark as refused?" class="w-full flex justify-center py-2 px-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Refused
                            </button>
                            <button wire:click="updateStatus({{ $order->id }}, 'canceled')" wire:confirm="Mark as canceled?" class="w-full flex justify-center py-2 px-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Canceled
                            </button>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-1 md:col-span-2 xl:col-span-3 p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 border-dashed">
                    <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">No active deliveries</p>
                    <p class="text-xs text-gray-500 mt-1">Go to the "Available to Claim" tab to pick up orders.</p>
                </div>
            @endforelse

            <div class="col-span-1 md:col-span-2 xl:col-span-3">
                {{ $activeDeliveries->links() }}
            </div>
        </div>
    @endif
</div>
