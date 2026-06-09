<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Model\User;

#[Fillable(['vehicle_type', 'vehicle_number'])]

class Driver extends User
{
    public function user(){
        return $this->belongsTo(User::class, 'livreur_id');
    }
}
