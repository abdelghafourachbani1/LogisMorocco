<div class="py-8 space-y-6">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Driver Wallet</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage COD collections and remit to admin.</p>
        </div>
        <button disabled class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-bold text-sm cursor-not-allowed border border-gray-200 dark:border-gray-700">
            Remit Cash
        </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Debt to Admin -->
        <div class="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl border border-red-400 shadow-lg relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-sm font-medium text-red-100 mb-1 relative z-10">COD to Remit (Owed to Admin)</p>
            <h4 class="text-4xl font-black text-white relative z-10">{{ number_format($balance, 2) }} <span class="text-lg font-normal text-red-200">MAD</span></h4>
        </div>

        <!-- Total Collected -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lifetime Collected (COD)</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($totalCollected, 2) }} <span class="text-sm font-normal text-gray-500">MAD</span></h4>
        </div>
    </div>

    <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                        <th scope="col" class="px-6 py-3 font-medium tracking-wider">Date</th>
                        <th scope="col" class="px-6 py-3 font-medium tracking-wider">Description</th>
                        <th scope="col" class="px-6 py-3 font-medium tracking-wider text-right">Amount</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse($transactions as $tx)
                        <tr class="bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-xs">
                                {{ $tx->created_at->format('M d, Y') }}<br>
                                <span class="text-gray-400">{{ $tx->created_at->format('H:i') }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900 dark:text-white">{{ $tx->description }}</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wider">{{ $tx->type }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <div class="font-bold {{ $tx->type === 'collection' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white' }}">
                                    {{ $tx->type === 'collection' ? '+' : '-' }}{{ number_format($tx->amount, 2) }} MAD
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                <svg class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">No transactions yet</p>
                                <p class="text-xs text-gray-500 mt-1">Once you collect COD, it will appear here.</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
