import DOMPurify from 'dompurify';
import * as validator from 'validator';

export class SecurityEnhanced {
    private static instance: SecurityEnhanced;
    private readonly CSP_NONCE = crypto.randomUUID();

    static getInstance(): SecurityEnhanced {
        if (!SecurityEnhanced.instance) {
            SecurityEnhanced.instance = new SecurityEnhanced();
        }
        return SecurityEnhanced.instance;
    }

    // Enhanced input sanitization with multiple validation layers
    sanitizeAndValidate(input: string, type: 'crypto_amount' | 'wage' | 'email' | 'text'): {
        isValid: boolean;
        sanitized: string;
        errors: string[];
    } {
        const errors: string[] = [];
        let sanitized = DOMPurify.sanitize(input.trim(), {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        // Type-specific validation
        switch (type) {
            case 'crypto_amount':
                if (!validator.isNumeric(sanitized) || parseFloat(sanitized) < 0 || parseFloat(sanitized) > 1000000) {
                    errors.push('Invalid crypto amount');
                }
                break;
            case 'wage':
                if (!validator.isNumeric(sanitized) || parseFloat(sanitized) < 0 || parseFloat(sanitized) > 10000) {
                    errors.push('Invalid wage amount');
                }
                break;
            case 'email':
                if (!validator.isEmail(sanitized)) {
                    errors.push('Invalid email format');
                }
                sanitized = validator.normalizeEmail(sanitized) || sanitized;
                break;
            case 'text':
                if (sanitized.length > 500) {
                    errors.push('Text too long');
                }
                break;
        }

        return {
            isValid: errors.length === 0,
            sanitized,
            errors
        };
    }

    // Rate limiting with exponential backoff
    private rateLimitMap = new Map<string, { count: number; lastRequest: number; blocked: boolean }>();

    checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
        const now = Date.now();
        const record = this.rateLimitMap.get(identifier);

        if (!record) {
            this.rateLimitMap.set(identifier, { count: 1, lastRequest: now, blocked: false });
            return true;
        }

        // Reset window if expired
        if (now - record.lastRequest > windowMs) {
            record.count = 1;
            record.lastRequest = now;
            record.blocked = false;
            return true;
        }

        record.count++;
        record.lastRequest = now;

        if (record.count > maxRequests) {
            record.blocked = true;
            // Log security event
            this.logSecurityEvent('rate_limit_exceeded', { identifier, count: record.count });
            return false;
        }

        return true;
    }

    // Security event logging
    logSecurityEvent(event: string, details: any) {
        console.warn(`[SECURITY] ${event}:`, details);

        // Send to monitoring service
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'security_event', {
                'event_category': 'security',
                'event_label': event,
                'custom_parameters': details
            });
        }
    }

    // Content Security Policy header generator
    generateCSPHeader(): string {
        return [
            "default-src 'self'",
            `script-src 'self' 'nonce-${this.CSP_NONCE}' https://www.googletagmanager.com`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.coingecko.com https://api.metals.live",
            "frame-ancestors 'none'",
            "base-uri 'self'"
        ].join('; ');
    }

    // Enhanced crypto data validation
    validateCryptoData(data: any): boolean {
        if (!data || typeof data !== 'object') return false;

        // Check required fields
        const requiredFields = ['id', 'current_price', 'market_cap'];
        for (const field of requiredFields) {
            if (!(field in data)) return false;
        }

        // Validate price ranges (prevent manipulation)
        if (data.current_price < 0 || data.current_price > 10000000) return false;

        return true;
    }

    // Input sanitization for specific TimeVault components
    sanitizeCryptoInput(amount: string): { isValid: boolean; value: number; error?: string } {
        const validation = this.sanitizeAndValidate(amount, 'crypto_amount');

        if (!validation.isValid) {
            return { isValid: false, value: 0, error: validation.errors[0] };
        }

        const numValue = parseFloat(validation.sanitized);

        // Additional business logic validation
        if (numValue > 1000) {
            return { isValid: false, value: 0, error: 'Amount too large for calculation' };
        }

        return { isValid: true, value: numValue };
    }

    sanitizeWageInput(wage: string): { isValid: boolean; value: number; error?: string } {
        const validation = this.sanitizeAndValidate(wage, 'wage');

        if (!validation.isValid) {
            return { isValid: false, value: 0, error: validation.errors[0] };
        }

        const numValue = parseFloat(validation.sanitized);

        // Reasonable wage validation
        if (numValue < 1) {
            return { isValid: false, value: 0, error: 'Wage must be at least $1' };
        }

        if (numValue > 1000) {
            return { isValid: false, value: 0, error: 'Wage too high for calculation' };
        }

        return { isValid: true, value: numValue };
    }
}

export const security = SecurityEnhanced.getInstance();
