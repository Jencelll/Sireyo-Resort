<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        $guests = Guest::with(['bookings.accommodation'])->get()->map(function (Guest $guest) {
            $latestBooking = $guest->bookings->sortByDesc('check_in_date')->first();

            return [
                'id' => (string) $guest->id,
                'name' => $guest->name,
                'room' => $latestBooking?->accommodation?->name ?? '',
                'guests' => $latestBooking?->pax ?? 0,
                'type' => $latestBooking?->type ?? 'DAYTOUR',
                'status' => $guest->status ?? 'Upcoming',
                'image' => $guest->image ?? '',
                'email' => $guest->email,
                'phone' => $guest->phone,
            ];
        });

        return response()->json($guests);
    }
}
