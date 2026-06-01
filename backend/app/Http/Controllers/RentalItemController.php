<?php

namespace App\Http\Controllers;

use App\Models\RentalItem;
use Illuminate\Http\Request;

class RentalItemController extends Controller
{
    public function index()
    {
        return response()->json(RentalItem::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string|in:inventory,corkage,electricity',
            'daytour_price' => 'nullable|numeric',
            'overnight_price' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'note' => 'nullable|string',
        ]);

        $item = RentalItem::create($request->all());

        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = RentalItem::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|string|in:inventory,corkage,electricity',
            'daytour_price' => 'nullable|numeric',
            'overnight_price' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'note' => 'nullable|string',
        ]);

        $item->update($request->all());

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = RentalItem::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item deleted']);
    }
}
