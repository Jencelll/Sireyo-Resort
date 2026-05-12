<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Users
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@sireyo.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Accommodations
        $accommodations = [
            ['name' => 'Cottage 1', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Main Area'],
            ['name' => 'Cottage 2', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Main Area'],
            ['name' => 'Cottage 3', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Main Area'],
            ['name' => 'Cottage 4', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Main Area'],
            ['name' => 'Cottage 5 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Cottage 6 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Cottage 7 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Cottage 8 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Cottage 9 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Cottage 10 BR', 'type' => 'Cottage', 'capacity' => 10, 'location' => 'Main Area'],
            ['name' => 'Tent (Center)', 'type' => 'Tent', 'capacity' => 4, 'location' => 'Camping Area'],
            ['name' => 'Tent (Bamboo)', 'type' => 'Tent', 'capacity' => 4, 'location' => 'Camping Area'],
            ['name' => 'Lubi Cottage 1', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 2', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 3', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 4', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 5', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 6', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 7', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Lubi Cottage 8', 'type' => 'Cottage', 'capacity' => 8, 'location' => 'Lubi Area'],
            ['name' => 'Kubo Cottage 1', 'type' => 'Kubo', 'capacity' => 6, 'location' => 'Kubo Area'],
            ['name' => 'Kubo Cottage 2', 'type' => 'Kubo', 'capacity' => 6, 'location' => 'Kubo Area'],
            ['name' => 'Kubo Cottage 3', 'type' => 'Kubo', 'capacity' => 6, 'location' => 'Kubo Area'],
            ['name' => 'Family Cottage', 'type' => 'Cottage', 'capacity' => 15, 'location' => 'Main Area'],
            ['name' => 'Maypan Hall', 'type' => 'Hall', 'capacity' => 50, 'location' => 'Events Area'],
            ['name' => 'Payag 1', 'type' => 'Payag', 'capacity' => 12, 'location' => 'VIP Area'],
            ['name' => 'Payag 2', 'type' => 'Payag', 'capacity' => 12, 'location' => 'VIP Area'],
            ['name' => 'Mini Payag 1', 'type' => 'Payag', 'capacity' => 6, 'location' => 'Beach Front'],
            ['name' => 'Mini Payag 2', 'type' => 'Payag', 'capacity' => 6, 'location' => 'Beach Front'],
            ['name' => 'Mini Payag 3', 'type' => 'Payag', 'capacity' => 6, 'location' => 'Beach Front'],
            ['name' => 'Bahay Kubo 1', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Bahay Kubo 2', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Bahay Kubo 3', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Bahay Kubo 4', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Bahay Kubo 5', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Bahay Kubo 6', 'type' => 'Bahay Kubo', 'capacity' => 4, 'location' => 'Authentic Area'],
            ['name' => 'Tiny House 1', 'type' => 'Tiny House', 'capacity' => 2, 'location' => 'Modern Area'],
            ['name' => 'Tiny House 2', 'type' => 'Tiny House', 'capacity' => 2, 'location' => 'Modern Area'],
            ['name' => 'Grounds Area (No Cottage)', 'type' => 'Grounds', 'capacity' => 0, 'location' => 'Open Grounds'],
            ['name' => 'Grounds Area (No Cottage)', 'type' => 'Grounds', 'capacity' => 0, 'location' => 'Open Grounds'],
        ];

        foreach ($accommodations as $acc) {
            $acc['created_at'] = now();
            $acc['updated_at'] = now();
            DB::table('accommodations')->insert($acc);
        }

        // Guests, bookings, and transactions are created by the app.
    }
}
