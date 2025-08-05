import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NetworkingToolCard } from '@/components/networking-tool-card';
import { ResultDisplay } from '@/components/result-display';
import { NetworkingResult } from '@/types/networking';

interface ToolState {
    isLoading: boolean;
    result: NetworkingResult | null;
    error?: string;
}

const tools = [
    {
        id: 'ping',
        title: 'Ping Tool',
        description: 'Test connectivity and measure response times',
        icon: '📡',
        endpoint: '/api/ping'
    },
    {
        id: 'traceroute',
        title: 'Traceroute',
        description: 'Trace the path packets take to reach a destination',
        icon: '🗺️',
        endpoint: '/api/traceroute'
    },
    {
        id: 'dns-lookup',
        title: 'DNS Lookup',
        description: 'Query DNS records for a domain',
        icon: '🔍',
        endpoint: '/api/dns-lookup'
    },
    {
        id: 'whois',
        title: 'WHOIS Lookup',
        description: 'Get domain registration information',
        icon: '📋',
        endpoint: '/api/whois'
    },
    {
        id: 'ip-geolocation',
        title: 'IP Geolocation',
        description: 'Find the geographic location of an IP address',
        icon: '🌍',
        endpoint: '/api/ip-geolocation'
    },
    {
        id: 'port-scan',
        title: 'Port Scanner',
        description: 'Check which ports are open on a host',
        icon: '🔓',
        endpoint: '/api/port-scan'
    },
    {
        id: 'subnet-calculator',
        title: 'Subnet Calculator',
        description: 'Calculate subnet information and host ranges',
        icon: '🧮',
        endpoint: '/api/subnet-calculator'
    },
    {
        id: 'mac-lookup',
        title: 'MAC Address Lookup',
        description: 'Find the vendor/manufacturer of a MAC address',
        icon: '🏷️',
        endpoint: '/api/mac-lookup'
    },
    {
        id: 'reverse-dns',
        title: 'Reverse DNS',
        description: 'Find the hostname associated with an IP address',
        icon: '🔄',
        endpoint: '/api/reverse-dns'
    },
    {
        id: 'ssl-checker',
        title: 'SSL Certificate Checker',
        description: 'Check SSL certificate status and expiry',
        icon: '🔒',
        endpoint: '/api/ssl-checker'
    }
];

export default function Welcome() {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [toolStates, setToolStates] = useState<Record<string, ToolState>>({});
    const [formData, setFormData] = useState<Record<string, string>>({});

    const updateToolState = (toolId: string, state: Partial<ToolState>) => {
        setToolStates(prev => ({
            ...prev,
            [toolId]: { ...prev[toolId], ...state }
        }));
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const executeTool = async (tool: typeof tools[number]) => {
        updateToolState(tool.id, { isLoading: true, error: undefined });

        try {
            const response = await fetch(tool.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(getToolParameters(tool.id))
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }

            updateToolState(tool.id, { 
                isLoading: false, 
                result: result.success ? result : null,
                error: result.success ? undefined : result.error 
            });
        } catch (error) {
            updateToolState(tool.id, { 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'An error occurred' 
            });
        }
    };

    const getToolParameters = (toolId: string) => {
        switch (toolId) {
            case 'ping':
                return {
                    host: formData.host || '',
                    count: parseInt(formData.count) || 4,
                    interval: parseInt(formData.interval) || 1
                };
            case 'traceroute':
                return {
                    host: formData.host || '',
                    max_hops: parseInt(formData.max_hops) || 30
                };
            case 'dns-lookup':
                return { domain: formData.domain || '' };
            case 'whois':
                return { domain: formData.domain || '' };
            case 'ip-geolocation':
                return { ip: formData.ip || '' };
            case 'port-scan':
                return {
                    host: formData.host || '',
                    start_port: parseInt(formData.start_port) || 80,
                    end_port: parseInt(formData.end_port) || 443
                };
            case 'subnet-calculator':
                return {
                    ip: formData.ip || '',
                    subnet: formData.subnet || ''
                };
            case 'mac-lookup':
                return { mac: formData.mac || '' };
            case 'reverse-dns':
                return { ip: formData.ip || '' };
            case 'ssl-checker':
                return { domain: formData.domain || '' };
            default:
                return {};
        }
    };

    const renderToolForm = (tool: typeof tools[number]) => {
        const currentState = toolStates[tool.id] || {};

        switch (tool.id) {
            case 'ping':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="host" className="text-gray-300">Host/IP Address</Label>
                            <Input
                                id="host"
                                placeholder="example.com or 8.8.8.8"
                                value={formData.host || ''}
                                onChange={(e) => handleFormChange('host', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="count" className="text-gray-300">Packet Count</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="4"
                                    value={formData.count || ''}
                                    onChange={(e) => handleFormChange('count', e.target.value)}
                                    className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="interval" className="text-gray-300">Interval (seconds)</Label>
                                <Input
                                    id="interval"
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="1"
                                    value={formData.interval || ''}
                                    onChange={(e) => handleFormChange('interval', e.target.value)}
                                    className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.host}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Pinging...' : 'Start Ping'}
                        </Button>
                    </div>
                );

            case 'traceroute':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="host" className="text-gray-300">Host/IP Address</Label>
                            <Input
                                id="host"
                                placeholder="example.com or 8.8.8.8"
                                value={formData.host || ''}
                                onChange={(e) => handleFormChange('host', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="max_hops" className="text-gray-300">Maximum Hops</Label>
                            <Input
                                id="max_hops"
                                type="number"
                                min="1"
                                max="64"
                                placeholder="30"
                                value={formData.max_hops || ''}
                                onChange={(e) => handleFormChange('max_hops', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.host}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Tracing Route...' : 'Start Traceroute'}
                        </Button>
                    </div>
                );

            case 'dns-lookup':
            case 'whois':
            case 'ssl-checker':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="domain" className="text-gray-300">Domain Name</Label>
                            <Input
                                id="domain"
                                placeholder="example.com"
                                value={formData.domain || ''}
                                onChange={(e) => handleFormChange('domain', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.domain}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Looking up...' : `Start ${tool.title}`}
                        </Button>
                    </div>
                );

            case 'ip-geolocation':
            case 'reverse-dns':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ip" className="text-gray-300">IP Address</Label>
                            <Input
                                id="ip"
                                placeholder="8.8.8.8"
                                value={formData.ip || ''}
                                onChange={(e) => handleFormChange('ip', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.ip}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Looking up...' : `Start ${tool.title}`}
                        </Button>
                    </div>
                );

            case 'port-scan':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="host" className="text-gray-300">Host/IP Address</Label>
                            <Input
                                id="host"
                                placeholder="example.com or 192.168.1.1"
                                value={formData.host || ''}
                                onChange={(e) => handleFormChange('host', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_port" className="text-gray-300">Start Port</Label>
                                <Input
                                    id="start_port"
                                    type="number"
                                    min="1"
                                    max="65535"
                                    placeholder="80"
                                    value={formData.start_port || ''}
                                    onChange={(e) => handleFormChange('start_port', e.target.value)}
                                    className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_port" className="text-gray-300">End Port</Label>
                                <Input
                                    id="end_port"
                                    type="number"
                                    min="1"
                                    max="65535"
                                    placeholder="443"
                                    value={formData.end_port || ''}
                                    onChange={(e) => handleFormChange('end_port', e.target.value)}
                                    className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                        <Alert className="border-yellow-500/20 bg-yellow-500/10">
                            <AlertDescription className="text-yellow-300 text-sm">
                                Port scanning is limited to 100 ports per request to prevent abuse.
                            </AlertDescription>
                        </Alert>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.host}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Scanning Ports...' : 'Start Port Scan'}
                        </Button>
                    </div>
                );

            case 'subnet-calculator':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ip" className="text-gray-300">IP Address</Label>
                            <Input
                                id="ip"
                                placeholder="192.168.1.0"
                                value={formData.ip || ''}
                                onChange={(e) => handleFormChange('ip', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="subnet" className="text-gray-300">Subnet (CIDR or Mask)</Label>
                            <Input
                                id="subnet"
                                placeholder="/24 or 255.255.255.0"
                                value={formData.subnet || ''}
                                onChange={(e) => handleFormChange('subnet', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.ip || !formData.subnet}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Calculating...' : 'Calculate Subnet'}
                        </Button>
                    </div>
                );

            case 'mac-lookup':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="mac" className="text-gray-300">MAC Address</Label>
                            <Input
                                id="mac"
                                placeholder="00:11:22:33:44:55"
                                value={formData.mac || ''}
                                onChange={(e) => handleFormChange('mac', e.target.value)}
                                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                            />
                        </div>
                        <Button 
                            onClick={() => executeTool(tool)} 
                            disabled={currentState.isLoading || !formData.mac}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {currentState.isLoading ? 'Looking up Vendor...' : 'Lookup Vendor'}
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="bg-gray-800/50 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            🔧 Network Diagnostics Toolkit
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Comprehensive suite of networking tools for system administrators, 
                            developers, and network professionals. Test connectivity, analyze networks, 
                            and diagnose issues with our powerful web-based utilities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-lg text-center">
                        <div className="text-3xl mb-3">⚡</div>
                        <h3 className="text-white font-semibold mb-2">Fast & Reliable</h3>
                        <p className="text-gray-400 text-sm">
                            High-performance tools with rate limiting and usage monitoring
                        </p>
                    </div>
                    <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-lg text-center">
                        <div className="text-3xl mb-3">🛡️</div>
                        <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
                        <p className="text-gray-400 text-sm">
                            No data logging, rate-limited requests, and secure execution
                        </p>
                    </div>
                    <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-lg text-center">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="text-white font-semibold mb-2">Detailed Results</h3>
                        <p className="text-gray-400 text-sm">
                            Comprehensive output with formatted data and raw results
                        </p>
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tools.map((tool) => {
                        const currentState = toolStates[tool.id] || {};
                        
                        return (
                            <div key={tool.id}>
                                <NetworkingToolCard
                                    title={tool.title}
                                    description={tool.description}
                                    icon={tool.icon}
                                    isActive={activeTool === tool.id}
                                    onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                                >
                                    {renderToolForm(tool)}
                                </NetworkingToolCard>

                                <ResultDisplay
                                    result={currentState.result}
                                    isLoading={currentState.isLoading || false}
                                    error={currentState.error}
                                    title={tool.title}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="bg-gray-800/30 border border-gray-700 p-6 rounded-lg">
                        <h3 className="text-white font-semibold mb-2">🔥 Rate Limits & Usage</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Tools are rate-limited per IP address to ensure fair usage and prevent abuse.
                            Most tools allow 10-30 requests per minute.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div className="bg-gray-700/20 p-2 rounded">
                                <div className="text-gray-400">Ping</div>
                                <div className="text-white">20/min</div>
                            </div>
                            <div className="bg-gray-700/20 p-2 rounded">
                                <div className="text-gray-400">DNS Lookup</div>
                                <div className="text-white">30/min</div>
                            </div>
                            <div className="bg-gray-700/20 p-2 rounded">
                                <div className="text-gray-400">Port Scan</div>
                                <div className="text-white">5/min</div>
                            </div>
                            <div className="bg-gray-700/20 p-2 rounded">
                                <div className="text-gray-400">WHOIS</div>
                                <div className="text-white">5/min</div>
                            </div>
                            <div className="bg-gray-700/20 p-2 rounded">
                                <div className="text-gray-400">SSL Check</div>
                                <div className="text-white">10/min</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}