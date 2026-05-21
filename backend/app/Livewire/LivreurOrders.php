<?php

namespace App\Livewire;

use App\Events\OrderStatusUpdated;
use App\Models\Order;
use Livewire\Attributes\On;
use Livewire\Component;
use Livewire\WithPagination;

class LivreurOrders extends Component
{
    use WithPagination;

    public $activeTab = 'available'; // available, active

    public function setTab($tab)
    {
        $this->activeTab = $tab;
        $this->resetPage();
    }

    public function claimOrder(Order $order)
    {
        if ($order->status === 'pending' && is_null($order->livreur_id)) {
            $order->update([
                'livreur_id' => auth()->id(),
                'status' => 'in_transit'
            ]);
            
            OrderStatusUpdated::dispatch($order);
            
            session()->flash('message', 'Order claimed successfully!');
        }
    }

    public function updateStatus(Order $order, $status)
    {
        if ($order->livreur_id === auth()->id() && in_array($status, ['delivered', 'refused', 'canceled'])) {
            $order->update(['status' => $status]);
            
            // Handle COD transaction if delivered
            if ($status === 'delivered' && $order->amount_cod > 0) {
                auth()->user()->transactions()->create([
                    'order_id' => $order->id,
                    'type' => 'collection',
                    'amount' => $order->amount_cod,
                    'description' => 'Collected COD for order ' . $order->tracking_number,
                ]);
                auth()->user()->increment('balance', $order->amount_cod);

                $merchant = $order->merchant;
                if ($merchant) {
                    $merchant->transactions()->create([
                        'order_id' => $order->id,
                        'type' => 'credit',
                        'amount' => $order->amount_cod,
                        'description' => 'COD credited from delivered order ' . $order->tracking_number,
                    ]);
                    $merchant->increment('balance', $order->amount_cod);
                }
            }

            OrderStatusUpdated::dispatch($order);

            session()->flash('message', "Order marked as {$status}.");
        }
    }

    #[On('echo-private:livreur.{user_id},OrderStatusUpdated')]
    public function refreshOrders()
    {
        $this->render();
    }

    public function render()
    {
        $availableOrders = Order::where('status', 'pending')
                    ->whereNull('livreur_id')
                    ->latest()
                    ->paginate(10, ['*'], 'availablePage');

        $activeDeliveries = auth()->user()->ordersAsLivreur()
                    ->whereIn('status', ['in_transit'])
                    ->latest()
                    ->paginate(10, ['*'], 'activePage');

        return view('livewire.livreur-orders', compact('availableOrders', 'activeDeliveries'));
    }
}
