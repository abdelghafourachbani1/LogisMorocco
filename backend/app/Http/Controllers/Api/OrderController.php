<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:255',
            'customer_address' => 'required|string',
            'amount_cod' => 'required|numeric|min:0',
        ]);

        $merchant = $request->user();

        if ($merchant->role !== 'merchant') {
            return response()->json(['error' => 'Only merchants can create orders via API.'], 403);
        }

        $order = $merchant->ordersAsMerchant()->create([
            'tracking_number' => 'TRK-' . strtoupper(uniqid()),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'],
            'amount_cod' => $validated['amount_cod'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order
        ], 201);
    }
}
