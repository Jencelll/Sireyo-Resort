<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'accommodation_id',
        'type',
        'pax',
        'minor_count',
        'advance_payment',
        'status',
        'payment_status',
        'eta',
        'is_walk_in',
        'check_in_date',
        'check_out_date',
    ];

    public function accommodation()
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
