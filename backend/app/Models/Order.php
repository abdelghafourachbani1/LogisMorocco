<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'merchant_id', 'livreur_id', 'tracking_number', 
    'customer_name', 'customer_phone', 'customer_address', 
    'amount_cod', 'status'
])]
class Order extends Model
{
    use HasFactory;

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }

    public function livreur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'livreur_id');
    }
}
