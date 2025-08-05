<?php

namespace App\Services;

use App\Models\RateLimit;
use Carbon\Carbon;

class RateLimitService
{
    /**
     * Check if request is within rate limit
     */
    public function checkRateLimit(string $ipAddress, string $toolName, int $maxRequests = 10, int $windowMinutes = 1): bool
    {
        $windowStart = Carbon::now()->startOfMinute();
        
        // Find or create rate limit record
        $rateLimit = RateLimit::where('ip_address', $ipAddress)
            ->where('tool_name', $toolName)
            ->where('window_start', $windowStart)
            ->first();
        
        if (!$rateLimit) {
            // Create new rate limit record
            RateLimit::create([
                'ip_address' => $ipAddress,
                'tool_name' => $toolName,
                'requests_count' => 1,
                'window_start' => $windowStart,
            ]);
            
            // Clean up old records
            $this->cleanupOldRecords();
            
            return true;
        }
        
        if ($rateLimit->requests_count >= $maxRequests) {
            return false;
        }
        
        // Increment request count
        $rateLimit->increment('requests_count');
        
        return true;
    }

    /**
     * Get remaining requests for IP and tool
     */
    public function getRemainingRequests(string $ipAddress, string $toolName, int $maxRequests = 10): int
    {
        $windowStart = Carbon::now()->startOfMinute();
        
        $rateLimit = RateLimit::where('ip_address', $ipAddress)
            ->where('tool_name', $toolName)
            ->where('window_start', $windowStart)
            ->first();
        
        if (!$rateLimit) {
            return $maxRequests;
        }
        
        return max(0, $maxRequests - $rateLimit->requests_count);
    }

    /**
     * Clean up old rate limit records
     */
    protected function cleanupOldRecords(): void
    {
        // Delete records older than 1 hour
        RateLimit::where('window_start', '<', Carbon::now()->subHour())->delete();
    }

    /**
     * Get usage statistics
     */
    public function getUsageStats(): array
    {
        // Get stats for the last 24 hours
        $since = Carbon::now()->subDay();
        
        $stats = RateLimit::where('created_at', '>=', $since)
            ->selectRaw('tool_name, COUNT(*) as total_requests, COUNT(DISTINCT ip_address) as unique_ips')
            ->groupBy('tool_name')
            ->get()
            ->keyBy('tool_name')
            ->toArray();
        
        return $stats;
    }
}