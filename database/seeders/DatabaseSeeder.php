<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UsageLog;
use App\Models\RateLimit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create sample usage logs for testing statistics
        UsageLog::factory(100)->create();
        
        // Create some rate limit records for testing
        RateLimit::factory(20)->create();
    }
}