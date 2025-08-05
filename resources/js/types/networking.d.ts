export interface PingResponse {
    response_time: number | null;
    ttl: number | null;
    raw: string;
}

export interface PingStatistics {
    packet_loss?: number;
    min_time?: number;
    avg_time?: number;
    max_time?: number;
}

export interface PingResult {
    success: boolean;
    host?: string;
    count?: number;
    interval?: number;
    responses?: PingResponse[];
    statistics?: PingStatistics;
    raw_output?: string;
    execution_time: number;
    error?: string;
}

export interface TracerouteHop {
    hop: number;
    data: string;
    raw: string;
}

export interface TracerouteResult {
    success: boolean;
    host?: string;
    max_hops?: number;
    hops?: TracerouteHop[];
    raw_output?: string;
    execution_time: number;
    error?: string;
}

export interface DnsResult {
    success: boolean;
    domain?: string;
    records?: Record<string, unknown[]>;
    execution_time: number;
    error?: string;
}

export interface GeolocationResult {
    success: boolean;
    ip?: string;
    country?: string;
    city?: string;
    isp?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    data?: Record<string, unknown>;
    execution_time: number;
    error?: string;
}

export interface PortScanResult {
    success: boolean;
    host?: string;
    port_range?: string;
    results?: Array<{ port: number; status: string }>;
    execution_time: number;
    error?: string;
}

export interface SubnetResult {
    success: boolean;
    ip?: string;
    cidr?: number;
    subnet_mask?: string;
    network_address?: string;
    broadcast_address?: string;
    first_host?: string;
    last_host?: string;
    total_hosts?: number;
    usable_hosts?: number;
    execution_time: number;
    error?: string;
}

export interface MacLookupResult {
    success: boolean;
    mac?: string;
    oui?: string;
    vendor?: string;
    execution_time: number;
    error?: string;
}

export interface ReverseDnsResult {
    success: boolean;
    ip?: string;
    hostname?: string;
    execution_time: number;
    error?: string;
}

export interface SslResult {
    success: boolean;
    domain?: string;
    issuer?: string;
    subject?: string;
    valid_from?: string;
    valid_to?: string;
    days_until_expiry?: number;
    is_valid?: boolean;
    certificate_data?: Record<string, unknown>;
    execution_time: number;
    error?: string;
}

export interface WhoisResult {
    success: boolean;
    domain?: string;
    data?: Record<string, unknown>;
    raw_output?: string;
    execution_time: number;
    error?: string;
}

export type NetworkingResult = 
    | PingResult 
    | TracerouteResult 
    | DnsResult 
    | GeolocationResult 
    | PortScanResult 
    | SubnetResult 
    | MacLookupResult 
    | ReverseDnsResult 
    | SslResult 
    | WhoisResult;