<?php

namespace App\Livewire;

use Livewire\Component;

class LivreurFinances extends Component
{
    public function render()
    {
        $livreur = auth()->user();
        
        $balance = $livreur->balance; // Amount of COD the livreur holds and owes to Admin
        $totalCollected = $livreur->ordersAsLivreur()->where('status', 'delivered')->sum('amount_cod');

        // Simple mock of transactions for the UI
        $transactions = $livreur->transactions()->latest()->take(10)->get();

        return view('livewire.livreur-finances', compact('balance', 'totalCollected', 'transactions'));
    }
}
