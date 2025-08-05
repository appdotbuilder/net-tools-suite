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
        Schema::create('usage_logs', function (Blueprint $table) {
            $table->id();
            $table->string('tool_name')->comment('Name of the networking tool used');
            $table->ipAddress('user_ip')->comment('IP address of the user');
            $table->json('parameters')->nullable()->comment('Parameters passed to the tool');
            $table->json('result')->nullable()->comment('Result returned by the tool');
            $table->integer('execution_time_ms')->nullable()->comment('Execution time in milliseconds');
            $table->string('status', 20)->default('success')->comment('Status of the execution');
            $table->text('error_message')->nullable()->comment('Error message if execution failed');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('tool_name');
            $table->index('user_ip');
            $table->index('status');
            $table->index(['tool_name', 'created_at']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usage_logs');
    }
};