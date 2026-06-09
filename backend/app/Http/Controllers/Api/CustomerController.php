<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::where('merchant_id', $user->id)->get();

        $customers = $orders->groupBy('customer_phone')->map(function($group, $phone) {
            $delivered = $group->where('status', 'delivered')->count();
            $failed = $group->whereIn('status', ['canceled', 'refused'])->count();
            $total = $group->count();
            
            // Calculate success rate based on finished orders
            $finished = $delivered + $failed;
            $successRate = $finished > 0 ? round(($delivered / $finished) * 100, 1) : 100.0;
            
            $spent = $group->where('status', 'delivered')->sum('amount_cod');
            $latestOrder = $group->sortByDesc('created_at')->first();

            return [
                'name' => $latestOrder->customer_name,
                'phone' => $phone,
                'address' => $latestOrder->customer_address,
                'total_orders' => $total,
                'delivered_orders' => $delivered,
                'success_rate' => $successRate,
                'total_spent' => floatval($spent),
                'orders' => $group->map(function($o) {
                    return [
                        'id' => $o->id,
                        'tracking_number' => $o->tracking_number,
                        'amount_cod' => floatval($o->amount_cod),
                        'status' => $o->status,
                        'date' => $o->created_at->format('M d, Y')
                    ];
                })->values()
            ];
        })->values();

        return response()->json([
            'customers' => $customers
        ]);
    }
}
