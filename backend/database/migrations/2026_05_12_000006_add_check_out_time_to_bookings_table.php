<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->time('check_out_time')->nullable()->after('check_out_date');
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('check_out_time');
        });
    }
};
