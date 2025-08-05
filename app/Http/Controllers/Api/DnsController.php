<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SafeNetworkingToolsService;
use App\Services\RateLimitService;
use Illuminate\Http\Request;

class DnsController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private SafeNetworkingToolsService $toolsService,
        private RateLimitService $rateLimitService
    ) {}

    /**
     * Execute DNS lookup tool.
     */
    public function store(Request $request)
    {
        $request->validate([
            'domain' => 'required|string|max:255',
        ]);

        $userIp = $request->ip();
        
        if (!$this->rateLimitService->checkRateLimit($userIp, 'dns_lookup', 30, 1)) {
            return response()->json([
                'success' => false,
                'error' => 'Rate limit exceeded. Please try again later.',
                'remaining_requests' => $this->rateLimitService->getRemainingRequests($userIp, 'dns_lookup', 30)
            ], 429);
        }

        $parameters = [
            'domain' => $request->input('domain'),
        ];

        $result = $this->toolsService->dnsLookup($parameters['domain']);

        $this->toolsService->logUsage('dns_lookup', $userIp, $parameters, $result);

        return response()->json($result);
    }
}