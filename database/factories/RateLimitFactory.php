<?php

namespace Database\Factories;

use App\Models\RateLimit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RateLimit>
 */
class RateLimitFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\RateLimit>
     */
    protected $model = RateLimit::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tools = [
            'ping', 'traceroute', 'dns_lookup', 'whois', 
            'ip_geolocation', 'port_scan', 'subnet_calculator',
            'mac_lookup', 'reverse_dns', 'ssl_checker'
        ];
        
        return [
            'ip_address' => fake()->ipv4(),
            'tool_name' => fake()->randomElement($tools),
            'requests_count' => fake()->numberBetween(1, 20),
            'window_start' => fake()->dateTimeBetween('-1 hour', 'now'),
        ];
    }
}