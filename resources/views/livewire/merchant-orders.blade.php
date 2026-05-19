<div class="py-8 space-y-6">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and track your deliveries.</p>
        </div>
    </div>

    @if (session()->has('message'))
        <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 shadow-sm" role="alert">
            {{ session('message') }}
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Create Order Form -->
        <div class="lg:col-span-1">
            <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                <h4 class="font-bold text-lg mb-6 text-gray-900 dark:text-white">New Order</h4>
                <form wire:submit="createOrder" class="space-y-4">
                    <div>
                        <x-input-label for="customer_name" value="Customer Name" class="dark:text-gray-300 text-xs uppercase tracking-wider" />
                        <x-text-input wire:model="customer_name" id="customer_name" class="block mt-1 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500 text-sm" type="text" required />
                        <x-input-error :messages="$errors->get('customer_name')" class="mt-1" />
                    </div>

                    <div>
                        <x-input-label for="customer_phone" value="Customer Phone" class="dark:text-gray-300 text-xs uppercase tracking-wider" />
                        <x-text-input wire:model="customer_phone" id="customer_phone" class="block mt-1 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500 text-sm" type="text" required />
                        <x-input-error :messages="$errors->get('customer_phone')" class="mt-1" />
                    </div>

                    <div>
                        <x-input-label for="customer_address" value="Customer Address" class="dark:text-gray-300 text-xs uppercase tracking-wider" />
                        <x-text-input wire:model="customer_address" id="customer_address" class="block mt-1 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500 text-sm" type="text" required />
                        <x-input-error :messages="$errors->get('customer_address')" class="mt-1" />
                    </div>

                    <div>
                        <x-input-label for="amount_cod" value="COD Amount (MAD)" class="dark:text-gray-300 text-xs uppercase tracking-wider" />
                        <x-text-input wire:model="amount_cod" id="amount_cod" class="block mt-1 w-full dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-brand-500 focus:border-brand-500 text-sm font-bold" type="number" step="0.01" required />
                        <x-input-error :messages="$errors->get('amount_cod')" class="mt-1" />
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/30 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:-translate-y-0.5">
                            Create Order
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="lg:col-span-3 space-y-4">
            <div class="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <!-- Toolbar -->
                <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
                    <div class="relative w-full sm:w-64">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input wire:model.live.debounce.300ms="search" type="text" class="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 dark:text-white transition-colors" placeholder="Search orders...">
                    </div>
                    
                    <div class="w-full sm:w-48">
                        <select wire:model.live="statusFilter" class="block w-full pl-3 pr-8 py-2 text-sm border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 rounded-lg bg-white dark:bg-gray-900 dark:text-white transition-colors">
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="refused">Refused</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th scope="col" class="px-6 py-3 font-medium tracking-wider">Order ID</th>
                                <th scope="col" class="px-6 py-3 font-medium tracking-wider">Customer</th>
                                <th scope="col" class="px-6 py-3 font-medium tracking-wider">Amount</th>
                                <th scope="col" class="px-6 py-3 font-medium tracking-wider">Status</th>
                                <th scope="col" class="px-6 py-3 font-medium tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            @forelse($orders as $order)
                                <tr wire:key="{{ $order->id }}" class="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="font-bold text-gray-900 dark:text-white">{{ $order->tracking_number }}</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-medium text-gray-900 dark:text-white">{{ $order->customer_name }}</div>
                                        <div class="text-xs text-gray-500">{{ $order->customer_phone }}</div>
                                        <div class="text-xs text-gray-400 truncate max-w-[200px]" title="{{ $order->customer_address }}">{{ $order->customer_address }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="font-bold text-gray-900 dark:text-white">{{ number_format($order->amount_cod, 2) }} MAD</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
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
                                        <span class="px-2.5 py-1 text-xs font-bold rounded-md border {{ $statusClass }}">
                                            {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-xs">
                                        {{ $order->created_at->format('M d, Y') }}<br>
                                        <span class="text-gray-400">{{ $order->created_at->format('H:i') }}</span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center">
                                        <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">No orders found</p>
                                        <p class="text-xs text-gray-500 mt-1">Try adjusting your filters or create a new order.</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                
                @if($orders->hasPages())
                    <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                        {{ $orders->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
