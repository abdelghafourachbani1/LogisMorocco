<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'merchant',
            'status' => 'active',
            'phone' => '06' . fake()->numerify('########'),
            'balance' => fake()->randomFloat(2, 1000, 15000),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Merchant role state.
     */
    public function merchant(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'merchant',
            'store_description' => fake()->sentence(),
            'store_address' => fake()->address(),
            'store_website' => 'https://' . fake()->domainName(),
            'bank_name' => fake()->randomElement(['CIH Bank', 'Attijariwafa Bank', 'BMCE Bank', 'Banque Populaire']),
            'bank_rib' => fake()->numerify('########################'),
            'bank_holder_name' => fake()->name(),
            'webhook_url' => fake()->url(),
            'webhook_secret' => Str::random(32),
        ]);
    }

    /**
     * Driver/Livreur role state.
     */
    public function livreur(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'livreur',
            'vehicle_type' => fake()->randomElement(['moto', 'car', 'van']),
            'vehicle_plate' => fake()->bothify('#####-?-##'),
            'cin' => fake()->bothify('??######'),
            'rating' => fake()->randomFloat(2, 4.0, 5.0),
            'available_balance' => fake()->randomFloat(2, 500, 3000),
            'pending_balance' => fake()->randomFloat(2, 0, 1000),
        ]);
    }
}
