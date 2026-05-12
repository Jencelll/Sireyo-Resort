<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class AccommodationController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $accommodations = Accommodation::orderBy('id')->get();
        $bookings = Booking::with('guest')
            ->whereDate('check_in_date', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('check_out_date')
                    ->orWhereDate('check_out_date', '>=', $date);
            })
            ->get()
            ->groupBy('accommodation_id');

        $payload = $accommodations->map(function (Accommodation $acc) use ($bookings) {
            $accBookings = $bookings->get($acc->id, collect());

            $mapBooking = function (?Booking $booking) {
                if (! $booking) {
                    return null;
                }

                return [
                    'id' => (string) $booking->id,
                    'guestName' => $booking->guest?->name ?? 'Guest',
                    'pax' => $booking->pax,
                    'minorCount' => $booking->minor_count,
                    'advancePayment' => $booking->advance_payment,
                    'status' => $booking->status,
                    'paymentStatus' => $booking->payment_status,
                    'eta' => $booking->eta,
                    'type' => $booking->type,
                    'isWalkIn' => (bool) $booking->is_walk_in,
                    'checkInDate' => $booking->check_in_date,
                    'checkOutDate' => $booking->check_out_date,
                    'checkOutTime' => $booking->check_out_time,
                ];
            };

            $daytourBooking = $mapBooking($accBookings->firstWhere('type', 'DAYTOUR'));
            $overnightBooking = $mapBooking($accBookings->firstWhere('type', 'OVERNIGHT'));
            $extendedBooking = $mapBooking($accBookings->firstWhere('type', 'EXTENDED STAY'));

            $capacityLabel = $acc->capacity <= 0 ? 'No Guest Limit' : 'Max ' . $acc->capacity . ' Pax';

            return [
                'id' => (string) $acc->id,
                'name' => $acc->name,
                'capacity' => $capacityLabel,
                'location' => $acc->location ?? '',
                'daytourBooking' => $daytourBooking,
                'overnightBooking' => $overnightBooking,
                'extendedBooking' => $extendedBooking,
            ];
        });

        return response()->json($payload);
    }
}
