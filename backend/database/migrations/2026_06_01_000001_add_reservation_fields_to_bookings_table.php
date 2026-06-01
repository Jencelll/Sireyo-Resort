<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('contact_number')->nullable()->after('guest_id');
            $table->text('address')->nullable()->after('contact_number');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->string('reference_no')->nullable()->after('payment_method');
            $table->text('special_request')->nullable()->after('eta');
            $table->text('remarks')->nullable()->after('special_request');
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'contact_number',
                'address',
                'payment_method',
                'reference_no',
                'special_request',
                'remarks'
            ]);
        });
    }
};
