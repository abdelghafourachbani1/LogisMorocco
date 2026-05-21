<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@logismaghreb.com',
            'role' => 'admin',
        ]);

        $merchant = User::factory()->create([
            'name' => 'Test Merchant',
            'email' => 'merchant@logismaghreb.com',
            'role' => 'merchant',
        ]);

        $livreur = User::factory()->create([
            'name' => 'Test Livreur',
            'email' => 'livreur@logismaghreb.com',
            'role' => 'livreur',
            'phone' => '0600000000',
        ]);

        Order::factory(10)->create([
            'merchant_id' => $merchant->id,
        ]);
        
        Order::factory(5)->create([
            'merchant_id' => $merchant->id,
            'livreur_id' => $livreur->id,
            'status' => 'in_transit',
        ]);
    }
}
