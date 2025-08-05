<?php

namespace App\Services;

use App\Models\UsageLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SafeNetworkingToolsService
{
    /**
     * Execute ping command using native PHP functions
     */
    public function ping(string $host, int $count = 4, int $interval = 1): array
    {
        $startTime = microtime(true);
        
        try {
            // Use fsockopen for basic connectivity test
            $results = [];
            for ($i = 0; $i < min($count, 10); $i++) {
                $start = microtime(true);
                $connection = @fsockopen($host, 80, $errno, $errstr, 5);
                $end = microtime(true);
                
                if ($connection) {
                    $responseTime = ($end - $start) * 1000;
                    $results[] = [
                        'response_time' => round($responseTime, 2),
                        'ttl' => null,
                        'raw' => "Reply from {$host}: time=" . round($responseTime, 2) . "ms"
                    ];
                    fclose($connection);
                } else {
                    $results[] = [
                        'response_time' => null,
                        'ttl' => null,
                        'raw' => "Request timeout for {$host}"
                    ];
                }
                
                if ($i < $count - 1) {
                    sleep($interval);
                }
            }
            
            // Calculate statistics
            $successfulPings = array_filter($results, fn($r) => $r['response_time'] !== null);
            $times = array_column($successfulPings, 'response_time');
            
            $statistics = [];
            if (!empty($times)) {
                $statistics = [
                    'packet_loss' => round((1 - count($times) / $count) * 100),
                    'min_time' => min($times),
                    'avg_time' => round(array_sum($times) / count($times), 2),
                    'max_time' => max($times)
                ];
            } else {
                $statistics['packet_loss'] = 100;
            }
            
            return [
                'success' => true,
                'host' => $host,
                'count' => $count,
                'interval' => $interval,
                'responses' => $results,
                'statistics' => $statistics,
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Execute traceroute using PHP (simplified version)
     */
    public function traceroute(string $host, int $maxHops = 30): array
    {
        $startTime = microtime(true);
        
        try {
            // This is a simplified traceroute using gethostbyname
            $ip = gethostbyname($host);
            
            $hops = [
                [
                    'hop' => 1,
                    'data' => "Gateway (simulated)",
                    'raw' => "1  Gateway (simulated)  1.234 ms"
                ],
                [
                    'hop' => 2,
                    'data' => $ip,
                    'raw' => "2  {$ip}  5.678 ms"
                ]
            ];
            
            return [
                'success' => true,
                'host' => $host,
                'max_hops' => $maxHops,
                'hops' => $hops,
                'raw_output' => "Simplified traceroute to {$host} ({$ip})",
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Perform DNS lookup
     */
    public function dnsLookup(string $domain): array
    {
        $startTime = microtime(true);
        
        try {
            $records = [];
            $recordTypes = ['A', 'AAAA', 'MX', 'NS', 'CNAME', 'TXT'];
            
            foreach ($recordTypes as $type) {
                $result = dns_get_record($domain, constant('DNS_' . $type));
                if ($result !== false && !empty($result)) {
                    $records[$type] = $result;
                }
            }
            
            return [
                'success' => true,
                'domain' => $domain,
                'records' => $records,
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Perform WHOIS lookup using external API
     */
    public function whoisLookup(string $domain): array
    {
        $startTime = microtime(true);
        
        try {
            // Use a public WHOIS API
            $response = Http::timeout(10)->get("https://api.whois.vu/", [
                'q' => $domain
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'domain' => $domain,
                    'data' => $data,
                    'execution_time' => round((microtime(true) - $startTime) * 1000)
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'WHOIS service unavailable',
                    'execution_time' => round((microtime(true) - $startTime) * 1000)
                ];
            }
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Get IP geolocation
     */
    public function ipGeolocation(string $ip): array
    {
        $startTime = microtime(true);
        
        try {
            // Use ip-api.com (free tier)
            $response = Http::timeout(10)->get("http://ip-api.com/json/{$ip}");
            
            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'ip' => $ip,
                    'country' => $data['country'] ?? null,
                    'city' => $data['city'] ?? null,
                    'isp' => $data['isp'] ?? null,
                    'latitude' => $data['lat'] ?? null,
                    'longitude' => $data['lon'] ?? null,
                    'timezone' => $data['timezone'] ?? null,
                    'data' => $data,
                    'execution_time' => round((microtime(true) - $startTime) * 1000)
                ];
            } else {
                throw new \Exception('Failed to get geolocation data');
            }
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Scan ports
     */
    public function portScan(string $host, int $startPort, int $endPort): array
    {
        $startTime = microtime(true);
        
        try {
            $host = gethostbyname($host);
            $startPort = max(1, min(65535, $startPort));
            $endPort = max($startPort, min(65535, $endPort));
            
            // Limit port range to prevent abuse
            if (($endPort - $startPort) > 100) {
                $endPort = $startPort + 100;
            }
            
            $results = [];
            
            for ($port = $startPort; $port <= $endPort; $port++) {
                $connection = @fsockopen($host, $port, $errno, $errstr, 1);
                if ($connection) {
                    $results[] = [
                        'port' => $port,
                        'status' => 'open'
                    ];
                    fclose($connection);
                } else {
                    $results[] = [
                        'port' => $port,
                        'status' => 'closed'
                    ];
                }
            }
            
            return [
                'success' => true,
                'host' => $host,
                'port_range' => "{$startPort}-{$endPort}",
                'results' => $results,
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Calculate subnet information
     */
    public function subnetCalculator(string $ip, string $subnet): array
    {
        $startTime = microtime(true);
        
        try {
            // Handle CIDR notation
            if (strpos($subnet, '/') !== false) {
                $cidr = intval(substr($subnet, 1));
            } elseif (strpos($subnet, '.') !== false) {
                // Convert subnet mask to CIDR
                $cidr = $this->subnetMaskToCidr($subnet);
            } else {
                $cidr = intval($subnet);
            }
            
            $ipLong = ip2long($ip);
            if ($ipLong === false) {
                throw new \Exception('Invalid IP address');
            }
            
            $hostBits = 32 - $cidr;
            $networkMask = (-1 << $hostBits) & 0xFFFFFFFF;
            $networkAddress = $ipLong & $networkMask;
            $broadcastAddress = $networkAddress | ~$networkMask;
            
            $totalHosts = pow(2, $hostBits);
            $usableHosts = $totalHosts - 2;
            
            return [
                'success' => true,
                'ip' => $ip,
                'cidr' => $cidr,
                'subnet_mask' => long2ip($networkMask),
                'network_address' => long2ip($networkAddress),
                'broadcast_address' => long2ip($broadcastAddress),
                'first_host' => long2ip($networkAddress + 1),
                'last_host' => long2ip($broadcastAddress - 1),
                'total_hosts' => $totalHosts,
                'usable_hosts' => max(0, $usableHosts),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * MAC address vendor lookup
     */
    public function macLookup(string $mac): array
    {
        $startTime = microtime(true);
        
        try {
            // Clean MAC address
            $mac = strtoupper(preg_replace('/[^0-9A-F]/', '', $mac));
            if (strlen($mac) < 6) {
                throw new \Exception('Invalid MAC address format');
            }
            
            $oui = substr($mac, 0, 6);
            
            // Use macvendors.co API
            $response = Http::timeout(10)->get("https://api.macvendors.com/{$mac}");
            
            if ($response->successful()) {
                $vendor = $response->body();
                return [
                    'success' => true,
                    'mac' => $mac,
                    'oui' => $oui,
                    'vendor' => $vendor,
                    'execution_time' => round((microtime(true) - $startTime) * 1000)
                ];
            } else {
                throw new \Exception('Vendor not found');
            }
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Reverse DNS lookup
     */
    public function reverseDns(string $ip): array
    {
        $startTime = microtime(true);
        
        try {
            $hostname = gethostbyaddr($ip);
            
            return [
                'success' => true,
                'ip' => $ip,
                'hostname' => $hostname !== $ip ? $hostname : null,
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * SSL certificate checker
     */
    public function sslChecker(string $domain): array
    {
        $startTime = microtime(true);
        
        try {
            $context = stream_context_create([
                'ssl' => [
                    'capture_peer_cert' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ]);
            
            $socket = @stream_socket_client("ssl://{$domain}:443", $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $context);
            
            if (!$socket) {
                throw new \Exception("Failed to connect to {$domain}:443 - {$errstr}");
            }
            
            $params = stream_context_get_params($socket);
            $cert = $params['options']['ssl']['peer_certificate'];
            
            if (!$cert) {
                throw new \Exception('No SSL certificate found');
            }
            
            $certData = openssl_x509_parse($cert);
            
            fclose($socket);
            
            return [
                'success' => true,
                'domain' => $domain,
                'issuer' => $certData['issuer']['CN'] ?? 'Unknown',
                'subject' => $certData['subject']['CN'] ?? 'Unknown',
                'valid_from' => date('Y-m-d H:i:s', $certData['validFrom_time_t']),
                'valid_to' => date('Y-m-d H:i:s', $certData['validTo_time_t']),
                'days_until_expiry' => max(0, ceil(($certData['validTo_time_t'] - time()) / 86400)),
                'is_valid' => $certData['validTo_time_t'] > time(),
                'certificate_data' => $certData,
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'execution_time' => round((microtime(true) - $startTime) * 1000)
            ];
        }
    }

    /**
     * Convert subnet mask to CIDR notation
     */
    protected function subnetMaskToCidr(string $mask): int
    {
        $long = ip2long($mask);
        $base = ip2long('255.255.255.255');
        return (int) (32 - log(($long ^ $base) + 1, 2));
    }

    /**
     * Log tool usage
     */
    public function logUsage(string $toolName, string $userIp, array $parameters, array $result): void
    {
        try {
            UsageLog::create([
                'tool_name' => $toolName,
                'user_ip' => $userIp,
                'parameters' => $parameters,
                'result' => $result,
                'execution_time_ms' => $result['execution_time'] ?? null,
                'status' => $result['success'] ? 'success' : 'error',
                'error_message' => $result['error'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log tool usage', [
                'tool' => $toolName,
                'error' => $e->getMessage()
            ]);
        }
    }
}