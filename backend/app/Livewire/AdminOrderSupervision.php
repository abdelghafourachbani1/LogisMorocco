<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Order;
use Livewire\WithPagination;

class AdminOrderSupervision extends Component
{
    use WithPagination;

    public $search = '';
    public $statusFilter = '';

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingStatusFilter()
    {
        $this->resetPage();
    }

    public function render()
    {
        return view('livewire.admin-order-supervision')
            ->layout('layouts.admin-iframe');
    }
}
