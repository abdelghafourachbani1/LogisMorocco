<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;
use App\Models\Order;

class AdminDashboard extends Component
{
    public function render()
    {
        return view('livewire.admin-dashboard')
            ->layout('layouts.admin-iframe');
    }
}
