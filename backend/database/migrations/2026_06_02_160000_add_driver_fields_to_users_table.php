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
        Schema::table('users', function (Blueprint $table) {
            $table->string('vehicle_type')->nullable();
            $table->string('vehicle_plate')->nullable();
            $table->string('cin')->nullable();
            $table->string('avatar_url')->nullable();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->decimal('available_balance', 10, 2)->default(0.00);
            $table->decimal('pending_balance', 10, 2)->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'vehicle_type',
                'vehicle_plate',
                'cin',
                'avatar_url',
                'rating',
                'available_balance',
                'pending_balance'
            ]);
        });
    }
};
