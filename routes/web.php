<?php

use App\Http\Controllers\NetworkingToolsController;
use App\Http\Controllers\Api\PingController;
use App\Http\Controllers\Api\DnsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - networking tools dashboard
Route::get('/', [NetworkingToolsController::class, 'index'])->name('home');

// API routes for networking tools
Route::prefix('api')->group(function () {
    Route::post('/ping', [PingController::class, 'store']);
    Route::post('/dns-lookup', [DnsController::class, 'store']);
    
    // Simplified endpoints for demo - using basic responses
    Route::post('/traceroute', function() {
        return response()->json(['success' => true, 'message' => 'Traceroute tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/whois', function() {
        return response()->json(['success' => true, 'message' => 'WHOIS tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/ip-geolocation', function() {
        return response()->json(['success' => true, 'message' => 'IP Geolocation tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/port-scan', function() {
        return response()->json(['success' => true, 'message' => 'Port Scanner tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/subnet-calculator', function() {
        return response()->json(['success' => true, 'message' => 'Subnet Calculator tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/mac-lookup', function() {
        return response()->json(['success' => true, 'message' => 'MAC Lookup tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/reverse-dns', function() {
        return response()->json(['success' => true, 'message' => 'Reverse DNS tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::post('/ssl-checker', function() {
        return response()->json(['success' => true, 'message' => 'SSL Checker tool - implementation simplified for demo', 'execution_time' => 100]);
    });
    Route::get('/statistics', function() {
        return response()->json(['success' => true, 'statistics' => []]);
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
