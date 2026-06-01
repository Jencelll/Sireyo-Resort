<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_name',
        'item_name',
        'quantity',
        'type',
        'total_price',
        'status',
    ];
}
