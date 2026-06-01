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
        Schema::create('rental_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // 'inventory', 'corkage', 'electricity'
            $table->integer('daytour_price')->nullable();
            $table->integer('overnight_price')->nullable();
            $table->integer('price')->nullable(); // For corkage and electricity
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_items');
    }
};
