/**
 * ENHANCED INPUT VALIDATION & SECURITY MIDDLEWARE
 * Production-grade request validation and sanitization
 */

import { NextRequest, NextResponse } from 'next/server';

export interface ValidationRule {
    field: string;
    type: 'string' | 'number' | 'email' | 'url' | 'boolean' | 'array';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    sanitize?: boolean;
}

export interface SecurityConfig {
    rateLimit?: {
        windowMs: number;
        max: number;
        message?: string;
    };
    validation?: ValidationRule[];
    sanitization?: boolean;
    logging?: boolean;
}

class SecurityMiddleware {
    private static instance: SecurityMiddleware;
    private rateLimiters: Map<string, any> = new Map();

    static getInstance(): SecurityMiddleware {
        if (!SecurityMiddleware.instance) {
            SecurityMiddleware.instance = new SecurityMiddleware();
        }
        return SecurityMiddleware.instance;
    }

    // Enhanced request validation
    async validateRequest(
        request: NextRequest,
        config: SecurityConfig
    ): Promise<{ valid: boolean; errors: string[]; sanitizedData?: any }> {
        const errors: string[] = [];
        let sanitizedData: any = {};

        try {
            // 1. Rate limiting check
            if (config.rateLimit) {
                const rateLimitResult = await this.checkRateLimit(request, config.rateLimit);
                if (!rateLimitResult.allowed) {
                    errors.push(rateLimitResult.message);
                    return { valid: false, errors };
                }
            }

            // 2. Parse request body safely
            let requestData: any = {};
            try {
                if (request.method !== 'GET') {
                    const contentType = request.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                        requestData = await request.json();
                    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
                        const formData = await request.formData();
                        requestData = Object.fromEntries(formData.entries());
                    }
                }
            } catch (parseError) {
                errors.push('Invalid request format');
                return { valid: false, errors };
            }

            // 3. Validate fields according to rules
            if (config.validation) {
                const validationResult = this.validateFields(requestData, config.validation);
                errors.push(...validationResult.errors);
                sanitizedData = validationResult.sanitizedData;
            }

            // 4. Additional security checks
            const securityCheck = this.performSecurityChecks(request, requestData);
            errors.push(...securityCheck.errors);

            // 5. Log security events
            if (config.logging && errors.length > 0) {
                this.logSecurityEvent(request, errors);
            }

            return {
                valid: errors.length === 0,
                errors,
                sanitizedData: errors.length === 0 ? sanitizedData : undefined
            };

        } catch (error) {
            errors.push(`Validation error: ${error}`);
            return { valid: false, errors };
        }
    }

    private async checkRateLimit(
        request: NextRequest,
        config: { windowMs: number; max: number; message?: string }
    ): Promise<{ allowed: boolean; message: string }> {
        const ip = this.getClientIP(request);
        const key = `${request.url}_${ip}`;

        if (!this.rateLimiters.has(key)) {
            this.rateLimiters.set(key, {
                requests: [],
                windowMs: config.windowMs
            });
        }

        const limiter = this.rateLimiters.get(key);
        const now = Date.now();

        // Clean old requests outside the window
        limiter.requests = limiter.requests.filter(
            (timestamp: number) => now - timestamp < config.windowMs
        );

        if (limiter.requests.length >= config.max) {
            return {
                allowed: false,
                message: config.message || 'Too many requests'
            };
        }

        limiter.requests.push(now);
        return { allowed: true, message: 'OK' };
    }

    private validateFields(
        data: any,
        rules: ValidationRule[]
    ): { errors: string[]; sanitizedData: any } {
        const errors: string[] = [];
        const sanitizedData: any = {};

        for (const rule of rules) {
            const value = data[rule.field];

            // Check required fields
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${rule.field} is required`);
                continue;
            }

            // Skip validation for optional empty fields
            if (!rule.required && (value === undefined || value === null || value === '')) {
                continue;
            }

            // Type validation and sanitization
            let sanitizedValue = value;

            switch (rule.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        errors.push(`${rule.field} must be a string`);
                        break;
                    }

                    if (rule.sanitize) {
                        sanitizedValue = this.sanitizeString(value);
                    }

                    if (rule.min && value.length < rule.min) {
                        errors.push(`${rule.field} must be at least ${rule.min} characters`);
                    }

                    if (rule.max && value.length > rule.max) {
                        errors.push(`${rule.field} must be at most ${rule.max} characters`);
                    }

                    if (rule.pattern && !rule.pattern.test(value)) {
                        errors.push(`${rule.field} format is invalid`);
                    }
                    break;

                case 'number':
                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                    if (isNaN(numValue)) {
                        errors.push(`${rule.field} must be a number`);
                        break;
                    }

                    sanitizedValue = numValue;

                    if (rule.min && numValue < rule.min) {
                        errors.push(`${rule.field} must be at least ${rule.min}`);
                    }

                    if (rule.max && numValue > rule.max) {
                        errors.push(`${rule.field} must be at most ${rule.max}`);
                    }
                    break;

                case 'email':
                    if (typeof value !== 'string' || !this.isValidEmail(value)) {
                        errors.push(`${rule.field} must be a valid email`);
                        break;
                    }
                    sanitizedValue = value.toLowerCase().trim();
                    break;

                case 'url':
                    if (typeof value !== 'string' || !this.isValidURL(value)) {
                        errors.push(`${rule.field} must be a valid URL`);
                    }
                    break;

                case 'boolean':
                    if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
                        errors.push(`${rule.field} must be a boolean`);
                        break;
                    }
                    sanitizedValue = typeof value === 'boolean' ? value : value === 'true';
                    break;

                case 'array':
                    if (!Array.isArray(value)) {
                        errors.push(`${rule.field} must be an array`);
                        break;
                    }

                    if (rule.min && value.length < rule.min) {
                        errors.push(`${rule.field} must have at least ${rule.min} items`);
                    }

                    if (rule.max && value.length > rule.max) {
                        errors.push(`${rule.field} must have at most ${rule.max} items`);
                    }
                    break;
            }

            if (errors.length === 0 || !errors.some(e => e.includes(rule.field))) {
                sanitizedData[rule.field] = sanitizedValue;
            }
        }

        return { errors, sanitizedData };
    }

    private performSecurityChecks(
        request: NextRequest,
        data: any
    ): { errors: string[] } {
        const errors: string[] = [];

        // 1. Check for potential XSS
        if (this.containsXSS(JSON.stringify(data))) {
            errors.push('Potential XSS detected in request');
        }

        // 2. Check for SQL injection patterns
        if (this.containsSQLInjection(JSON.stringify(data))) {
            errors.push('Potential SQL injection detected');
        }

        // 3. Check for suspicious headers
        const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip'];
        for (const header of suspiciousHeaders) {
            const value = request.headers.get(header);
            if (value && this.isSuspiciousIP(value)) {
                errors.push(`Suspicious request from ${value}`);
            }
        }

        // 4. Check request size
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
            errors.push('Request size too large');
        }

        return { errors };
    }

    private getClientIP(request: NextRequest): string {
        return request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            request.ip ||
            'unknown';
    }

    private sanitizeString(input: string): string {
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    private containsXSS(input: string): boolean {
        const xssPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+=/i,
            /<iframe/i,
            /eval\(/i,
            /document\./i
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    private containsSQLInjection(input: string): boolean {
        const sqlPatterns = [
            /union\s+select/i,
            /drop\s+table/i,
            /delete\s+from/i,
            /insert\s+into/i,
            /update\s+set/i,
            /exec\s*\(/i,
            /sp_/i
        ];

        return sqlPatterns.some(pattern => pattern.test(input));
    }

    private isSuspiciousIP(ip: string): boolean {
        // Check for known malicious IP patterns
        const suspiciousPatterns = [
            /^127\./, // Localhost attempts
            /^10\./, // Private network
            /^192\.168\./, // Private network
            /^0\.0\.0\.0$/ // Invalid IP
        ];

        return suspiciousPatterns.some(pattern => pattern.test(ip));
    }

    private logSecurityEvent(request: NextRequest, errors: string[]): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ip: this.getClientIP(request),
            url: request.url,
            method: request.method,
            userAgent: request.headers.get('user-agent'),
            errors: errors,
            severity: 'WARNING'
        };

        console.warn('🚨 SECURITY EVENT:', JSON.stringify(logEntry, null, 2));

        // In production, you would send this to a security monitoring service
        // Example: await this.sendToSecurityService(logEntry);
    }

    // Helper method to create security middleware
    static createMiddleware(config: SecurityConfig) {
        const security = SecurityMiddleware.getInstance();

        return async (request: NextRequest) => {
            const validation = await security.validateRequest(request, config);

            if (!validation.valid) {
                return NextResponse.json(
                    {
                        error: 'Validation failed',
                        details: validation.errors
                    },
                    { status: 400 }
                );
            }

            // Add sanitized data to request headers for use in the API handler
            const response = NextResponse.next();
            if (validation.sanitizedData) {
                response.headers.set('x-sanitized-data', JSON.stringify(validation.sanitizedData));
            }

            return response;
        };
    }
}

// Pre-configured security rules for common endpoints
export const securityConfigs = {
    payment: {
        rateLimit: { windowMs: 60000, max: 5, message: 'Too many payment attempts' },
        validation: [
            { field: 'amount', type: 'number' as const, required: true, min: 0.01, max: 10000 },
            { field: 'currency', type: 'string' as const, required: true, pattern: /^[A-Z]{3}$/ },
            { field: 'email', type: 'email' as const, required: true, sanitize: true },
            { field: 'metadata', type: 'string' as const, max: 1000, sanitize: true }
        ],
        sanitization: true,
        logging: true
    },

    affiliate: {
        rateLimit: { windowMs: 60000, max: 10, message: 'Too many affiliate requests' },
        validation: [
            { field: 'referralCode', type: 'string' as const, required: true, min: 6, max: 20, pattern: /^[A-Z0-9]+$/ },
            { field: 'email', type: 'email' as const, required: true, sanitize: true },
            { field: 'amount', type: 'number' as const, required: true, min: 0, max: 1000000 }
        ],
        sanitization: true,
        logging: true
    },

    calculator: {
        rateLimit: { windowMs: 10000, max: 50, message: 'Too many calculations' },
        validation: [
            { field: 'amount', type: 'number' as const, required: true, min: 0.001, max: 1000000 },
            { field: 'fromCurrency', type: 'string' as const, required: true, pattern: /^[A-Z]{3,4}$/ },
            { field: 'toCurrency', type: 'string' as const, required: true, pattern: /^[A-Z]{2,4}$/ }
        ],
        sanitization: true,
        logging: false
    },

    contact: {
        rateLimit: { windowMs: 300000, max: 3, message: 'Too many contact form submissions' },
        validation: [
            { field: 'name', type: 'string' as const, required: true, min: 2, max: 50, sanitize: true },
            { field: 'email', type: 'email' as const, required: true, sanitize: true },
            { field: 'message', type: 'string' as const, required: true, min: 10, max: 1000, sanitize: true },
            { field: 'subject', type: 'string' as const, max: 100, sanitize: true }
        ],
        sanitization: true,
        logging: true
    }
};

export default SecurityMiddleware;
export { SecurityMiddleware };
