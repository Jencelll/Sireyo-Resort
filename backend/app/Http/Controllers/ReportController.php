<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getAnalytics(Request $request)
    {
        $bookings = Booking::with(['guest', 'accommodation'])->get();

        $transactions = $bookings->map(function ($booking) {
            $baseAmount = $booking->accommodation ? $booking->accommodation->capacity * 500 : 1500;
            return [
                'id' => 'TX-' . str_pad($booking->id, 4, '0', STR_PAD_LEFT),
                'guest' => $booking->guest ? $booking->guest->name : 'Unknown',
                'type' => $booking->accommodation ? $booking->accommodation->name : 'General',
                'amount' => $baseAmount,
                'date' => Carbon::parse($booking->check_in_date)->format('Y-m-d'),
                'time' => Carbon::parse($booking->created_at)->format('H:i'),
                'status' => 'Paid', 
            ];
        })->sortByDesc('date')->values();

        return response()->json([
            'transactions' => $transactions->all(),
        ]);
    }
}
