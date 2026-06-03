<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::query()->with(['merchant', 'livreur']);

        // 1. Filter based on user role
        if ($user->role === 'merchant') {
            $query->where('merchant_id', $user->id);
        } elseif ($user->role === 'livreur') {
            $tab = $request->input('tab', 'available');
            if ($tab === 'active') {
                $query->where('livreur_id', $user->id)
                      ->where('status', 'in_transit');
            } else {
                // Default is available
                $query->where('status', 'pending')
                      ->whereNull('livreur_id');
            }
        }

        // 2. Global Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('customer_address', 'like', "%{$search}%");
            });
        }

        // 3. Status Filter (mainly for admin and merchant)
        if ($request->filled('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->latest()->paginate(10);

        return response()->json([
            'orders' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

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
            return response()->json(['error' => 'Only merchants can create orders.'], 403);
        }

        $order = $merchant->ordersAsMerchant()->create([
            'tracking_number' => 'LOG-' . strtoupper(Str::random(8)),
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

    public function claim(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['error' => 'Only drivers can claim orders.'], 403);
        }

        if ($order->status !== 'pending' || !is_null($order->livreur_id)) {
            return response()->json(['error' => 'Order is not available for claim.'], 400);
        }

        $order->update([
            'livreur_id' => $user->id,
            'status' => 'in_transit'
        ]);

        OrderStatusUpdated::dispatch($order);

        return response()->json([
            'message' => 'Order claimed successfully.',
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();

        if ($order->livreur_id !== $user->id) {
            return response()->json(['error' => 'You are not assigned to this order.'], 403);
        }

        $request->validate([
            'status' => 'required|in:delivered,refused,canceled',
        ]);

        $status = $request->input('status');

        DB::transaction(function () use ($order, $user, $status) {
            $order->update(['status' => $status]);

            // Handle COD transactions if marked as delivered
            if ($status === 'delivered' && $order->amount_cod > 0) {
                // 1. Driver gets collection transaction (cash held increases)
                $user->transactions()->create([
                    'order_id' => $order->id,
                    'type' => 'collection',
                    'amount' => $order->amount_cod,
                    'description' => 'Collected COD for order ' . $order->tracking_number,
                ]);
                $user->increment('balance', $order->amount_cod);

                // 2. Merchant gets credit transaction (merchant balance increases)
                $merchant = $order->merchant;
                if ($merchant) {
                    $merchant->transactions()->create([
                        'order_id' => $order->id,
                        'type' => 'credit',
                        'amount' => $order->amount_cod,
                        'description' => 'COD credited from delivered order ' . $order->tracking_number,
                    ]);
                    $merchant->increment('balance', $order->amount_cod);
                }
            }
        });

        OrderStatusUpdated::dispatch($order);

        return response()->json([
            'message' => "Order marked as {$status} successfully.",
            'order' => $order->fresh()
        ]);
    }

    public function importTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders_import_template.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['customer_name', 'customer_phone', 'customer_address', 'amount_cod']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function previewImport(Request $request)
    {
        $merchant = $request->user();
        if ($merchant->role !== 'merchant') {
            return response()->json(['error' => 'Only merchants can import orders.'], 403);
        }

        $rows = $request->input('rows', []);
        $validRows = [];
        $invalidRows = [];

        foreach ($rows as $index => $row) {
            $errors = [];

            if (empty($row['customer_name'])) {
                $errors[] = 'Customer name is required.';
            }
            if (empty($row['customer_phone'])) {
                $errors[] = 'Customer phone number is required.';
            }
            if (empty($row['customer_address'])) {
                $errors[] = 'Customer address is required.';
            }
            
            $amountCod = isset($row['amount_cod']) ? $row['amount_cod'] : '';
            if ($amountCod === '' || !is_numeric($amountCod) || floatval($amountCod) < 0) {
                $errors[] = 'COD Amount must be a valid positive number.';
            }

            if (count($errors) > 0) {
                $invalidRows[] = [
                    'index' => $index,
                    'data' => $row,
                    'errors' => $errors
                ];
            } else {
                $validRows[] = [
                    'customer_name' => $row['customer_name'],
                    'customer_phone' => $row['customer_phone'],
                    'customer_address' => $row['customer_address'],
                    'amount_cod' => floatval($amountCod)
                ];
            }
        }

        return response()->json([
            'valid_count' => count($validRows),
            'invalid_count' => count($invalidRows),
            'valid_rows' => $validRows,
            'invalid_rows' => $invalidRows
        ]);
    }

    public function confirmImport(Request $request)
    {
        $merchant = $request->user();
        if ($merchant->role !== 'merchant') {
            return response()->json(['error' => 'Only merchants can import orders.'], 403);
        }

        $rows = $request->input('rows', []);
        
        if (empty($rows)) {
            return response()->json(['error' => 'No orders to import.'], 400);
        }

        $createdOrders = [];

        DB::transaction(function() use ($merchant, $rows, &$createdOrders) {
            foreach ($rows as $row) {
                $order = $merchant->ordersAsMerchant()->create([
                    'tracking_number' => 'LOG-' . strtoupper(Str::random(8)),
                    'customer_name' => $row['customer_name'],
                    'customer_phone' => $row['customer_phone'],
                    'customer_address' => $row['customer_address'],
                    'amount_cod' => floatval($row['amount_cod']),
                    'status' => 'pending',
                ]);
                $createdOrders[] = $order;
            }
        });

        return response()->json([
            'message' => count($createdOrders) . ' orders successfully imported.',
            'imported_count' => count($createdOrders)
        ], 201);
    }
}
