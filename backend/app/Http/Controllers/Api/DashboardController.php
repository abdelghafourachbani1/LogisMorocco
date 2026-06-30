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
        $orders = Order::where('merchant_id', $merchant->id)->get();
        
        $totalOrders = $orders->count();
        $pendingCount = $orders->where('status', 'pending')->count();
        $assignedCount = $orders->whereNotNull('livreur_id')->whereNotIn('status', ['delivered', 'canceled', 'refused'])->count();
        $inTransitCount = $orders->where('status', 'in_transit')->count();
        $deliveredCount = $orders->where('status', 'delivered')->count();
        $cancelledCount = $orders->whereIn('status', ['canceled', 'refused'])->count();

        // Rates
        $closedCount = $deliveredCount + $cancelledCount;
        $deliverySuccessRate = $closedCount > 0 ? round(($deliveredCount / $closedCount) * 100, 1) : 100.0;
        $returnRate = $closedCount > 0 ? round(($cancelledCount / $closedCount) * 100, 1) : 0.0;

        $totalRevenue = floatval($orders->where('status', 'delivered')->sum('amount_cod'));
        $availableCodBalance = floatval($merchant->balance);

        // 1. Orders by Day (Last 7 Days)
        $ordersByDay = [];
        $days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->format('D');
            $days[] = $dayName;
            $ordersByDay[] = $orders->filter(function($o) use ($date) {
                return $o->created_at->format('Y-m-d') === $date;
            })->count();
        }

        // 2. Revenue Evolution (Last 6 Months)
        $revenueEvolution = [];
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = now()->subMonths($i)->startOfMonth();
            $monthEnd = now()->subMonths($i)->endOfMonth();
            $monthName = now()->subMonths($i)->format('M');
            $months[] = $monthName;
            $revenueEvolution[] = floatval($orders->filter(function($o) use ($monthStart, $monthEnd) {
                return $o->status === 'delivered' && $o->created_at->between($monthStart, $monthEnd);
            })->sum('amount_cod'));
        }

        // 3. Top-selling products
        $topProducts = [];
        if ($totalOrders > 0) {
            $topProducts = \DB::table('orders')
                ->where('orders.merchant_id', $merchant->id)
                ->whereNotNull('orders.product_id')
                ->join('products', 'orders.product_id', '=', 'products.id')
                ->select('products.name', \DB::raw('SUM(orders.quantity) as total_quantity'), \DB::raw('SUM(orders.amount_cod) as total_revenue'))
                ->groupBy('products.name')
                ->orderByDesc('total_quantity')
                ->take(5)
                ->get()
                ->map(function($p) {
                    return [
                        'name' => $p->name,
                        'quantity' => intval($p->total_quantity),
                        'revenue' => floatval($p->total_revenue)
                    ];
                });
        }

        // 4. Orders by city
        $ordersByCity = \DB::table('orders')
            ->where('merchant_id', $merchant->id)
            ->whereNotNull('city')
            ->select('city', \DB::raw('count(*) as count'))
            ->groupBy('city')
            ->orderByDesc('count')
            ->take(5)
            ->get()
            ->map(function($c) {
                return [
                    'city' => $c->city,
                    'count' => intval($c->count)
                ];
            });

        // 5. Recent Activity Feed
        $recentOrders = $orders->sortByDesc('created_at')->take(5)->map(function($o) {
            return [
                'id' => $o->id,
                'tracking_number' => $o->tracking_number,
                'customer_name' => $o->customer_name,
                'customer_address' => $o->customer_address,
                'amount_cod' => floatval($o->amount_cod),
                'status' => $o->status,
                'date' => $o->created_at->format('M d, Y')
            ];
        })->values();

        // Let's add recent notifications
        $recentNotifications = \DB::table('notifications')
            ->where('notifiable_id', $merchant->id)
            ->where('notifiable_type', 'App\Models\User')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function($n) {
                $data = json_decode($n->data, true);
                return [
                    'id' => $n->id,
                    'title' => $data['title'] ?? 'Notification',
                    'message' => $data['message'] ?? '',
                    'read_at' => $n->read_at,
                    'time' => \Carbon\Carbon::parse($n->created_at)->diffForHumans()
                ];
            });

        return response()->json([
            'role' => 'merchant',
            'stats' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingCount,
                'assigned_orders' => $assignedCount,
                'in_transit_orders' => $inTransitCount,
                'delivered_orders' => $deliveredCount,
                'cancelled_orders' => $cancelledCount,
                'return_rate' => $returnRate,
                'delivery_success_rate' => $deliverySuccessRate,
                'total_revenue' => $totalRevenue,
                'available_cod_balance' => $availableCodBalance,
            ],
            'charts' => [
                'days' => $days,
                'orders_by_day' => $ordersByDay,
                'months' => $months,
                'revenue_evolution' => $revenueEvolution,
                'top_products' => $topProducts,
                'orders_by_city' => $ordersByCity,
            ],
            'recent_orders' => $recentOrders,
            'recent_notifications' => $recentNotifications
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
