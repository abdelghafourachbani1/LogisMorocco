<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class AdminFinancialControl extends Component
{
    public $merchantId;
    public $payoutAmount;

    public $livreurId;
    public $collectionAmount;

    public function processPayout()
    {
        $this->validate([
            'merchantId' => 'required|exists:users,id',
            'payoutAmount' => 'required|numeric|min:1',
        ]);

        $merchant = User::find($this->merchantId);

        if ($this->payoutAmount > $merchant->balance) {
            session()->flash('merchant_error', 'Payout amount cannot exceed merchant balance.');
            return;
        }

        DB::transaction(function () use ($merchant) {
            $merchant->transactions()->create([
                'type' => 'payout',
                'amount' => -$this->payoutAmount,
                'description' => 'Admin paid out COD funds.',
            ]);

            $merchant->decrement('balance', $this->payoutAmount);
        });

        session()->flash('merchant_success', 'Payout processed successfully.');
        $this->merchantId = null;
        $this->payoutAmount = null;
    }

    public function processCollection()
    {
        $this->validate([
            'livreurId' => 'required|exists:users,id',
            'collectionAmount' => 'required|numeric|min:1',
        ]);

        $livreur = User::find($this->livreurId);

        if ($this->collectionAmount > $livreur->balance) {
            session()->flash('livreur_error', 'Collection amount cannot exceed livreur\'s held cash.');
            return;
        }

        DB::transaction(function () use ($livreur) {
            $livreur->transactions()->create([
                'type' => 'admin_collection',
                'amount' => -$this->collectionAmount,
                'description' => 'Admin collected cash from Livreur.',
            ]);

            $livreur->decrement('balance', $this->collectionAmount);
        });

        session()->flash('livreur_success', 'Cash collected successfully from Livreur.');
        $this->livreurId = null;
        $this->collectionAmount = null;
    }

    public function render()
    {
        return view('livewire.admin-financial-control')
            ->layout('layouts.admin-iframe');
    }
}
