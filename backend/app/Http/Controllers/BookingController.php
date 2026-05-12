<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name' => ['required', 'string', 'max:255'],
            'pax' => ['required', 'integer', 'min:1'],
            'minor_count' => ['nullable', 'integer', 'min:0'],
            'type' => ['required', 'in:DAYTOUR,OVERNIGHT,EXTENDED STAY'],
            'accommodation_id' => ['required', 'integer', 'exists:accommodations,id'],
            'advance_payment' => ['nullable', 'string'],
            'payment_status' => ['nullable', 'in:Paid Adv.,No Adv.,Partial'],
            'status' => ['nullable', 'in:Checked In,Confirmed,Pending'],
            'eta' => ['nullable', 'string', 'max:50'],
            'is_walk_in' => ['nullable', 'boolean'],
            'check_in_date' => ['required', 'date'],
        ]);

        $accommodation = Accommodation::findOrFail($data['accommodation_id']);
        $isWalkIn = (bool) ($data['is_walk_in'] ?? false);

        $guest = Guest::create([
            'name' => $data['guest_name'],
            'status' => $isWalkIn ? 'In-House' : 'Upcoming',
            'image' => 'https://picsum.photos/seed/' . urlencode($data['guest_name']) . '/100/100',
        ]);

        $booking = Booking::create([
            'guest_id' => $guest->id,
            'accommodation_id' => $accommodation->id,
            'type' => $data['type'],
            'pax' => $data['pax'],
            'minor_count' => $data['minor_count'] ?? 0,
            'advance_payment' => $data['advance_payment'] ?? null,
            'payment_status' => $isWalkIn ? 'Paid Adv.' : ($data['payment_status'] ?? 'No Adv.'),
            'status' => $isWalkIn ? 'Checked In' : ($data['status'] ?? 'Confirmed'),
            'eta' => $isWalkIn ? 'Walk-in' : ($data['eta'] ?? null),
            'is_walk_in' => $isWalkIn,
            'check_in_date' => $data['check_in_date'],
            'check_out_date' => null,
        ]);

        return response()->json([
            'booking' => [
                'id' => (string) $booking->id,
                'guestName' => $guest->name,
                'pax' => $booking->pax,
                'minorCount' => $booking->minor_count,
                'advancePayment' => $booking->advance_payment,
                'status' => $booking->status,
                'paymentStatus' => $booking->payment_status,
                'eta' => $booking->eta,
                'type' => $booking->type,
                'isWalkIn' => (bool) $booking->is_walk_in,
            ],
            'guest' => [
                'id' => (string) $guest->id,
                'name' => $guest->name,
                'status' => $guest->status,
                'image' => $guest->image,
            ],
        ], 201);
    }

    public function checkout($id)
    {
        $booking = Booking::findOrFail($id);
        
        $booking->update([
            'check_out_date' => now()->toDateString(),
        ]);

        if ($booking->guest_id) {
            $guest = Guest::find($booking->guest_id);
            if ($guest) {
                $guest->update(['status' => 'Checked Out']);
            }
        }

        return response()->json(['message' => 'Checked out successfully']);
    }
}
