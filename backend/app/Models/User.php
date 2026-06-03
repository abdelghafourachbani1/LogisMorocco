<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'email', 'password', 'role', 'phone', 'balance', 'webhook_url', 'webhook_secret', 'webhook_active', 'merchant_id', 'sub_role', 'vehicle_type', 'vehicle_plate', 'cin', 'avatar_url', 'rating', 'available_balance', 'pending_balance', 'store_description', 'store_address', 'store_website', 'store_logo_url', 'bank_name', 'bank_rib', 'bank_holder_name'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function ordersAsMerchant(): HasMany
    {
        return $this->hasMany(Order::class, 'merchant_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'merchant_id');
    }

    public function ordersAsLivreur(): HasMany
    {
        return $this->hasMany(Order::class, 'livreur_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(User::class, 'merchant_id');
    }

    public function merchant(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
