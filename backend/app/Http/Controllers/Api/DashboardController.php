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
        $totalMerchants = User::where('role', 'merchant')->count();
        $totalDrivers = User::where('role', 'livreur')->count();
        $totalOrders = Order::count();
        
        $pendingOrders = Order::where('status', 'pending')->count();
        $inTransitOrders = Order::where('status', 'in_transit')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::whereIn('status', ['canceled', 'cancelled', 'refused'])->count();

        // Commission settings lookup
        $commissionSetting = \DB::table('platform_settings')->where('key', 'commission_rate')->first();
        $commissionRate = $commissionSetting ? floatval($commissionSetting->value) : 10.0;
        
        $totalDeliveredCod = Order::where('status', 'delivered')->sum('amount_cod');
        $totalRevenue = ($totalDeliveredCod * $commissionRate) / 100.0;

        $totalCodCollected = $totalDeliveredCod;
        $totalWithdrawals = abs(\App\Models\Transaction::where('type', 'payout')->where('status', 'completed')->sum('amount'));

        // Recent Activities
        $newMerchants = User::where('role', 'merchant')->latest()->take(3)->get()->map(function($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
                'time' => $m->created_at->diffForHumans()
            ];
        });

        $newDrivers = User::where('role', 'livreur')->latest()->take(3)->get()->map(function($d) {
            return [
                'id' => $d->id,
                'name' => $d->name,
                'vehicle' => $d->vehicle_type ?? 'N/A',
                'time' => $d->created_at->diffForHumans()
            ];
        });

        $recentDeliveries = Order::where('status', 'delivered')->latest()->take(3)->get()->map(function($o) {
            return [
                'id' => $o->id,
                'tracking' => $o->tracking_number,
                'amount' => floatval($o->amount_cod),
                'time' => $o->updated_at->diffForHumans()
            ];
        });

        $recentComplaints = \DB::table('complaints')
            ->join('users', 'complaints.user_id', '=', 'users.id')
            ->select('complaints.*', 'users.name as user_name')
            ->latest('complaints.created_at')
            ->take(3)
            ->get()
            ->map(function($c) {
                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'user_name' => $c->user_name,
                    'status' => $c->status,
                    'time' => \Carbon\Carbon::parse($c->created_at)->diffForHumans()
                ];
            });

        // MoM analytics charts (simulate last 6 months)
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        $ordersPerMonth = [120, 150, 180, 220, 270, $totalOrders];
        $revenuePerMonth = [3500, 4200, 5100, 6300, 7800, $totalRevenue];

        // Top merchants (mock stats)
        $topMerchants = User::where('role', 'merchant')->take(3)->get()->map(function($m) {
            $orderCount = Order::where('merchant_id', $m->id)->count();
            return [
                'name' => $m->name,
                'orders_count' => $orderCount,
                'success_rate' => $orderCount > 0 ? 92.4 : 100.0
            ];
        });

        // Top drivers
        $topDrivers = User::where('role', 'livreur')->take(3)->get()->map(function($d) {
            $orderCount = Order::where('livreur_id', $d->id)->count();
            return [
                'name' => $d->name,
                'orders_count' => $orderCount,
                'rating' => floatval($d->rating)
            ];
        });

        $successRate = $totalOrders > 0 ? round(($deliveredOrders / $totalOrders) * 100, 1) : 100.0;

        return response()->json([
            'role' => 'admin',
            'stats' => [
                'total_merchants' => $totalMerchants,
                'total_drivers' => $totalDrivers,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'in_transit_orders' => $inTransitOrders,
                'delivered_orders' => $deliveredOrders,
                'cancelled_orders' => $cancelledOrders,
                'total_revenue' => floatval($totalRevenue),
                'total_cod_collected' => floatval($totalCodCollected),
                'total_withdrawals' => floatval($totalWithdrawals),
            ],
            'recent_activity' => [
                'new_merchants' => $newMerchants,
                'new_drivers' => $newDrivers,
                'recent_deliveries' => $recentDeliveries,
                'recent_complaints' => $recentComplaints,
            ],
            'analytics' => [
                'months' => $months,
                'orders' => $ordersPerMonth,
                'revenue' => $revenuePerMonth,
                'success_rate' => $successRate,
                'top_merchants' => $topMerchants,
                'top_drivers' => $topDrivers,
            ]
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
