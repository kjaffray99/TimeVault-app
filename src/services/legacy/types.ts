/**
 * Legacy API Types - Future-Proof Interfaces
 * 
 * Centralized type definitions for easy updates and technology evolution
 */

// Core security audit interface
export interface SecurityAudit {
    timestamp: number;
    action: string;
    source: string;
    clientInfo?: string;
    rateLimited?: boolean;
    securityFlags?: string[];
    requestId?: string;
    duration?: number;
    metadata?: Record<string, any>;
}

// Rate limiting configuration
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (clientId: string) => string;
}

// Legacy client configuration
export interface LegacyClientConfig {
    clientId?: string;
    timeout?: number;
    retries?: number;
    metadata?: Record<string, any>;
}

// Security metrics interface
export interface SecurityMetrics {
    totalAuditEvents: number;
    rateLimitEvents: number;
    securityFlags: number;
    lastHour: number;
    avgResponseTime?: number;
    errorRate?: number;
}

// Compliance reporting interface
export interface ComplianceReport {
    securityMetrics: SecurityMetrics;
    migrationStatus: {
        legacyClientsActive: boolean;
        securityEnhancementsActive: boolean;
        complianceLevel: string;
        lastAuditDate: string;
        recommendedActions: string[];
    };
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        factors: string[];
        mitigations: string[];
    };
}

// API operation result
export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata: {
        requestId: string;
        timestamp: number;
        duration: number;
        cached?: boolean;
    };
}

// Future-proof event types
export const SecurityEventTypes = {
    API_ACCESS: 'API_ACCESS',
    API_SUCCESS: 'API_SUCCESS',
    API_ERROR: 'API_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    LEGACY_CLIENT_ACCESS: 'LEGACY_CLIENT_ACCESS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
    SECURITY_BREACH_ATTEMPT: 'SECURITY_BREACH_ATTEMPT',
    MIGRATION_WARNING: 'MIGRATION_WARNING',
    TECHNOLOGY_UPDATE: 'TECHNOLOGY_UPDATE',
    CUSTOMER_SERVICE: 'CUSTOMER_SERVICE'
} as const;

export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];

// Security flags for categorization
export const SecurityFlags = {
    DEPRECATED: 'DEPRECATED',
    POTENTIAL_ABUSE: 'POTENTIAL_ABUSE',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
    COMPLIANCE: 'COMPLIANCE',
    TECHNOLOGY_DEBT: 'TECHNOLOGY_DEBT',
    MIGRATION_NEEDED: 'MIGRATION_NEEDED'
} as const;

export type SecurityFlag = typeof SecurityFlags[keyof typeof SecurityFlags];
