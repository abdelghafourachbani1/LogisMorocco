<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;
use App\Models\Order;

class AdminDashboard extends Component
{
    public function render()
    {
        $stats = [
            'total_merchants' => User::where('role', 'merchant')->count(),
            'total_livreurs' => User::where('role', 'livreur')->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'in_transit_orders' => Order::where('status', 'in_transit')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_cod_collected' => Order::where('status', 'delivered')->sum('amount_cod'),
        ];

        $recentOrders = Order::with(['merchant', 'livreur'])->latest()->take(5)->get();

        return view('livewire.admin-dashboard', compact('stats', 'recentOrders'));
    }
}
