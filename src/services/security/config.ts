/**
 * TimeVault Security Configuration
 * Enterprise-grade security settings for API services
 */

export interface SecurityConfig {
    rateLimit: {
        windowMs: number;
        maxRequests: number;
        skipSuccessfulRequests: boolean;
    };
    audit: {
        enableLogging: boolean;
        maxLogEntries: number;
        sensitiveDataMasking: boolean;
    };
    validation: {
        strictTypeChecking: boolean;
        sanitizeInputs: boolean;
        validateOrigins: boolean;
    };
    performance: {
        enableCaching: boolean;
        cacheTimeout: number;
        compressionEnabled: boolean;
    };
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
    rateLimit: {
        windowMs: 60000, // 1 minute
        maxRequests: 100, // 100 requests per minute
        skipSuccessfulRequests: false
    },
    audit: {
        enableLogging: true,
        maxLogEntries: 1000,
        sensitiveDataMasking: true
    },
    validation: {
        strictTypeChecking: true,
        sanitizeInputs: true,
        validateOrigins: process.env.NODE_ENV === 'production'
    },
    performance: {
        enableCaching: true,
        cacheTimeout: 300000, // 5 minutes
        compressionEnabled: true
    }
};

export const PRODUCTION_SECURITY_CONFIG: SecurityConfig = {
    ...DEFAULT_SECURITY_CONFIG,
    rateLimit: {
        windowMs: 60000,
        maxRequests: 50, // More restrictive in production
        skipSuccessfulRequests: false
    },
    audit: {
        enableLogging: true,
        maxLogEntries: 5000, // More comprehensive logging
        sensitiveDataMasking: true
    },
    validation: {
        strictTypeChecking: true,
        sanitizeInputs: true,
        validateOrigins: true // Always validate in production
    }
};

// Security headers for API responses
export const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
};

// Input sanitization patterns
export const SANITIZATION_PATTERNS = {
    // Remove potentially dangerous characters
    maliciousChars: /[<>\"'%;()&+]/g,
    // Validate numeric inputs
    numericOnly: /^\d+(\.\d+)?$/,
    // Validate alphanumeric with common symbols
    alphanumericSafe: /^[a-zA-Z0-9\s\-_.]+$/,
    // Validate crypto addresses (basic pattern)
    cryptoAddress: /^[a-zA-Z0-9]{25,64}$/
};

// Error messages (avoid exposing system internals)
export const SECURITY_ERROR_MESSAGES = {
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
    INVALID_INPUT: 'Invalid input provided.',
    UNAUTHORIZED_ACCESS: 'Access denied.',
    VALIDATION_FAILED: 'Request validation failed.',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
    DEPRECATED_ENDPOINT: 'This endpoint is deprecated. Please upgrade to the latest API version.'
};

// Security event types for audit logging
export const SecurityEventType = {
    API_ACCESS: 'API_ACCESS',
    API_SUCCESS: 'API_SUCCESS',
    API_ERROR: 'API_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    LEGACY_CLIENT_ACCESS: 'LEGACY_CLIENT_ACCESS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
    SECURITY_BREACH_ATTEMPT: 'SECURITY_BREACH_ATTEMPT'
} as const;

export type SecurityEventType = typeof SecurityEventType[keyof typeof SecurityEventType];

// Security flags for categorizing events
export const SecurityFlag = {
    DEPRECATED: 'DEPRECATED',
    POTENTIAL_ABUSE: 'POTENTIAL_ABUSE',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
    COMPLIANCE: 'COMPLIANCE'
} as const;

export type SecurityFlag = typeof SecurityFlag[keyof typeof SecurityFlag];

export const getSecurityConfig = (): SecurityConfig => {
    return process.env.NODE_ENV === 'production'
        ? PRODUCTION_SECURITY_CONFIG
        : DEFAULT_SECURITY_CONFIG;
};
