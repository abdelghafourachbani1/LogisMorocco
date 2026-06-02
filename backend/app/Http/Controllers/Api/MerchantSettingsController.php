<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MerchantSettingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tokens = $user->tokens()->select('id', 'name', 'last_used_at', 'created_at')->get();

        return response()->json([
            'tokens' => $tokens,
            'webhook_url' => $user->webhook_url,
            'webhook_secret' => $user->webhook_secret,
            'webhook_active' => (bool) $user->webhook_active,
        ]);
    }

    public function generate(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $tokenName = $request->name ?: ('API-Key-' . now()->format('Y-m-d-His'));
        $token = $user->createToken($tokenName);

        return response()->json([
            'message' => 'New API Key generated successfully.',
            'token' => $token->plainTextToken,
            'token_name' => $tokenName
        ], 201);
    }

    public function delete(Request $request, $tokenId)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->tokens()->where('id', $tokenId)->delete();

        return response()->json([
            'message' => 'API Key deleted successfully.'
        ]);
    }

    public function updateWebhook(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'webhook_url' => 'nullable|url|max:1000',
            'webhook_active' => 'required|boolean',
        ]);

        // Generate a webhook secret if not already set
        $secret = $user->webhook_secret;
        if (!$secret && $request->webhook_url) {
            $secret = 'whsec_' . Str::random(32);
        }

        $user->update([
            'webhook_url' => $request->webhook_url,
            'webhook_secret' => $secret,
            'webhook_active' => $request->webhook_active,
        ]);

        return response()->json([
            'message' => 'Webhook settings saved.',
            'webhook_url' => $user->webhook_url,
            'webhook_secret' => $user->webhook_secret,
            'webhook_active' => (bool) $user->webhook_active,
        ]);
    }

    public function testWebhook(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$user->webhook_url) {
            return response()->json(['message' => 'Webhook URL is not configured.'], 422);
        }

        $payload = [
            'event' => 'order.updated',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'tracking_number' => 'TRK-TEST-999',
                'status' => 'delivered',
                'amount_cod' => 250.00,
                'customer' => [
                    'name' => 'John Doe',
                    'phone' => '0612345678',
                    'city' => 'Casablanca'
                ]
            ]
        ];

        $signature = hash_hmac('sha256', json_encode($payload), $user->webhook_secret ?? '');

        try {
            $response = Http::withHeaders([
                'X-LogiMorocco-Signature' => $signature,
                'Content-Type' => 'application/json'
            ])
            ->timeout(5)
            ->post($user->webhook_url, $payload);

            return response()->json([
                'success' => $response->successful(),
                'status_code' => $response->status(),
                'response_body' => Str::limit($response->body(), 500),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
