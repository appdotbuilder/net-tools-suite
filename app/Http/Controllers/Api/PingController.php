<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SafeNetworkingToolsService;
use App\Services\RateLimitService;
use Illuminate\Http\Request;

class PingController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private SafeNetworkingToolsService $toolsService,
        private RateLimitService $rateLimitService
    ) {}

    /**
     * Execute ping tool.
     */
    public function store(Request $request)
    {
        $request->validate([
            'host' => 'required|string|max:255',
            'count' => 'nullable|integer|min:1|max:10',
            'interval' => 'nullable|integer|min:1|max:5',
        ]);

        $userIp = $request->ip();
        
        if (!$this->rateLimitService->checkRateLimit($userIp, 'ping', 20, 1)) {
            return response()->json([
                'success' => false,
                'error' => 'Rate limit exceeded. Please try again later.',
                'remaining_requests' => $this->rateLimitService->getRemainingRequests($userIp, 'ping', 20)
            ], 429);
        }

        $parameters = [
            'host' => $request->input('host'),
            'count' => $request->input('count', 4),
            'interval' => $request->input('interval', 1),
        ];

        $result = $this->toolsService->ping(
            $parameters['host'],
            $parameters['count'],
            $parameters['interval']
        );

        $this->toolsService->logUsage('ping', $userIp, $parameters, $result);

        return response()->json($result);
    }
}