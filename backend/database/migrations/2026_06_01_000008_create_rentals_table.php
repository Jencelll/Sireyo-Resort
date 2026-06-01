<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->string('guest_name');
            $table->string('item_name');
            $table->integer('quantity');
            $table->string('type'); // 'DAYTOUR', 'OVERNIGHT'
            $table->integer('total_price');
            $table->string('status')->default('Active'); // 'Active', 'Returned'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
