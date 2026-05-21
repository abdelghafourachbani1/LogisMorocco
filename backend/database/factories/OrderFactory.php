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
        return [
            'merchant_id' => User::factory()->state(['role' => 'merchant']),
            'tracking_number' => 'LOG-' . strtoupper(Str::random(8)),
            'customer_name' => fake()->name(),
            'customer_phone' => fake()->phoneNumber(),
            'customer_address' => fake()->address(),
            'amount_cod' => fake()->randomFloat(2, 50, 1000),
            'status' => fake()->randomElement(['pending', 'in_transit', 'delivered', 'canceled', 'refused']),
        ];
    }
}
