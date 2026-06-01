<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'contact_number',
        'address',
        'accommodation_id',
        'type',
        'pax',
        'minor_count',
        'advance_payment',
        'status',
        'payment_status',
        'payment_method',
        'reference_no',
        'eta',
        'special_request',
        'remarks',
        'is_walk_in',
        'check_in_date',
        'check_out_date',
        'check_out_time',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'is_walk_in' => 'boolean',
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
