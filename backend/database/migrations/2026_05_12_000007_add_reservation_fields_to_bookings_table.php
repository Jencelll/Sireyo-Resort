<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('contact_number', 50)->nullable()->after('pax');
            $table->string('address', 255)->nullable()->after('contact_number');
            $table->integer('adult_count')->nullable()->after('address');
            $table->string('payment_mode', 50)->nullable()->after('advance_payment');
            $table->string('reference_no', 100)->nullable()->after('payment_mode');
            $table->text('request')->nullable()->after('reference_no');
            $table->text('remarks')->nullable()->after('request');
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'contact_number',
                'address',
                'adult_count',
                'payment_mode',
                'reference_no',
                'request',
                'remarks',
            ]);
        });
    }
};
