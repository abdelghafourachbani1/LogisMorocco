<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DriverController extends Controller
{
    /**
     * Get dashboard summary for the current driver.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = now()->startOfDay();

        // Deliveries counts
        $todayDeliveries = Order::where('livreur_id', $user->id)
            ->where('status', 'delivered')
            ->where('updated_at', '>=', $today)
            ->count();

        $activeDeliveries = Order::where('livreur_id', $user->id)
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->count();

        $completedDeliveries = Order::where('livreur_id', $user->id)
            ->where('status', 'delivered')
            ->count();

        $failedDeliveries = Order::where('livreur_id', $user->id)
            ->whereIn('status', ['failed', 'unreachable', 'refused'])
            ->count();

        // Earnings calculations
        $monthlyEarnings = Order::where('livreur_id', $user->id)
            ->where('status', 'delivered')
            ->where('updated_at', '>=', now()->startOfMonth())
            ->sum('delivery_fee');

        $pendingEarnings = Order::where('livreur_id', $user->id)
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->sum('delivery_fee');

        // Recent assigned orders
        $recentOrders = Order::where('livreur_id', $user->id)
            ->with('merchant:id,name,phone')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'today_deliveries' => $todayDeliveries,
                'active_deliveries' => $activeDeliveries,
                'completed_deliveries' => $completedDeliveries,
                'failed_deliveries' => $failedDeliveries,
                'monthly_earnings' => (float) $monthlyEarnings,
                'pending_earnings' => (float) $pendingEarnings,
                'rating' => (float) $user->rating,
                'available_balance' => (float) $user->available_balance,
                'pending_balance' => (float) $user->pending_balance,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * List unassigned orders available in the marketplace.
     */
    public function availableOrders(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::whereNull('livreur_id')
            ->where('status', 'pending')
            ->with('merchant:id,name,phone')
            ->latest()
            ->get()
            ->map(function ($order) {
                // Set a mock delivery fee based on city if not set
                if ($order->delivery_fee <= 0) {
                    $order->delivery_fee = 35.00; // Flat local shipping rate in MAD
                }
                return $order;
            });

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * Claim an available order from the marketplace.
     */
    public function claimOrder(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = Order::whereNull('livreur_id')
            ->where('status', 'pending')
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order is no longer available.'], 404);
        }

        $history = $order->status_history ?: [];
        $history[] = [
            'status' => 'assigned',
            'updated_by' => $user->name,
            'timestamp' => now()->toDateTimeString(),
            'notes' => 'Claimed from available marketplace.'
        ];

        $order->update([
            'livreur_id' => $user->id,
            'status' => 'assigned',
            'delivery_fee' => 35.00, // standard delivery commission
            'status_history' => $history
        ]);

        // Fire status update event to notify merchant & admins
        event(new OrderStatusUpdated($order));

        return response()->json([
            'message' => 'Order claimed successfully.',
            'order' => $order
        ]);
    }

    /**
     * Unclaim/reject an assigned order.
     */
    public function rejectOrder(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = Order::where('livreur_id', $user->id)
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $history = $order->status_history ?: [];
        $history[] = [
            'status' => 'pending',
            'updated_by' => $user->name,
            'timestamp' => now()->toDateTimeString(),
            'notes' => 'Returned to available marketplace by driver.'
        ];

        $order->update([
            'livreur_id' => null,
            'status' => 'pending',
            'status_history' => $history
        ]);

        event(new OrderStatusUpdated($order));

        return response()->json([
            'message' => 'Order returned to marketplace.'
        ]);
    }

    /**
     * Get active deliveries assigned to the current driver.
     */
    public function activeDeliveries(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::where('livreur_id', $user->id)
            ->whereNotIn('status', ['delivered', 'canceled'])
            ->with('merchant:id,name,phone')
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * Update delivery status.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = Order::where('livreur_id', $user->id)->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $request->validate([
            'status' => ['required', Rule::in(['assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'unreachable', 'refused'])],
            'notes' => 'nullable|string|max:1000',
            'failure_reason' => 'nullable|string|max:255',
        ]);

        $prevStatus = $order->status;
        $newStatus = $request->status;

        $history = $order->status_history ?: [];
        $history[] = [
            'status' => $newStatus,
            'updated_by' => $user->name,
            'timestamp' => now()->toDateTimeString(),
            'notes' => $request->notes,
            'failure_reason' => $request->failure_reason
        ];

        $updateData = [
            'status' => $newStatus,
            'delivery_notes' => $request->notes,
            'failure_reason' => $request->failure_reason,
            'status_history' => $history
        ];

        $order->update($updateData);

        // If newly delivered, process driver payout / merchant balance updates
        if ($newStatus === 'delivered' && $prevStatus !== 'delivered') {
            // Update driver available balance (adds delivery fee)
            $user->increment('available_balance', $order->delivery_fee);

            // Log driver's commission transaction
            Transaction::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'type' => 'earning',
                'amount' => $order->delivery_fee,
                'description' => "Delivery commission earned for parcel {$order->tracking_number}."
            ]);

            // Add collected COD amount to merchant balance
            $merchant = $order->merchant;
            if ($merchant) {
                $merchant->increment('balance', $order->amount_cod);

                // Log COD Collection transaction for Merchant
                Transaction::create([
                    'user_id' => $merchant->id,
                    'order_id' => $order->id,
                    'type' => 'collection',
                    'amount' => $order->amount_cod,
                    'description' => "COD collected for parcel {$order->tracking_number}."
                ]);
            }
        }

        event(new OrderStatusUpdated($order));

        return response()->json([
            'message' => 'Status updated successfully.',
            'order' => $order
        ]);
    }

    /**
     * Get completed delivery history.
     */
    public function history(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Order::where('livreur_id', $user->id)
            ->whereIn('status', ['delivered', 'failed', 'refused', 'canceled']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->date) {
            $query->whereDate('updated_at', $request->date);
        }

        if ($request->city) {
            $query->where('customer_address', 'like', '%' . $request->city . '%');
        }

        $orders = $query->with('merchant:id,name')->latest()->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * Wallet and Transactions info.
     */
    public function wallet(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'available_balance' => (float) $user->available_balance,
            'pending_balance' => (float) $user->pending_balance,
            'transactions' => $transactions
        ]);
    }

    /**
     * Get detailed performance reports.
     */
    public function performance(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $total = Order::where('livreur_id', $user->id)->count();
        $successful = Order::where('livreur_id', $user->id)->where('status', 'delivered')->count();
        $failed = Order::where('livreur_id', $user->id)->whereIn('status', ['failed', 'refused', 'unreachable'])->count();

        $successRate = $total > 0 ? round(($successful / $total) * 100, 1) : 100.0;

        return response()->json([
            'total_deliveries' => $total,
            'successful_deliveries' => $successful,
            'failed_deliveries' => $failed,
            'success_rate' => $successRate,
            'rating' => (float) $user->rating,
            'average_delivery_time' => '1.8 hours', // static mock metric for display
        ]);
    }

    /**
     * Update driver profile and vehicle details.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'livreur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_plate' => 'nullable|string|max:50',
            'cin' => 'nullable|string|max:50',
            'current_password' => 'nullable|string|required_with:new_password',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($request->current_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The provided password does not match your current password.'],
                ]);
            }
            $user->update(['password' => Hash::make($request->new_password)]);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'vehicle_type' => $request->vehicle_type,
            'vehicle_plate' => $request->vehicle_plate,
            'cin' => $request->cin,
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'Driver details saved successfully.'
        ]);
    }
}
