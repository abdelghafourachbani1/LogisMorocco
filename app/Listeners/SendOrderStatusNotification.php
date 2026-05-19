<?php

namespace App\Listeners;

use App\Events\OrderStatusUpdated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\OrderStatusUpdatedNotification;
use App\Models\User;

class SendOrderStatusNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderStatusUpdated $event): void
    {
        $order = $event->order;
        $message = "Order {$order->tracking_number} status updated to {$order->status}.";

        // Notify the merchant
        if ($order->merchant) {
            $order->merchant->notify(new OrderStatusUpdatedNotification($order, $message));
        }

        // Notify the admin(s)
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new OrderStatusUpdatedNotification($order, $message));
        }
    }
}
