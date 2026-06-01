<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function index()
    {
        // Return latest active rentals first, or all if we want history
        return response()->json(Rental::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'guest_name' => 'required|string',
            'item_name' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|string|in:DAYTOUR,OVERNIGHT',
            'total_price' => 'required|numeric',
            'status' => 'required|string|in:Active,Returned',
        ]);

        $rental = Rental::create($request->all());

        return response()->json($rental, 201);
    }

    public function returnItem($id)
    {
        $rental = Rental::findOrFail($id);
        $rental->update(['status' => 'Returned']);

        return response()->json($rental);
    }
}
