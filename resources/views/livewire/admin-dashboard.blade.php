<div class="py-8 space-y-8">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform-wide statistics and recent activity.</p>
        </div>
    </div>

    <!-- Main KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Orders -->
        <div class="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <p class="text-sm font-medium text-brand-100 mb-1 relative z-10">Total Orders</p>
            <h4 class="text-4xl font-black text-white relative z-10">{{ number_format($stats['total_orders']) }}</h4>
        </div>

        <!-- COD Collected -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-sm font-medium text-green-100 mb-1 relative z-10">COD Collected</p>
            <h4 class="text-3xl font-black text-white relative z-10">{{ number_format($stats['total_cod_collected'], 0) }} <span class="text-sm font-normal">MAD</span></h4>
        </div>

        <!-- Total Merchants -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg class="w-16 h-16 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h8"></path></svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Merchants</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($stats['total_merchants']) }}</h4>
        </div>

        <!-- Total Drivers -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg class="w-16 h-16 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Drivers (Livreurs)</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($stats['total_livreurs']) }}</h4>
        </div>
    </div>

    <!-- Order Status Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 text-center">
            <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pending</h5>
            <p class="text-3xl font-bold text-yellow-500">{{ number_format($stats['pending_orders']) }}</p>
        </div>
        <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 text-center">
            <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">In Transit</h5>
            <p class="text-3xl font-bold text-blue-500">{{ number_format($stats['in_transit_orders']) }}</p>
        </div>
        <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm p-6 text-center">
            <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delivered</h5>
            <p class="text-3xl font-bold text-green-500">{{ number_format($stats['delivered_orders']) }}</p>
        </div>
    </div>

    <!-- Recent Platform Activity -->
    <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Orders Overview</h3>
            <a href="{{ route('admin.orders') }}" wire:navigate class="text-sm font-medium text-brand-500 hover:text-brand-600">View all &rarr;</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                    <tr>
                        <th scope="col" class="px-6 py-4">Tracking</th>
                        <th scope="col" class="px-6 py-4">Merchant</th>
                        <th scope="col" class="px-6 py-4">Driver</th>
                        <th scope="col" class="px-6 py-4">COD Amount</th>
                        <th scope="col" class="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentOrders as $order)
                        <tr class="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {{ $order->tracking_number }}
                            </td>
                            <td class="px-6 py-4">
                                {{ $order->merchant->name ?? 'N/A' }}
                            </td>
                            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                                {{ $order->livreur->name ?? 'Unassigned' }}
                            </td>
                            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                {{ number_format($order->amount_cod, 2) }} MAD
                            </td>
                            <td class="px-6 py-4">
                                @php
                                    $colors = [
                                        'pending' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
                                        'in_transit' => 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
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
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No orders created yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
