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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
            $table->decimal('delivery_fee', 10, 2)->default(0.00);
            $table->text('delivery_notes')->nullable();
            $table->string('failure_reason')->nullable();
            $table->json('status_history')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Cannot easily revert change() from string back to enum in a simple cross-DB migration,
            // but we can drop the newly added columns.
            $table->dropColumn(['delivery_fee', 'delivery_notes', 'failure_reason', 'status_history']);
        });
    }
};
