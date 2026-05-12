<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_id')->constrained()->onDelete('cascade');
            $table->foreignId('accommodation_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['DAYTOUR', 'OVERNIGHT', 'EXTENDED STAY']);
            $table->integer('pax');
            $table->integer('minor_count')->default(0);
            $table->string('advance_payment')->nullable();
            $table->enum('status', ['Checked In', 'Confirmed', 'Pending'])->default('Pending');
            $table->enum('payment_status', ['Paid Adv.', 'No Adv.', 'Partial'])->default('No Adv.');
            $table->string('eta')->nullable();
            $table->boolean('is_walk_in')->default(false);
            $table->date('check_in_date');
            $table->date('check_out_date')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
