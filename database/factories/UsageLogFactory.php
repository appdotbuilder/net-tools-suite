<?php

namespace Database\Factories;

use App\Models\UsageLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UsageLog>
 */
class UsageLogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\UsageLog>
     */
    protected $model = UsageLog::class;

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
        
        $toolName = fake()->randomElement($tools);
        
        return [
            'tool_name' => $toolName,
            'user_ip' => fake()->ipv4(),
            'parameters' => $this->generateParameters($toolName),
            'result' => $this->generateResult($toolName),
            'execution_time_ms' => fake()->numberBetween(50, 5000),
            'status' => fake()->randomElement(['success', 'error']),
            'error_message' => fake()->boolean(20) ? fake()->sentence() : null,
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Generate sample parameters for a tool
     */
    protected function generateParameters(string $toolName): array
    {
        switch ($toolName) {
            case 'ping':
                return [
                    'host' => fake()->domainName(),
                    'count' => fake()->numberBetween(1, 10),
                    'interval' => fake()->numberBetween(1, 5),
                ];
            case 'traceroute':
                return [
                    'host' => fake()->domainName(),
                    'max_hops' => fake()->numberBetween(10, 64),
                ];
            case 'dns_lookup':
            case 'whois':
            case 'ssl_checker':
                return [
                    'domain' => fake()->domainName(),
                ];
            case 'ip_geolocation':
            case 'reverse_dns':
                return [
                    'ip' => fake()->ipv4(),
                ];
            case 'port_scan':
                return [
                    'host' => fake()->domainName(),
                    'start_port' => fake()->numberBetween(1, 1000),
                    'end_port' => fake()->numberBetween(1001, 2000),
                ];
            case 'subnet_calculator':
                return [
                    'ip' => fake()->ipv4(),
                    'subnet' => '/' . fake()->numberBetween(16, 30),
                ];
            case 'mac_lookup':
                return [
                    'mac' => fake()->macAddress(),
                ];
            default:
                return [];
        }
    }

    /**
     * Generate sample result for a tool
     */
    protected function generateResult(string $toolName): array
    {
        return [
            'success' => fake()->boolean(85),
            'execution_time' => fake()->numberBetween(50, 5000),
            'data' => 'Sample result data for ' . $toolName,
        ];
    }
}