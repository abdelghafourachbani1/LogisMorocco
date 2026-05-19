<?php

namespace App\Livewire;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use Livewire\Component;

class LivreurDashboard extends Component
{
    public function render()
    {
        $livreur = auth()->user();
        
        $stats = [
            'balance' => $livreur->balance, // Amount of COD the livreur holds
            'delivered_count' => $livreur->ordersAsLivreur()->where('status', 'delivered')->count(),
            'active_deliveries' => $livreur->ordersAsLivreur()->where('status', 'in_transit')->count(),
            'available_orders' => Order::where('status', 'pending')->whereNull('livreur_id')->count(),
        ];

        $recentDeliveries = $livreur->ordersAsLivreur()
            ->whereIn('status', ['delivered', 'refused', 'canceled'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        return view('livewire.livreur-dashboard', compact('stats', 'recentDeliveries'));
    }
}
