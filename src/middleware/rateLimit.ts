/**
 * ENHANCED API SECURITY MIDDLEWARE
 * Rate limiting implementation for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
    windowMs: number;
    max: number;
    message?: string;
    keyGenerator?: (req: NextRequest) => string;
}

class RateLimiter {
    private static instances: Map<string, RateLimiter> = new Map();
    private requests: Map<string, number[]> = new Map();
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    static create(name: string, config: RateLimitConfig): RateLimiter {
        if (!RateLimiter.instances.has(name)) {
            RateLimiter.instances.set(name, new RateLimiter(config));
        }
        return RateLimiter.instances.get(name)!;
    }

    async checkLimit(request: NextRequest): Promise<{ allowed: boolean; message?: string }> {
        const key = this.config.keyGenerator ?
            this.config.keyGenerator(request) :
            this.getClientIP(request);

        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Get existing requests for this key
        const userRequests = this.requests.get(key) || [];

        // Filter out old requests outside the window
        const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);

        // Check if limit exceeded
        if (recentRequests.length >= this.config.max) {
            return {
                allowed: false,
                message: this.config.message || 'Too many requests'
            };
        }

        // Add current request
        recentRequests.push(now);
        this.requests.set(key, recentRequests);

        // Cleanup old entries periodically
        if (Math.random() < 0.01) { // 1% chance to cleanup
            this.cleanup();
        }

        return { allowed: true };
    }

    private getClientIP(request: NextRequest): string {
        return request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            request.ip ||
            'unknown';
    }

    private cleanup(): void {
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        for (const [key, requests] of this.requests.entries()) {
            const recentRequests = requests.filter(timestamp => timestamp > windowStart);
            if (recentRequests.length === 0) {
                this.requests.delete(key);
            } else {
                this.requests.set(key, recentRequests);
            }
        }
    }
}

// Pre-configured rate limiters
export const paymentRateLimit = RateLimiter.create('payments', {
    windowMs: 60000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many payment attempts, please try again later'
});

export const affiliateRateLimit = RateLimiter.create('affiliate', {
    windowMs: 60000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many affiliate requests, please try again later'
});

export const calculatorRateLimit = RateLimiter.create('calculator', {
    windowMs: 10000, // 10 seconds
    max: 50, // 50 requests per 10 seconds
    message: 'Too many calculations, please slow down'
});

// Helper function to apply rate limiting to API routes
export const withRateLimit = (limiter: RateLimiter) => {
    return async (request: NextRequest, handler: Function) => {
        const limitCheck = await limiter.checkLimit(request);

        if (!limitCheck.allowed) {
            return NextResponse.json(
                { error: limitCheck.message },
                { status: 429 }
            );
        }

        return handler(request);
    };
};

export default RateLimiter;
