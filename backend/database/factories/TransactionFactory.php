<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_id' => Order::factory(),
            'type' => fake()->randomElement(['collection', 'payout', 'adjustment']),
            'amount' => fake()->randomFloat(2, 10, 500),
            'description' => fake()->sentence(),
        ];
    }
}
