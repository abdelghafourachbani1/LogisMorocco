<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
            'tokens' => $tokens
        ]);
    }

    public function generate(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tokenName = 'API-Key-' . now()->format('Y-m-d-His');
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
}
