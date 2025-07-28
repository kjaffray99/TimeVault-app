// 🔒 TIMEVAULT SECURITY UTILITIES - REVENUE PROTECTION
import DOMPurify from 'dompurify';

/**
 * Comprehensive security utilities for TimeVault
 * Prevents XSS, validates inputs, implements rate limiting
 */

// Input sanitization to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') {
        return '';
    }
    return DOMPurify.sanitize(input.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
};

// Crypto amount validation - critical for calculator
export const validateCryptoAmount = (amount: string): boolean => {
    const sanitized = sanitizeInput(amount);
    const numAmount = parseFloat(sanitized);

    // Validate: positive number, reasonable limits, no NaN
    return !isNaN(numAmount) &&
        numAmount > 0 &&
        numAmount <= 1000000 && // Max 1M units
        isFinite(numAmount);
};

// Email validation for lead capture
export const validateEmail = (email: string): boolean => {
    const sanitized = sanitizeInput(email);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(sanitized) &&
        sanitized.length >= 5 &&
        sanitized.length <= 254;
};

// Wage rate validation for time calculations
export const validateWageRate = (wage: string): boolean => {
    const sanitized = sanitizeInput(wage);
    const numWage = parseFloat(sanitized);

    return !isNaN(numWage) &&
        numWage >= 0.01 && // Minimum $0.01/hour
        numWage <= 10000 && // Maximum $10,000/hour
        isFinite(numWage);
};

// Rate limiting to prevent abuse and protect revenue
export class RateLimiter {
    private calls: Map<string, number[]> = new Map();

    canMakeRequest(
        identifier: string,
        maxCalls: number = 10,
        timeWindow: number = 60000 // 1 minute default
    ): boolean {
        const now = Date.now();
        const userCalls = this.calls.get(identifier) || [];

        // Remove old calls outside time window
        const recentCalls = userCalls.filter(time => now - time < timeWindow);

        if (recentCalls.length >= maxCalls) {
            // Log potential abuse for monitoring
            console.warn(`Rate limit exceeded for ${identifier}: ${recentCalls.length}/${maxCalls}`);

            // Track rate limiting for analytics
            if (typeof gtag !== 'undefined') {
                (window as any).gtag?.('event', 'rate_limit_exceeded', {
                    'event_category': 'security',
                    'event_label': identifier,
                    'value': recentCalls.length
                });
            }

            return false;
        }

        recentCalls.push(now);
        this.calls.set(identifier, recentCalls);
        return true;
    }

    // Clear rate limiting data (for testing or user upgrades)
    clearLimits(identifier?: string): void {
        if (identifier) {
            this.calls.delete(identifier);
        } else {
            this.calls.clear();
        }
    }
}

// Content Security Policy helpers
export const getCSPHeader = (): string => {
    return [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.coingecko.com https://api.metals.live https://api.stripe.com",
        "frame-src 'self' https://js.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');
};

// Secure local storage wrapper
export class SecureStorage {
    private prefix = 'tv_secure_';

    setItem(key: string, value: any): void {
        try {
            const sanitizedKey = sanitizeInput(key);
            const serialized = JSON.stringify({
                data: value,
                timestamp: Date.now(),
                checksum: this.generateChecksum(value)
            });

            localStorage.setItem(this.prefix + sanitizedKey, serialized);
        } catch (error) {
            console.error('Secure storage failed:', error);
        }
    }

    getItem(key: string): any {
        try {
            const sanitizedKey = sanitizeInput(key);
            const stored = localStorage.getItem(this.prefix + sanitizedKey);

            if (!stored) {
                return null;
            }

            const parsed = JSON.parse(stored);

            // Verify data integrity
            if (this.generateChecksum(parsed.data) !== parsed.checksum) {
                console.warn('Data integrity check failed for:', key);
                this.removeItem(key);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.error('Secure storage retrieval failed:', error);
            return null;
        }
    }

    removeItem(key: string): void {
        const sanitizedKey = sanitizeInput(key);
        localStorage.removeItem(this.prefix + sanitizedKey);
    }

    private generateChecksum(data: any): string {
        // Simple checksum for data integrity
        return btoa(JSON.stringify(data)).slice(0, 16);
    }
}

// User session management
export class SessionManager {
    private sessionTimeout = 30 * 60 * 1000; // 30 minutes
    private storage = new SecureStorage();

    createSession(userId: string): string {
        const sessionId = this.generateSessionId();
        const sessionData = {
            userId,
            created: Date.now(),
            lastActivity: Date.now(),
            isPremium: false
        };

        this.storage.setItem(`session_${sessionId}`, sessionData);
        return sessionId;
    }

    validateSession(sessionId: string): boolean {
        const session = this.storage.getItem(`session_${sessionId}`);

        if (!session) {
            return false;
        }

        const now = Date.now();
        if (now - session.lastActivity > this.sessionTimeout) {
            this.storage.removeItem(`session_${sessionId}`);
            return false;
        }

        // Update last activity
        session.lastActivity = now;
        this.storage.setItem(`session_${sessionId}`, session);

        return true;
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    }
}

// Export singleton instances
export const rateLimiter = new RateLimiter();
export const secureStorage = new SecureStorage();
export const sessionManager = new SessionManager();

// Security event logging
export const logSecurityEvent = (event: string, details: any = {}) => {
    console.log(`🔒 Security Event: ${event}`, details);

    // Track security events for monitoring
    if (typeof gtag !== 'undefined') {
        (window as any).gtag?.('event', 'security_event', {
            'event_category': 'security',
            'event_label': event,
            'custom_parameter_details': JSON.stringify(details)
        });
    }
};
