<div class="py-8 space-y-6">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Finances</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your earnings and pending payouts.</p>
        </div>
        <button disabled class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl font-bold text-sm cursor-not-allowed border border-gray-200 dark:border-gray-700">
            Request Payout
        </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Available Balance -->
        <div class="bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-2xl border border-brand-400 shadow-lg relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-sm font-medium text-brand-100 mb-1 relative z-10">Available Balance</p>
            <h4 class="text-4xl font-black text-white relative z-10">{{ number_format($availableBalance, 2) }} <span class="text-lg font-normal text-brand-200">MAD</span></h4>
        </div>

        <!-- Total Collected -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lifetime Collected (COD)</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($totalCollected, 2) }} <span class="text-sm font-normal text-gray-500">MAD</span></h4>
        </div>

        <!-- Pending in Transit -->
        <div class="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expected (In Transit & Pending)</p>
            <h4 class="text-3xl font-black text-gray-900 dark:text-white">{{ number_format($totalPending, 2) }} <span class="text-sm font-normal text-gray-500">MAD</span></h4>
        </div>
    </div>

    <div class="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden p-12 text-center">
        <div class="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Payout History Empty</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">No payout records found. Once you request a payout, your transaction history will appear here.</p>
    </div>
</div>
