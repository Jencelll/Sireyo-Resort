<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_name' => ['required', 'string', 'max:255'],
            'pax' => ['required', 'integer', 'min:1'],
            'adult_count' => ['nullable', 'integer', 'min:1'],
            'minor_count' => ['nullable', 'integer', 'min:0'],
            'type' => ['required', 'in:DAYTOUR,OVERNIGHT,EXTENDED STAY'],
            'accommodation_id' => ['required', 'integer', 'exists:accommodations,id'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'advance_payment' => ['nullable', 'string'],
            'payment_mode' => ['nullable', 'string', 'max:50'],
            'reference_no' => ['nullable', 'string', 'max:100'],
            'request' => ['nullable', 'string', 'max:1000'],
            'remarks' => ['nullable', 'string', 'max:1000'],
            'payment_status' => ['nullable', 'in:Paid Adv.,No Adv.,Partial'],
            'status' => ['nullable', 'in:Checked In,Confirmed,Pending'],
            'eta' => ['nullable', 'string', 'max:50'],
            'is_walk_in' => ['nullable', 'boolean'],
            'check_in_date' => ['required', 'date'],
            'check_out_date' => ['nullable', 'date'],
            'check_out_time' => ['nullable', 'date_format:H:i'],
        ]);

        $accommodation = Accommodation::findOrFail($data['accommodation_id']);
        $isWalkIn = (bool) ($data['is_walk_in'] ?? false);

        $guest = Guest::create([
            'name' => $data['guest_name'],
            'status' => $isWalkIn ? 'In-House' : 'Upcoming',
            'image' => 'https://picsum.photos/seed/' . urlencode($data['guest_name']) . '/100/100',
        ]);

        $bookingData = [
            'guest_id' => $guest->id,
            'accommodation_id' => $accommodation->id,
            'type' => $data['type'],
            'pax' => $data['pax'],
            'adult_count' => $data['adult_count'] ?? null,
            'minor_count' => $data['minor_count'] ?? 0,
            'contact_number' => $data['contact_number'] ?? null,
            'address' => $data['address'] ?? null,
            'advance_payment' => $data['advance_payment'] ?? null,
            'payment_mode' => $data['payment_mode'] ?? null,
            'reference_no' => $data['reference_no'] ?? null,
            'request' => $data['request'] ?? null,
            'remarks' => $data['remarks'] ?? null,
            'payment_status' => $isWalkIn ? 'Paid Adv.' : ($data['payment_status'] ?? 'No Adv.'),
            'status' => $isWalkIn ? 'Checked In' : ($data['status'] ?? 'Confirmed'),
            'eta' => $isWalkIn ? 'Walk-in' : ($data['eta'] ?? null),
            'is_walk_in' => $isWalkIn,
            'check_in_date' => $data['check_in_date'],
            'check_out_date' => $data['check_out_date'] ?? null,
        ];

        if (Schema::hasColumn('bookings', 'check_out_time')) {
            $bookingData['check_out_time'] = $data['check_out_time'] ?? null;
        }

        $booking = Booking::create($bookingData);

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

        $data = request()->validate([
            'check_out_date' => ['nullable', 'date'],
            'check_out_time' => ['nullable', 'date_format:H:i'],
        ]);

        $checkOutDate = $data['check_out_date'] ?? now()->toDateString();
        $checkOutTime = $data['check_out_time'] ?? now()->format('H:i');
        
        $checkoutUpdate = [
            'check_out_date' => $checkOutDate,
        ];

        if (Schema::hasColumn('bookings', 'check_out_time')) {
            $checkoutUpdate['check_out_time'] = $checkOutTime;
        }

        $booking->update($checkoutUpdate);

        if ($booking->guest_id) {
            $guest = Guest::find($booking->guest_id);
            if ($guest) {
                $guest->update(['status' => 'Checked Out']);
            }
        }

        return response()->json(['message' => 'Checked out successfully']);
    }
}
