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
        Schema::create('rate_limits', function (Blueprint $table) {
            $table->id();
            $table->ipAddress('ip_address')->comment('IP address being rate limited');
            $table->string('tool_name')->comment('Name of the tool being rate limited');
            $table->integer('requests_count')->default(1)->comment('Number of requests made');
            $table->timestamp('window_start')->comment('Start of the rate limit window');
            $table->timestamps();
            
            // Unique constraint to prevent duplicate entries
            $table->unique(['ip_address', 'tool_name', 'window_start']);
            
            // Indexes for performance
            $table->index('ip_address');
            $table->index('tool_name');
            $table->index('window_start');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rate_limits');
    }
};