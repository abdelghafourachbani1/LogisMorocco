<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return $this->adminDashboard($request);
        } elseif ($user->role === 'merchant') {
            return $this->merchantDashboard($user);
        } elseif ($user->role === 'livreur') {
            return $this->livreurDashboard($user);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    private function adminDashboard(Request $request)
    {
        $totalPartners = User::whereIn('role', ['merchant', 'livreur'])->count();
        $activePartners = User::whereIn('role', ['merchant', 'livreur'])->whereNotNull('email_verified_at')->count();
        $pendingPartners = User::whereIn('role', ['merchant', 'livreur'])->whereNull('email_verified_at')->count();
        $suspendedPartners = 0; // Mock

        $totalOrders = Order::count();
        $inTransitOrders = Order::where('status', 'in_transit')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $codToCollect = User::where('role', 'livreur')->sum('balance');

        $recentOrders = Order::with(['merchant', 'livreur'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($o) {
                return [
                    'id' => $o->id,
                    'tracking_number' => $o->tracking_number,
                    'customer_name' => $o->customer_name,
                    'amount_cod' => floatval($o->amount_cod),
                    'status' => $o->status,
                    'merchant_name' => $o->merchant->name ?? 'N/A',
                    'driver_name' => $o->livreur->name ?? 'Unassigned',
                    'date' => $o->created_at->format('M d, Y')
                ];
            });

        return response()->json([
            'role' => 'admin',
            'stats' => [
                'total_partners' => $totalPartners,
                'active_partners' => $activePartners,
                'pending_partners' => $pendingPartners,
                'suspended_partners' => $suspendedPartners,
                'total_orders' => $totalOrders,
                'in_transit_orders' => $inTransitOrders,
                'delivered_orders' => $deliveredOrders,
                'cod_to_collect' => floatval($codToCollect),
            ],
            'recent_orders' => $recentOrders
        ]);
    }

    private function merchantDashboard(User $merchant)
    {
        $orders = $merchant->ordersAsMerchant();
        
        $totalOrders = $orders->count();
        $totalCod = floatval($orders->where('status', 'delivered')->sum('amount_cod'));
        $deliveredCount = $orders->where('status', 'delivered')->count();
        $inTransitCount = $orders->where('status', 'in_transit')->count();
        $pendingCount = $orders->where('status', 'pending')->count();
        $cancelledCount = $orders->where('status', 'cancelled')->count();
        $refusedCount = $orders->where('status', 'refused')->count();

        // Pending COD: orders that are in transit
        $pendingCod = floatval($orders->where('status', 'in_transit')->sum('amount_cod'));

        // Rates
        $closedCount = $deliveredCount + $refusedCount + $cancelledCount;
        $deliverySuccessRate = $closedCount > 0 ? round(($deliveredCount / $closedCount) * 100, 1) : 100.0;
        $returnRate = $closedCount > 0 ? round(($refusedCount / $closedCount) * 100, 1) : 0.0;

        $recentOrders = $merchant->ordersAsMerchant()
            ->latest()
            ->take(5)
            ->get()
            ->map(function($o) {
                return [
                    'id' => $o->id,
                    'tracking_number' => $o->tracking_number,
                    'customer_name' => $o->customer_name,
                    'customer_address' => $o->customer_address,
                    'amount_cod' => floatval($o->amount_cod),
                    'status' => $o->status,
                    'date' => $o->created_at->format('M d, Y')
                ];
            });

        return response()->json([
            'role' => 'merchant',
            'stats' => [
                'total_orders' => $totalOrders,
                'total_cod' => $totalCod,
                'delivered_count' => $deliveredCount,
                'in_transit_count' => $inTransitCount,
                'pending_count' => $pendingCount,
                'cancelled_count' => $cancelledCount,
                'refused_count' => $refusedCount,
                'pending_cod' => $pendingCod,
                'delivery_success_rate' => $deliverySuccessRate,
                'return_rate' => $returnRate,
            ],
            'recent_orders' => $recentOrders
        ]);
    }

    private function livreurDashboard(User $livreur)
    {
        $balance = floatval($livreur->balance);
        $deliveredCount = $livreur->ordersAsLivreur()->where('status', 'delivered')->count();
        $activeDeliveries = $livreur->ordersAsLivreur()->where('status', 'in_transit')->count();
        $availableOrders = Order::where('status', 'pending')->whereNull('livreur_id')->count();

        $recentDeliveries = $livreur->ordersAsLivreur()
            ->whereIn('status', ['delivered', 'refused', 'canceled'])
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function($o) {
                return [
                    'id' => $o->id,
                    'tracking_number' => $o->tracking_number,
                    'customer_name' => $o->customer_name,
                    'amount_cod' => floatval($o->amount_cod),
                    'status' => $o->status,
                    'date' => $o->updated_at->format('M d, Y H:i')
                ];
            });

        return response()->json([
            'role' => 'livreur',
            'stats' => [
                'balance' => $balance,
                'delivered_count' => $deliveredCount,
                'active_deliveries' => $activeDeliveries,
                'available_orders' => $availableOrders,
            ],
            'recent_deliveries' => $recentDeliveries
        ]);
    }
}
