<div class="py-8 space-y-6">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Financial Control</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage payouts to merchants and collect COD from drivers.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Merchant Payouts -->
        <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden p-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">Process Merchant Payout</h4>
            </div>

            @if (session()->has('merchant_success'))
                <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    {{ session('merchant_success') }}
                </div>
            @endif
            @if (session()->has('merchant_error'))
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {{ session('merchant_error') }}
                </div>
            @endif

            <form wire:submit.prevent="processPayout" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Merchant</label>
                    <select wire:model="merchantId" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4 py-2.5">
                        <option value="">-- Choose Merchant --</option>
                        @foreach($merchants as $merchant)
                            <option value="{{ $merchant->id }}">{{ $merchant->name }} (Owed: {{ number_format($merchant->balance, 2) }} MAD)</option>
                        @endforeach
                    </select>
                    @error('merchantId') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payout Amount (MAD)</label>
                    <input type="number" step="0.01" wire:model="payoutAmount" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4 py-2.5">
                    @error('payoutAmount') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                </div>
                <button type="submit" class="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition shadow-lg shadow-brand-500/30">
                    Send Payout
                </button>
            </form>
        </div>

        <!-- Livreur Collections -->
        <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden p-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">Collect from Driver</h4>
            </div>

            @if (session()->has('livreur_success'))
                <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    {{ session('livreur_success') }}
                </div>
            @endif
            @if (session()->has('livreur_error'))
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {{ session('livreur_error') }}
                </div>
            @endif

            <form wire:submit.prevent="processCollection" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Driver (Livreur)</label>
                    <select wire:model="livreurId" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4 py-2.5">
                        <option value="">-- Choose Driver --</option>
                        @foreach($livreurs as $livreur)
                            <option value="{{ $livreur->id }}">{{ $livreur->name }} (Holds: {{ number_format($livreur->balance, 2) }} MAD)</option>
                        @endforeach
                    </select>
                    @error('livreurId') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collection Amount (MAD)</label>
                    <input type="number" step="0.01" wire:model="collectionAmount" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-brand-500 focus:border-brand-500 px-4 py-2.5">
                    @error('collectionAmount') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                </div>
                <button type="submit" class="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                    Confirm Collection
                </button>
            </form>
        </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions Log</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                    <tr>
                        <th scope="col" class="px-6 py-4">Date</th>
                        <th scope="col" class="px-6 py-4">User</th>
                        <th scope="col" class="px-6 py-4">Type</th>
                        <th scope="col" class="px-6 py-4">Amount</th>
                        <th scope="col" class="px-6 py-4">Description</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentTransactions as $tx)
                        <tr class="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                {{ $tx->created_at->format('M d, Y') }}<br>
                                {{ $tx->created_at->format('H:i') }}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                {{ $tx->user->name ?? 'System' }}<br>
                                <span class="text-xs text-gray-500">{{ ucfirst($tx->user->role ?? '') }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @php
                                    $colors = [
                                        'collection' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                                        'credit' => 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                                        'payout' => 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                                        'admin_collection' => 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
                                    ];
                                    $statusClass = $colors[$tx->type] ?? 'bg-gray-100 text-gray-800';
                                @endphp
                                <span class="px-2.5 py-1 text-xs font-bold rounded-full {{ $statusClass }}">
                                    {{ str_replace('_', ' ', strtoupper($tx->type)) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-bold {{ $tx->amount < 0 ? 'text-red-500' : 'text-green-500' }}">
                                {{ $tx->amount > 0 ? '+' : '' }}{{ number_format($tx->amount, 2) }} MAD
                            </td>
                            <td class="px-6 py-4">
                                {{ $tx->description }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No transactions logged yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
