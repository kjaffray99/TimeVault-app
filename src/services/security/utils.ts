/**
 * TimeVault Security Utilities
 * Enterprise-grade security functions for API protection
 */

import { SANITIZATION_PATTERNS, SECURITY_ERROR_MESSAGES, getSecurityConfig } from './config';

export class SecurityUtils {
    /**
     * Sanitize input strings to prevent injection attacks
     */
    static sanitizeInput(input: string): string {
        if (typeof input !== 'string') {
            throw new Error(SECURITY_ERROR_MESSAGES.INVALID_INPUT);
        }

        const config = getSecurityConfig();
        if (!config.validation.sanitizeInputs) {
            return input;
        }

        // Remove malicious characters
        let sanitized = input.replace(SANITIZATION_PATTERNS.maliciousChars, '');

        // Limit length to prevent buffer overflow attempts
        sanitized = sanitized.substring(0, 1000);

        return sanitized.trim();
    }

    /**
     * Validate numeric inputs
     */
    static validateNumeric(value: string | number): boolean {
        const stringValue = String(value);
        return SANITIZATION_PATTERNS.numericOnly.test(stringValue);
    }

    /**
     * Validate cryptocurrency addresses
     */
    static validateCryptoAddress(address: string): boolean {
        if (!address || typeof address !== 'string') {
            return false;
        }
        return SANITIZATION_PATTERNS.cryptoAddress.test(address);
    }

    /**
     * Generate secure request ID for audit tracking
     */
    static generateRequestId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `tv_${timestamp}_${random}`;
    }

    /**
     * Mask sensitive data for logging
     */
    static maskSensitiveData(data: any): any {
        const config = getSecurityConfig();
        if (!config.audit.sensitiveDataMasking) {
            return data;
        }

        if (typeof data === 'string') {
            // Mask potential API keys, tokens, or addresses
            if (data.length > 10) {
                return data.substring(0, 4) + '***' + data.substring(data.length - 4);
            }
            return '***';
        }

        if (typeof data === 'object' && data !== null) {
            const masked = { ...data };
            const sensitiveKeys = ['key', 'token', 'secret', 'password', 'address', 'privateKey'];

            for (const key of Object.keys(masked)) {
                if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                    masked[key] = this.maskSensitiveData(masked[key]);
                }
            }

            return masked;
        }

        return data;
    }

    /**
     * Validate request origin for CORS protection
     */
    static validateOrigin(origin: string): boolean {
        const config = getSecurityConfig();
        if (!config.validation.validateOrigins) {
            return true;
        }

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://timevaultai.com',
            'https://www.timevaultai.com',
            'https://timevault.com',
            'https://www.timevault.com'
        ];

        // Allow same-origin requests
        if (!origin) {
            return true;
        }

        return allowedOrigins.includes(origin);
    }

    /**
     * Create security headers for responses
     */
    static getSecurityHeaders(): Record<string, string> {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'X-Request-ID': this.generateRequestId()
        };
    }

    /**
     * Validate API request parameters
     */
    static validateApiRequest(params: Record<string, any>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        const config = getSecurityConfig();

        if (!config.validation.strictTypeChecking) {
            return { isValid: true, errors: [] };
        }

        // Validate common parameters
        for (const [key, value] of Object.entries(params)) {
            // Check for null/undefined required fields
            if (value === null || value === undefined) {
                errors.push(`Parameter '${key}' is required`);
                continue;
            }

            // Validate string parameters
            if (typeof value === 'string') {
                if (value.length > 1000) {
                    errors.push(`Parameter '${key}' exceeds maximum length`);
                }

                // Check for malicious patterns
                if (SANITIZATION_PATTERNS.maliciousChars.test(value)) {
                    errors.push(`Parameter '${key}' contains invalid characters`);
                }
            }

            // Validate numeric parameters
            if (typeof value === 'number') {
                if (!Number.isFinite(value)) {
                    errors.push(`Parameter '${key}' must be a valid number`);
                }

                if (value < 0 && !['offset', 'change'].includes(key)) {
                    errors.push(`Parameter '${key}' must be non-negative`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calculate request fingerprint for abuse detection
     */
    static calculateRequestFingerprint(
        clientId: string,
        endpoint: string,
        userAgent?: string,
        ip?: string
    ): string {
        const components = [
            clientId,
            endpoint,
            userAgent?.substring(0, 50) || 'unknown',
            ip || 'unknown'
        ];

        return btoa(components.join('|')).substring(0, 16);
    }

    /**
     * Check for suspicious activity patterns
     */
    static detectSuspiciousActivity(
        fingerprint: string,
        activityLog: Array<{ timestamp: number; fingerprint: string }>
    ): boolean {
        const now = Date.now();
        const recentActivity = activityLog.filter(
            log => now - log.timestamp < 60000 && log.fingerprint === fingerprint
        );

        // Flag as suspicious if more than 50 requests per minute from same fingerprint
        return recentActivity.length > 50;
    }
}

/**
 * Security middleware for API requests
 */
export class SecurityMiddleware {
    static async validateRequest(
        request: {
            params?: Record<string, any>;
            headers?: Record<string, string>;
            origin?: string;
        }
    ): Promise<{ isValid: boolean; errors: string[]; securityFlags: string[] }> {
        const errors: string[] = [];
        const securityFlags: string[] = [];

        // Validate origin
        if (request.origin && !SecurityUtils.validateOrigin(request.origin)) {
            errors.push(SECURITY_ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
            securityFlags.push('INVALID_ORIGIN');
        }

        // Validate parameters
        if (request.params) {
            const validation = SecurityUtils.validateApiRequest(request.params);
            if (!validation.isValid) {
                errors.push(...validation.errors);
                securityFlags.push('INVALID_PARAMS');
            }
        }

        // Check for common attack patterns in headers
        if (request.headers) {
            const userAgent = request.headers['user-agent'] || '';
            if (userAgent.includes('<script>') || userAgent.includes('javascript:')) {
                errors.push(SECURITY_ERROR_MESSAGES.VALIDATION_FAILED);
                securityFlags.push('XSS_ATTEMPT');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            securityFlags
        };
    }
}

export default SecurityUtils;
