<div>
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">API & Webhooks Settings</h3>

    @if (session()->has('message'))
        <div class="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900/30 dark:text-green-300" role="alert">
            {{ session('message') }}
        </div>
    @endif

    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">API Keys</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Use these keys to authenticate your e-commerce store (WooCommerce, Shopify) with our automated order ingestion API.</p>
            </div>
            <button wire:click="generateToken" class="px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-medium rounded-lg shadow-md transition-all hover:shadow-lg focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                Generate New Key
            </button>
        </div>

        <div class="p-6">
            @if($newToken)
                <div class="mb-6 p-4 border border-brand-200 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-800 rounded-xl">
                    <p class="text-sm font-bold text-brand-800 dark:text-brand-300 mb-2">Your New API Key:</p>
                    <div class="flex items-center gap-4">
                        <code class="px-3 py-2 bg-white dark:bg-gray-900 border border-brand-100 dark:border-brand-700 rounded-lg text-sm flex-1 break-all">{{ $newToken }}</code>
                    </div>
                    <p class="text-xs text-red-600 dark:text-red-400 mt-2 font-semibold">Copy this key immediately. You will not be able to see it again.</p>
                </div>
            @endif

            @if(count($tokens) > 0)
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-300">
                            <tr>
                                <th scope="col" class="px-4 py-3 rounded-l-lg">Name</th>
                                <th scope="col" class="px-4 py-3">Last Used</th>
                                <th scope="col" class="px-4 py-3">Created At</th>
                                <th scope="col" class="px-4 py-3 text-right rounded-r-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($tokens as $token)
                                <tr class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ $token->name }}</td>
                                    <td class="px-4 py-3">{{ $token->last_used_at ? $token->last_used_at->diffForHumans() : 'Never' }}</td>
                                    <td class="px-4 py-3">{{ $token->created_at->format('M d, Y') }}</td>
                                    <td class="px-4 py-3 text-right">
                                        <button wire:click="deleteToken({{ $token->id }})" wire:confirm="Are you sure you want to delete this API key?" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">Revoke</button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">No active API keys found.</p>
                </div>
            @endif
        </div>
    </div>
    
    <div class="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Integration Guide</h4>
        </div>
        <div class="p-6 text-sm text-gray-600 dark:text-gray-300">
            <p class="mb-4">To automatically push orders to LogisMaghreb from your e-commerce platform, send a <code class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">POST</code> request to our API endpoint.</p>
            
            <p class="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Endpoint URL:</p>
            <code class="block w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">{{ url('/api/orders') }}</code>
            
            <p class="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">Required Headers:</p>
            <pre class="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs"><code>Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json</code></pre>

            <p class="font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">JSON Body Example:</p>
            <pre class="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs"><code>{
    "customer_name": "John Doe",
    "customer_phone": "+212 600 000000",
    "customer_address": "123 Hassan II Blvd, Casablanca",
    "amount_cod": 450.00
}</code></pre>
        </div>
    </div>
</div>
