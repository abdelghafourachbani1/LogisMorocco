<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Public Developer API (v1)
 *
 * This controller powers the external API that merchants can use to
 * integrate LogisMaghreb into their own stores (Shopify, WooCommerce,
 * custom PHP/Node.js apps, etc.).
 *
 * Authentication: Bearer token via Laravel Sanctum.
 * Usage:  Authorization: Bearer YOUR_API_KEY
 *
 * All responses follow a standard envelope:
 * {
 *   "success": true,
 *   "data": { ... },      // or array
 *   "meta": { ... }       // pagination info when applicable
 * }
 */
class PublicApiController extends Controller
{
    // ─────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────

    /**
     * Standard success response.
     */
    private function ok($data, array $meta = [], int $status = 200)
    {
        $payload = ['success' => true, 'data' => $data];
        if (!empty($meta)) {
            $payload['meta'] = $meta;
        }
        return response()->json($payload, $status);
    }

    /**
     * Standard error response.
     */
    private function fail(string $message, int $status = 400, array $errors = [])
    {
        $payload = ['success' => false, 'message' => $message];
        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }
        return response()->json($payload, $status);
    }

    /**
     * Ensure the authenticated user is a merchant.
     */
    private function merchant(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'merchant') {
            return null;
        }
        return $user;
    }

    // ─────────────────────────────────────────────
    // ORDERS
    // ─────────────────────────────────────────────

    /**
     * GET /api/v1/orders
     *
     * List all orders for the authenticated merchant.
     * Supports: ?status=pending|in_transit|delivered|canceled
     *           ?city=Casablanca
     *           ?search=tracking_number|customer_name
     *           ?per_page=20 (max 100)
     *           ?page=1
     */
    public function listOrders(Request $request)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized. Provide a valid merchant API key.', 401);
        }

        $perPage = min((int) ($request->input('per_page', 20)), 100);

        $query = Order::where('merchant_id', $merchant->id)->with('product');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->input('city') . '%');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('tracking_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        $orders = $query->latest()->paginate($perPage);

        return $this->ok(
            $orders->items(),
            [
                'page'       => $orders->currentPage(),
                'per_page'   => $orders->perPage(),
                'total'      => $orders->total(),
                'last_page'  => $orders->lastPage(),
            ]
        );
    }

    /**
     * POST /api/v1/orders
     *
     * Create a new delivery order.
     *
     * Required body fields:
     *   customer_name    string
     *   customer_phone   string
     *   customer_address string
     *   amount_cod       number  (Cash on delivery amount in MAD)
     *
     * Optional body fields:
     *   city             string
     *   product_id       integer (must belong to your products)
     *   quantity         integer (default: 1)
     *   delivery_notes   string
     */
    public function createOrder(Request $request)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized. Provide a valid merchant API key.', 401);
        }

        $validated = $request->validate([
            'customer_name'    => 'required|string|max:255',
            'customer_phone'   => 'required|string|max:255',
            'customer_address' => 'required|string',
            'amount_cod'       => 'required|numeric|min:0',
            'city'             => 'nullable|string|max:255',
            'product_id'       => 'nullable|exists:products,id',
            'quantity'         => 'nullable|integer|min:1',
            'delivery_notes'   => 'nullable|string',
        ]);

        $productId = $validated['product_id'] ?? null;
        $quantity  = $validated['quantity']   ?? 1;

        if ($productId) {
            $product = Product::where('merchant_id', $merchant->id)->find($productId);
            if (!$product) {
                return $this->fail('Product not found or does not belong to your account.', 404);
            }
            if ($product->quantity < $quantity) {
                return $this->fail(
                    "Insufficient stock. Available: {$product->quantity} units.",
                    422,
                    ['product_id' => ['Insufficient stock.']]
                );
            }
        }

        $order = DB::transaction(function () use ($merchant, $validated, $productId, $quantity) {
            if ($productId) {
                Product::find($productId)->decrement('quantity', $quantity);
            }
            return $merchant->ordersAsMerchant()->create([
                'tracking_number'  => 'LOG-' . strtoupper(Str::random(8)),
                'customer_name'    => $validated['customer_name'],
                'customer_phone'   => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'amount_cod'       => $validated['amount_cod'],
                'city'             => $validated['city']           ?? null,
                'product_id'       => $productId,
                'quantity'         => $quantity,
                'delivery_notes'   => $validated['delivery_notes'] ?? null,
                'status'           => 'pending',
            ]);
        });

        return $this->ok($order->load('product'), [], 201);
    }

    /**
     * GET /api/v1/orders/{id}
     *
     * Retrieve a single order by its numeric ID.
     */
    public function getOrder(Request $request, int $id)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $order = Order::where('merchant_id', $merchant->id)->with(['product', 'livreur'])->find($id);

        if (!$order) {
            return $this->fail('Order not found.', 404);
        }

        return $this->ok($order);
    }

    /**
     * GET /api/v1/track/{tracking_number}
     *
     * Public tracking endpoint — no auth required.
     * Returns status and timeline for any tracking number.
     */
    public function trackOrder(string $tracking)
    {
        $order = Order::where('tracking_number', $tracking)->with('livreur')->first();

        if (!$order) {
            return $this->fail('Tracking number not found.', 404);
        }

        return $this->ok([
            'tracking_number'  => $order->tracking_number,
            'status'           => $order->status,
            'customer_name'    => $order->customer_name,
            'customer_address' => $order->customer_address,
            'city'             => $order->city,
            'amount_cod'       => floatval($order->amount_cod),
            'driver'           => $order->livreur ? [
                'name'         => $order->livreur->name,
                'phone'        => $order->livreur->phone,
                'vehicle_type' => $order->livreur->vehicle_type,
            ] : null,
            'history'          => $order->status_history ?? [],
            'created_at'       => $order->created_at->toIso8601String(),
            'updated_at'       => $order->updated_at->toIso8601String(),
        ]);
    }

    /**
     * POST /api/v1/orders/{id}/cancel
     *
     * Cancel a pending order. Only works if status is still 'pending'.
     */
    public function cancelOrder(Request $request, int $id)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $order = Order::where('merchant_id', $merchant->id)->find($id);

        if (!$order) {
            return $this->fail('Order not found.', 404);
        }

        if ($order->status !== 'pending') {
            return $this->fail(
                "Order cannot be cancelled. Current status: {$order->status}. Only pending orders can be cancelled.",
                422
            );
        }

        $order->update(['status' => 'canceled']);

        return $this->ok(['id' => $order->id, 'status' => 'canceled']);
    }

    // ─────────────────────────────────────────────
    // PRODUCTS
    // ─────────────────────────────────────────────

    /**
     * GET /api/v1/products
     *
     * List all your products. Supports ?status=active|inactive
     */
    public function listProducts(Request $request)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $query = Product::where('merchant_id', $merchant->id);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $products = $query->latest()->get();

        return $this->ok($products);
    }

    /**
     * POST /api/v1/products
     *
     * Create a product.
     */
    public function createProduct(Request $request)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $request->validate([
            'name'        => 'required|string|max:255',
            'sku'         => 'required|string|max:255|unique:products,sku',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
            'description' => 'nullable|string',
            'weight'      => 'nullable|numeric|min:0',
            'image_url'   => 'nullable|string|max:1000',
            'status'      => 'nullable|string|in:active,inactive',
        ]);

        $product = Product::create([
            'merchant_id' => $merchant->id,
            'name'        => $request->name,
            'sku'         => $request->sku,
            'price'       => $request->price,
            'quantity'    => $request->quantity,
            'description' => $request->description,
            'weight'      => $request->weight,
            'image_url'   => $request->image_url,
            'status'      => $request->status ?? 'active',
        ]);

        return $this->ok($product, [], 201);
    }

    /**
     * PUT /api/v1/products/{id}
     *
     * Update a product.
     */
    public function updateProduct(Request $request, int $id)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $product = Product::where('merchant_id', $merchant->id)->find($id);

        if (!$product) {
            return $this->fail('Product not found.', 404);
        }

        $request->validate([
            'name'        => 'required|string|max:255',
            'sku'         => 'required|string|max:255|unique:products,sku,' . $id,
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
            'description' => 'nullable|string',
            'weight'      => 'nullable|numeric|min:0',
            'image_url'   => 'nullable|string|max:1000',
            'status'      => 'nullable|string|in:active,inactive',
        ]);

        $product->update($request->only(['name','sku','price','quantity','description','weight','image_url','status']));

        return $this->ok($product);
    }

    /**
     * DELETE /api/v1/products/{id}
     *
     * Delete a product.
     */
    public function deleteProduct(Request $request, int $id)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $product = Product::where('merchant_id', $merchant->id)->find($id);

        if (!$product) {
            return $this->fail('Product not found.', 404);
        }

        $product->delete();

        return $this->ok(['message' => 'Product deleted successfully.']);
    }

    // ─────────────────────────────────────────────
    // STATS
    // ─────────────────────────────────────────────

    /**
     * GET /api/v1/stats
     *
     * Returns summary KPIs for your account.
     */
    public function stats(Request $request)
    {
        $merchant = $this->merchant($request);
        if (!$merchant) {
            return $this->fail('Unauthorized.', 401);
        }

        $orders = Order::where('merchant_id', $merchant->id)->get();
        $total  = $orders->count();
        $del    = $orders->where('status', 'delivered')->count();
        $fail   = $orders->whereIn('status', ['canceled', 'refused'])->count();
        $closed = $del + $fail;

        return $this->ok([
            'total_orders'         => $total,
            'pending_orders'       => $orders->where('status', 'pending')->count(),
            'in_transit_orders'    => $orders->where('status', 'in_transit')->count(),
            'delivered_orders'     => $del,
            'cancelled_orders'     => $fail,
            'delivery_success_rate'=> $closed > 0 ? round(($del / $closed) * 100, 1) : 100.0,
            'return_rate'          => $closed > 0 ? round(($fail / $closed) * 100, 1) : 0.0,
            'total_cod_collected'  => floatval($orders->where('status', 'delivered')->sum('amount_cod')),
            'available_balance'    => floatval($merchant->balance),
            'total_products'       => Product::where('merchant_id', $merchant->id)->count(),
        ]);
    }

    // ─────────────────────────────────────────────
    // REFERENCE DATA
    // ─────────────────────────────────────────────

    /**
     * GET /api/v1/cities
     *
     * Returns the list of cities we deliver to (from existing orders data).
     * No auth required.
     */
    public function cities()
    {
        $cities = DB::table('orders')
            ->whereNotNull('city')
            ->select('city', DB::raw('count(*) as order_count'))
            ->groupBy('city')
            ->orderByDesc('order_count')
            ->get()
            ->pluck('city');

        // Fall back to a default Morocco cities list if no orders yet
        if ($cities->isEmpty()) {
            $cities = collect([
                'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
                'Meknès', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia',
                'El Jadida', 'Béni Mellal', 'Nador', 'Khémisset', 'Settat',
                'Larache', 'Khouribga', 'Guelmim'
            ]);
        }

        return $this->ok($cities->values());
    }
}
