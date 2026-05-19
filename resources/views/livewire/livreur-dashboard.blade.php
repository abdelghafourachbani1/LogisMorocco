<div class="py-8 space-y-8">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Hello, {{ auth()->user()->name }}!</p>
        </div>
        <div>
            <a href="{{ route('livreur.orders') }}" wire:navigate class="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition shadow-lg shadow-brand-500/30">
                Find Deliveries
            </a>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Active Deliveries -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <p class="text-sm font-medium text-blue-100 mb-1 relative z-10">Active Deliveries</p>
            <h4 class="text-4xl font-black text-white relative z-10">{{ number_format($stats['active_deliveries']) }}</h4>
        </div>

        <!-- Available to Claim -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg class="w-16 h-16 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available to Claim</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($stats['available_orders']) }}</h4>
        </div>

        <!-- Total Delivered -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg class="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Delivered</p>
            <h4 class="text-3xl font-black text-green-600 dark:text-green-400">{{ number_format($stats['delivered_count']) }}</h4>
        </div>

        <!-- COD to Remit (Balance) -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-sm font-medium text-red-600 dark:text-red-400 mb-1">COD to Remit (Admin)</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($stats['balance'], 2) }} <span class="text-sm font-normal text-gray-500">MAD</span></h4>
        </div>
    </div>

    <!-- Recent Deliveries -->
    <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Deliveries</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                    <tr>
                        <th scope="col" class="px-6 py-4">Tracking Number</th>
                        <th scope="col" class="px-6 py-4">Customer</th>
                        <th scope="col" class="px-6 py-4">Amount</th>
                        <th scope="col" class="px-6 py-4">Final Status</th>
                        <th scope="col" class="px-6 py-4">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentDeliveries as $order)
                        <tr class="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {{ $order->tracking_number }}
                            </td>
                            <td class="px-6 py-4">
                                {{ $order->customer_name }}
                            </td>
                            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                {{ number_format($order->amount_cod, 2) }} MAD
                            </td>
                            <td class="px-6 py-4">
                                @php
                                    $colors = [
                                        'delivered' => 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
                                        'refused' => 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
                                        'canceled' => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
                                    ];
                                    $statusClass = $colors[$order->status] ?? 'bg-gray-100 text-gray-800';
                                @endphp
                                <span class="px-2.5 py-1 text-xs font-bold rounded-full border {{ $statusClass }}">
                                    {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-xs">
                                {{ $order->updated_at->format('d M, Y H:i') }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                You haven't completed any deliveries yet. <a href="{{ route('livreur.orders') }}" wire:navigate class="text-brand-500 hover:underline">Find orders to deliver</a>.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
