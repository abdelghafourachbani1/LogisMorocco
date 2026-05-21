<?php

namespace App\Livewire;

use App\Models\Order;
use Livewire\Attributes\Validate;
use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\WithPagination;

class MerchantOrders extends Component
{
    use WithPagination;

    public int $user_id;
    public $search = '';
    public $statusFilter = '';

    public function mount()
    {
        $this->user_id = auth()->id();
    }

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingStatusFilter()
    {
        $this->resetPage();
    }

    #[On('echo-private:merchant.{user_id},OrderStatusUpdated')]
    public function refreshOrders()
    {
        $this->resetPage();
    }

    #[Validate('required|string|max:255')]
    public $customer_name = '';

    #[Validate('required|string|max:255')]
    public $customer_phone = '';

    #[Validate('required|string|max:255')]
    public $customer_address = '';

    #[Validate('required|numeric|min:0')]
    public $amount_cod = 0;

    public function createOrder()
    {
        $this->validate();

        auth()->user()->ordersAsMerchant()->create([
            'tracking_number' => 'LOG-' . strtoupper(\Illuminate\Support\Str::random(8)),
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_address' => $this->customer_address,
            'amount_cod' => $this->amount_cod,
            'status' => 'pending',
        ]);

        $this->reset(['customer_name', 'customer_phone', 'customer_address', 'amount_cod']);
        session()->flash('message', 'Order created successfully.');
        $this->resetPage();
    }

    public function render()
    {
        $query = auth()->user()->ordersAsMerchant()->latest();

        if ($this->search) {
            $query->where(function($q) {
                $q->where('tracking_number', 'like', '%' . $this->search . '%')
                  ->orWhere('customer_name', 'like', '%' . $this->search . '%')
                  ->orWhere('customer_phone', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->statusFilter) {
            $query->where('status', $this->statusFilter);
        }

        return view('livewire.merchant-orders', [
            'orders' => $query->paginate(10)
        ]);
    }
}
