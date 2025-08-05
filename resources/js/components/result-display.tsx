import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NetworkingResult } from '@/types/networking';

interface ResultDisplayProps {
    result: NetworkingResult | null;
    isLoading: boolean;
    error?: string;
    title: string;
}

export function ResultDisplay({ result, isLoading, error, title }: ResultDisplayProps) {
    if (isLoading) {
        return (
            <Card className="mt-6 bg-gray-800/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-300">Executing {title}...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert className="mt-6 border-red-500/20 bg-red-500/10">
                <AlertDescription className="text-red-300">
                    <strong>Error:</strong> {error}
                </AlertDescription>
            </Alert>
        );
    }

    if (!result) {
        return null;
    }

    return (
        <Card className="mt-6 bg-gray-800/20">
            <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                    {title} Results
                    <span className="text-sm text-gray-400 font-normal">
                        {result.execution_time}ms
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {renderResultContent(result)}
                </div>
            </CardContent>
        </Card>
    );
}

function renderResultContent(result: NetworkingResult) {
    // Check for specific result types using type guards
    if ('responses' in result && result.responses) {
        // Ping results
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Host</div>
                        <div className="text-white font-mono">{result.host || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Packets</div>
                        <div className="text-white">{result.count || 0}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Packet Loss</div>
                        <div className="text-white">{result.statistics?.packet_loss || 0}%</div>
                    </div>
                </div>
                
                {result.statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-700/30 p-3 rounded">
                            <div className="text-sm text-gray-400">Min Time</div>
                            <div className="text-white">{result.statistics.min_time}ms</div>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded">
                            <div className="text-sm text-gray-400">Avg Time</div>
                            <div className="text-white">{result.statistics.avg_time}ms</div>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded">
                            <div className="text-sm text-gray-400">Max Time</div>
                            <div className="text-white">{result.statistics.max_time}ms</div>
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-white font-medium mb-2">Individual Responses</h4>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                        {result.responses.map((response, index: number) => (
                            <div key={index} className="bg-gray-700/20 p-2 rounded font-mono text-sm text-gray-300">
                                {response.raw}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if ('hops' in result && result.hops) {
        // Traceroute results
        return (
            <div className="space-y-4">
                <div className="bg-gray-700/30 p-3 rounded">
                    <div className="text-sm text-gray-400">Target Host</div>
                    <div className="text-white font-mono">{result.host || 'Unknown'}</div>
                </div>
                
                <div>
                    <h4 className="text-white font-medium mb-2">Route Hops</h4>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                        {result.hops.map((hop, index: number) => (
                            <div key={index} className="bg-gray-700/20 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400 font-mono w-8">{hop.hop}</span>
                                    <span className="text-gray-300 font-mono text-sm">{hop.data}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if ('records' in result && result.records) {
        // DNS results
        return (
            <div className="space-y-4">
                <div className="bg-gray-700/30 p-3 rounded">
                    <div className="text-sm text-gray-400">Domain</div>
                    <div className="text-white font-mono">{result.domain || 'Unknown'}</div>
                </div>
                
                {Object.entries(result.records).map(([type, records]) => (
                    <div key={type}>
                        <h4 className="text-white font-medium mb-2">{type} Records</h4>
                        <div className="space-y-1">
                            {Array.isArray(records) && records.map((record, index: number) => (
                                <div key={index} className="bg-gray-700/20 p-2 rounded">
                                    <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                                        {JSON.stringify(record, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if ('country' in result || 'city' in result) {
        // IP Geolocation results
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">IP Address</div>
                        <div className="text-white font-mono">{result.ip || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Country</div>
                        <div className="text-white">{result.country || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">City</div>
                        <div className="text-white">{result.city || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">ISP</div>
                        <div className="text-white">{result.isp || 'Unknown'}</div>
                    </div>
                </div>
                
                {result.latitude && result.longitude && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 p-3 rounded">
                            <div className="text-sm text-gray-400">Latitude</div>
                            <div className="text-white font-mono">{result.latitude}</div>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded">
                            <div className="text-sm text-gray-400">Longitude</div>
                            <div className="text-white font-mono">{result.longitude}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if ('results' in result && Array.isArray(result.results)) {
        // Port scan results
        const openPorts = result.results.filter((r) => r.status === 'open');
        
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Host</div>
                        <div className="text-white font-mono">{result.host || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Port Range</div>
                        <div className="text-white">{result.port_range || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Open Ports</div>
                        <div className="text-green-400 font-medium">{openPorts.length}</div>
                    </div>
                </div>
                
                {openPorts.length > 0 && (
                    <div>
                        <h4 className="text-green-400 font-medium mb-2">Open Ports</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {openPorts.map((port, index: number) => (
                                <div key={index} className="bg-green-500/20 border border-green-500/30 p-2 rounded text-center">
                                    <div className="text-green-400 font-mono">{port.port}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if ('network_address' in result) {
        // Subnet calculator results
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">IP Address</div>
                        <div className="text-white font-mono">{result.ip || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">CIDR</div>
                        <div className="text-white font-mono">/{result.cidr || '0'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Subnet Mask</div>
                        <div className="text-white font-mono">{result.subnet_mask || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Network Address</div>
                        <div className="text-white font-mono">{result.network_address}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Broadcast Address</div>
                        <div className="text-white font-mono">{result.broadcast_address || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Total Hosts</div>
                        <div className="text-white">{result.total_hosts?.toLocaleString() || '0'}</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">First Host</div>
                        <div className="text-white font-mono">{result.first_host || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Last Host</div>
                        <div className="text-white font-mono">{result.last_host || 'Unknown'}</div>
                    </div>
                </div>
            </div>
        );
    }

    if ('valid_from' in result && result.domain) {
        // SSL Certificate results
        const isValid = result.is_valid;
        const daysUntilExpiry = result.days_until_expiry;
        
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Domain</div>
                        <div className="text-white font-mono">{result.domain}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Status</div>
                        <div className={`font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                            {isValid ? '✓ Valid' : '✗ Invalid/Expired'}
                        </div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Issuer</div>
                        <div className="text-white">{result.issuer || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Subject</div>
                        <div className="text-white">{result.subject || 'Unknown'}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Valid From</div>
                        <div className="text-white font-mono">{result.valid_from}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded">
                        <div className="text-sm text-gray-400">Valid To</div>
                        <div className="text-white font-mono">{result.valid_to || 'Unknown'}</div>
                    </div>
                </div>
                
                <div className="bg-gray-700/30 p-3 rounded">
                    <div className="text-sm text-gray-400">Days Until Expiry</div>
                    <div className={`text-lg font-medium ${
                        (daysUntilExpiry || 0) > 30 ? 'text-green-400' : 
                        (daysUntilExpiry || 0) > 7 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                        {daysUntilExpiry || 0} days
                    </div>
                </div>
            </div>
        );
    }

    // Generic results (WHOIS, MAC lookup, etc.)
    return (
        <div className="space-y-4">
            {'vendor' in result && result.vendor && (
                <div className="bg-gray-700/30 p-3 rounded">
                    <div className="text-sm text-gray-400">MAC Address</div>
                    <div className="text-white font-mono">{result.mac || 'Unknown'}</div>
                    <div className="text-sm text-gray-400 mt-2">Vendor</div>
                    <div className="text-white">{result.vendor}</div>
                </div>
            )}
            
            {'hostname' in result && result.hostname && (
                <div className="bg-gray-700/30 p-3 rounded">
                    <div className="text-sm text-gray-400">IP Address</div>
                    <div className="text-white font-mono">{result.ip || 'Unknown'}</div>
                    <div className="text-sm text-gray-400 mt-2">Hostname</div>
                    <div className="text-white font-mono">{result.hostname}</div>
                </div>
            )}
            
            {'raw_output' in result && result.raw_output && (
                <div>
                    <h4 className="text-white font-medium mb-2">Raw Output</h4>
                    <div className="bg-gray-900/50 p-4 rounded max-h-60 overflow-y-auto">
                        <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                            {result.raw_output}
                        </pre>
                    </div>
                </div>
            )}
            
            {'data' in result && result.data && typeof result.data === 'object' && (
                <div>
                    <h4 className="text-white font-medium mb-2">Detailed Information</h4>
                    <div className="bg-gray-900/50 p-4 rounded max-h-60 overflow-y-auto">
                        <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}