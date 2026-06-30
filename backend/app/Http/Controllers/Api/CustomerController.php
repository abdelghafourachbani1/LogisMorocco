<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::where('merchant_id', $user->id)->get();
        $dbCustomers = DB::table('merchant_customers')->where('merchant_id', $user->id)->get()->keyBy('phone');

        $customers = $orders->groupBy('customer_phone')->map(function($group, $phone) use ($dbCustomers) {
            $delivered = $group->where('status', 'delivered')->count();
            $failed = $group->whereIn('status', ['canceled', 'refused'])->count();
            $total = $group->count();
            
            // Calculate success rate based on finished orders
            $finished = $delivered + $failed;
            $successRate = $finished > 0 ? round(($delivered / $finished) * 100, 1) : 100.0;
            
            $spent = $group->where('status', 'delivered')->sum('amount_cod');
            $latestOrder = $group->sortByDesc('created_at')->first();

            $dbCust = $dbCustomers->get($phone);

            return [
                'name' => $dbCust->name ?? $latestOrder->customer_name,
                'phone' => $phone,
                'address' => $dbCust->address ?? $latestOrder->customer_address,
                'notes' => $dbCust->notes ?? null,
                'flag' => $dbCust->flag ?? 'none',
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

        // Also add database customers that might not have orders yet
        foreach ($dbCustomers as $phone => $dbCust) {
            if (!$customers->contains('phone', $phone)) {
                $customers->push([
                    'name' => $dbCust->name,
                    'phone' => $phone,
                    'address' => $dbCust->address,
                    'notes' => $dbCust->notes,
                    'flag' => $dbCust->flag,
                    'total_orders' => 0,
                    'delivered_orders' => 0,
                    'success_rate' => 100.0,
                    'total_spent' => 0.0,
                    'orders' => []
                ]);
            }
        }

        return response()->json([
            'customers' => $customers
        ]);
    }

    public function updateCustomer(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'phone' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:1000',
            'notes' => 'nullable|string',
            'flag' => 'required|string|in:none,trusted,high_cancellation',
        ]);

        DB::table('merchant_customers')
            ->updateOrInsert(
                ['merchant_id' => $user->id, 'phone' => $validated['phone']],
                [
                    'name' => $validated['name'],
                    'address' => $validated['address'],
                    'notes' => $validated['notes'],
                    'flag' => $validated['flag'],
                    'updated_at' => now(),
                    'created_at' => now(), // only applies if inserting
                ]
            );

        return response()->json([
            'message' => 'Customer profile updated successfully.',
            'customer' => [
                'phone' => $validated['phone'],
                'name' => $validated['name'],
                'address' => $validated['address'],
                'notes' => $validated['notes'],
                'flag' => $validated['flag']
            ]
        ]);
    }
}
