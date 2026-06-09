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
        Schema::create('driver', function (Blueprint $table) {
            $table->id();
            $table->foreignId('livreur_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('vehicle_type');
            $table->string('vehicle_number')->unique();
            $table->enum('availability_status', ['available', 'busy', 'offline'])->default('offline');
            $table->decimal('rating', 3, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver');
    }
};
