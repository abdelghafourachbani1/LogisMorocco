<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $cities = [
            'Casablanca' => ['Boulevard Anfa, Casablanca', 'Maarif, Casablanca', 'Sidi Maarouf, Casablanca', 'Oasis, Casablanca'],
            'Rabat' => ['Agdal, Rabat', 'Hay Riad, Rabat', 'Avenue Mohammed V, Rabat'],
            'Marrakech' => ['Gueliz, Marrakech', 'Medina, Marrakech', 'Hivernage, Marrakech'],
            'Fez' => ['Ville Nouvelle, Fez', 'Route d\'Imouzzer, Fez'],
            'Tangier' => ['Malabata, Tangier', 'Boulevard Mohamed V, Tangier']
        ];
        
        $city = fake()->randomElement(array_keys($cities));
        $address = fake()->randomElement($cities[$city]);

        return [
            'merchant_id' => User::factory()->state(['role' => 'merchant']),
            'tracking_number' => 'LOG-' . strtoupper(Str::random(8)),
            'customer_name' => fake()->name(),
            'customer_phone' => '06' . fake()->numerify('########'),
            'customer_address' => $address,
            'amount_cod' => fake()->randomFloat(2, 100, 1500),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'canceled', 'refused']),
        ];
    }
}
