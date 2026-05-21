<?php

namespace App\Livewire;

use App\Models\Order;
use Livewire\Attributes\On;
use Livewire\Component;
use Illuminate\Support\Facades\DB;

class MerchantDashboard extends Component
{
    public int $user_id;

    public function mount()
    {
        $this->user_id = auth()->id();
    }

    #[On('echo-private:merchant.{user_id},OrderStatusUpdated')]
    public function refreshStats()
    {
        $this->render();
    }

    public function render()
    {
        $merchant = auth()->user();
        
        $stats = [
            'total_orders' => $merchant->ordersAsMerchant()->count(),
            'total_cod' => $merchant->ordersAsMerchant()->where('status', 'delivered')->sum('amount_cod'),
            'delivered' => $merchant->ordersAsMerchant()->where('status', 'delivered')->count(),
            'in_transit' => $merchant->ordersAsMerchant()->where('status', 'in_transit')->count(),
            'pending' => $merchant->ordersAsMerchant()->where('status', 'pending')->count(),
        ];

        $recentOrders = $merchant->ordersAsMerchant()->latest()->take(5)->get();

        return view('livewire.merchant-dashboard', compact('stats', 'recentOrders'));
    }
}
