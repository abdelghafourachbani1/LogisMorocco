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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('livreur_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tracking_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_address');
            $table->decimal('amount_cod', 10, 2)->default(0);
            $table->enum('status', ['pending', 'in_transit', 'delivered', 'canceled', 'refused'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
