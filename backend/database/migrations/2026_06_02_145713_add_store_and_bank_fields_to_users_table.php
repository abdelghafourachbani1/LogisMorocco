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
            $table->text('store_description')->nullable();
            $table->text('store_address')->nullable();
            $table->string('store_website')->nullable();
            $table->string('store_logo_url')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_rib')->nullable();
            $table->string('bank_holder_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'store_description',
                'store_address',
                'store_website',
                'store_logo_url',
                'bank_name',
                'bank_rib',
                'bank_holder_name'
            ]);
        });
    }
};
