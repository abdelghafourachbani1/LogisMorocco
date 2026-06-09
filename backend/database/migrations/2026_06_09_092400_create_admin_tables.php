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
        // Add status to users table
        if (!Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('status')->default('active')->after('role'); // active, suspended, pending
            });
        }

        // Add status to transactions table
        if (!Schema::hasColumn('transactions', 'status')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('status')->default('completed')->after('amount'); // pending, completed, rejected
            });
        }

        // Create complaints table
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('status')->default('open'); // open, pending, resolved, closed
            $table->string('priority')->default('medium'); // low, medium, high
            $table->string('assigned_to')->nullable(); // admin username/email
            $table->timestamps();
        });

        // Create audit_logs table
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event');
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        // Create platform_settings table
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('complaints');

        if (Schema::hasColumn('transactions', 'status')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }

        if (Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};

