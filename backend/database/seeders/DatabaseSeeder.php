<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create standard admin, merchant and driver users with known credentials
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@logismaghreb.com',
            'role' => 'admin',
        ]);

        $testMerchant = User::factory()->merchant()->create([
            'name' => 'Morocco Craft Store',
            'email' => 'merchant@logismaghreb.com',
            'role' => 'merchant',
        ]);

        $testLivreur = User::factory()->livreur()->create([
            'name' => 'Amine El Idrissi',
            'email' => 'livreur@logismaghreb.com',
            'role' => 'livreur',
            'phone' => '0612345678',
        ]);

        // 2. Create more realistic merchants (active, suspended)
        $merchants = User::factory()->merchant()->count(10)->create();
        // Add one suspended merchant for administrative testing
        $suspendedMerchant = User::factory()->merchant()->create([
            'name' => 'Scent of Atlas',
            'email' => 'scent@atlas.ma',
            'status' => 'suspended',
        ]);
        
        $allMerchants = $merchants->concat([$testMerchant, $suspendedMerchant]);

        // 3. Create more realistic drivers (active, verification pending, suspended)
        $drivers = User::factory()->livreur()->count(8)->create();
        $pendingDriver = User::factory()->livreur()->create([
            'name' => 'Youssef Bennani',
            'email' => 'youssef@courier.ma',
            'status' => 'pending',
        ]);
        $suspendedDriver = User::factory()->livreur()->create([
            'name' => 'Hamza Mansouri',
            'email' => 'hamza@courier.ma',
            'status' => 'suspended',
        ]);

        $allDrivers = $drivers->concat([$testLivreur, $pendingDriver, $suspendedDriver]);
        $activeDrivers = $allDrivers->where('status', 'active');

        // 4. Create platform configurations
        DB::table('platform_settings')->insert([
            ['key' => 'platform_name', 'value' => 'LogisMorocco', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'commission_rate', 'value' => '12.5', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'base_delivery_fee', 'value' => '35', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'driver_holding_limit', 'value' => '5000', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'allowed_zones', 'value' => 'Casablanca, Rabat, Marrakech, Fez, Tangier', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'min_withdrawal_amount', 'value' => '100', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'allow_auto_assignment', 'value' => 'true', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 5. Create 120 Orders distributed over the past 6 months to feed dashboard analytics
        $statuses = ['pending', 'in_transit', 'delivered', 'canceled', 'refused'];
        
        $cities = [
            'Casablanca' => ['Boulevard Anfa, Casablanca', 'Maarif, Casablanca', 'Sidi Maarouf, Casablanca', 'Oasis, Casablanca'],
            'Rabat' => ['Agdal, Rabat', 'Hay Riad, Rabat', 'Avenue Mohammed V, Rabat'],
            'Marrakech' => ['Gueliz, Marrakech', 'Medina, Marrakech', 'Hivernage, Marrakech'],
            'Fez' => ['Ville Nouvelle, Fez', 'Route d\'Imouzzer, Fez'],
            'Tangier' => ['Malabata, Tangier', 'Boulevard Mohamed V, Tangier']
        ];

        $ordersCollection = collect();

        for ($i = 0; $i < 130; $i++) {
            $merchant = $allMerchants->random();
            $status = fake()->randomElement($statuses);
            
            // Pending orders have no courier, transit/delivered/refused must have one
            $livreur = ($status === 'pending') ? null : $activeDrivers->random();
            
            $city = fake()->randomElement(array_keys($cities));
            $address = fake()->randomElement($cities[$city]);
            
            // Randomize creation date between 6 months ago and today
            $createdAt = Carbon::now()->subDays(rand(0, 180))->subHours(rand(1, 23));
            $updatedAt = (clone $createdAt)->addHours(rand(2, 48));
            
            if ($updatedAt->isAfter(Carbon::now())) {
                $updatedAt = Carbon::now();
            }

            $orderId = DB::table('orders')->insertGetId([
                'merchant_id' => $merchant->id,
                'livreur_id' => $livreur ? $livreur->id : null,
                'tracking_number' => 'LOG-' . strtoupper(Str::random(8)),
                'customer_name' => fake()->name(),
                'customer_phone' => '06' . fake()->numerify('########'),
                'customer_address' => $address,
                'amount_cod' => fake()->randomFloat(2, 150, 1200),
                'status' => $status,
                'created_at' => $createdAt,
                'updated_at' => $updatedAt,
            ]);

            $ordersCollection->push((object)[
                'id' => $orderId,
                'merchant_id' => $merchant->id,
                'livreur_id' => $livreur ? $livreur->id : null,
                'status' => $status,
                'amount_cod' => fake()->randomFloat(2, 150, 1200),
                'created_at' => $createdAt,
            ]);
        }

        // 6. Seed Transactions (COD collections, payouts, driver payouts)
        
        // Let's create withdrawals/payout requests
        // Merchants requested withdrawals
        foreach ($allMerchants as $m) {
            // Completed payout
            DB::table('transactions')->insert([
                'user_id' => $m->id,
                'order_id' => null,
                'type' => 'payout',
                'amount' => -rand(1000, 5000),
                'status' => 'completed',
                'description' => 'Approved transfer to ' . $m->bank_name . ' (' . substr($m->bank_rib, -4) . ')',
                'created_at' => Carbon::now()->subDays(rand(10, 40)),
                'updated_at' => Carbon::now()->subDays(rand(10, 40)),
            ]);

            // Pending payout
            if (rand(0, 1)) {
                DB::table('transactions')->insert([
                    'user_id' => $m->id,
                    'order_id' => null,
                    'type' => 'payout',
                    'amount' => -rand(500, 3000),
                    'status' => 'pending',
                    'description' => 'Requested withdrawal of COD earnings.',
                    'created_at' => Carbon::now()->subDays(rand(0, 5)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 5)),
                ]);
            }
        }

        // Drivers requested withdrawals
        foreach ($activeDrivers as $d) {
            // Completed payout
            DB::table('transactions')->insert([
                'user_id' => $d->id,
                'order_id' => null,
                'type' => 'payout',
                'amount' => -rand(300, 1200),
                'status' => 'completed',
                'description' => 'Driver earnings withdrawal completed.',
                'created_at' => Carbon::now()->subDays(rand(10, 30)),
                'updated_at' => Carbon::now()->subDays(rand(10, 30)),
            ]);

            // Pending payout
            if (rand(0, 1)) {
                DB::table('transactions')->insert([
                    'user_id' => $d->id,
                    'order_id' => null,
                    'type' => 'payout',
                    'amount' => -rand(150, 800),
                    'status' => 'pending',
                    'description' => 'Driver weekly balance payout request.',
                    'created_at' => Carbon::now()->subDays(rand(0, 4)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 4)),
                ]);
            }
        }

        // 7. Seed support complaints
        
        $complaintTitles = [
            'Package damaged during transit',
            'Customer refused because of delay',
            'COD cash discrepancy in Maarif',
            'Wrong delivery address provided',
            'Livreur was impolite to customer',
            'GPS location accuracy issues in Rabat'
        ];

        for ($j = 0; $j < 12; $j++) {
            $user = $allMerchants->random();
            $order = $ordersCollection->random();
            $title = fake()->randomElement($complaintTitles);
            
            DB::table('complaints')->insert([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'title' => $title,
                'description' => fake()->paragraph(),
                'status' => fake()->randomElement(['open', 'pending', 'resolved', 'closed']),
                'priority' => fake()->randomElement(['low', 'medium', 'high']),
                'assigned_to' => fake()->randomElement(['admin@logismaghreb.com', null]),
                'created_at' => Carbon::now()->subDays(rand(1, 15)),
                'updated_at' => Carbon::now()->subDays(rand(0, 5)),
            ]);
        }

        // 8. Seed Audit Logs
        
        $events = [
            ['event' => 'user_suspended', 'description' => 'Admin suspended merchant store Scent of Atlas.'],
            ['event' => 'user_verified', 'description' => 'Admin verified driver credentials for Youssef Bennani.'],
            ['event' => 'payout_approved', 'description' => 'Admin approved COD withdrawal request of 3,500 MAD.'],
            ['event' => 'order_reassigned', 'description' => 'Admin reallocated order LOG-J8X9F2A1 from driver Amine to Youssef.'],
            ['event' => 'settings_updated', 'description' => 'Admin changed global commission rate to 12.5%.'],
        ];

        foreach ($events as $evt) {
            DB::table('audit_logs')->insert([
                'user_id' => $admin->id,
                'event' => $evt['event'],
                'description' => $evt['description'],
                'ip_address' => fake()->ipv4(),
                'created_at' => Carbon::now()->subDays(rand(0, 10)),
                'updated_at' => Carbon::now()->subDays(rand(0, 10)),
            ]);
        }
    }
}
