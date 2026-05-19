<?php

namespace App\Livewire;

use Livewire\Component;

class MerchantFinances extends Component
{
    public function render()
    {
        $merchant = auth()->user();
        
        $totalCollected = $merchant->ordersAsMerchant()->where('status', 'delivered')->sum('amount_cod');
        $totalPending = $merchant->ordersAsMerchant()->whereIn('status', ['pending', 'in_transit'])->sum('amount_cod');

        // We assume simple finances for now since payouts table doesn't exist yet
        $availableBalance = $totalCollected;

        return view('livewire.merchant-finances', compact('totalCollected', 'totalPending', 'availableBalance'));
    }
}
