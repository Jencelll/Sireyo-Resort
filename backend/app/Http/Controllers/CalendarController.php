<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function show(Request $request, $accommodationId)
    {
        $bookings = Booking::with('guest')
            ->where('accommodation_id', $accommodationId)
            ->whereNotNull('check_in_date')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => (string) $booking->id,
                    'guestName' => $booking->guest?->name ?? 'Unknown',
                    'type' => $booking->type,
                    'checkInDate' => $booking->check_in_date,
                    'checkOutDate' => $booking->check_out_date,
                    'status' => $booking->status,
                    'pax' => $booking->pax,
                    'isWalkIn' => (bool) $booking->is_walk_in,
                    'image' => $booking->guest?->image ?? null,
                ];
            });

        return response()->json($bookings);
    }
}
