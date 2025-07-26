/**
 * Rate Limit Manager - Modular & Technology-Agnostic
 * 
 * Flexible rate limiting with pluggable storage backends
 * Easy to update for Redis, database, or cloud-based rate limiting
 */

import { ApiConfig } from '../config/apiConfig';
import type { RateLimitConfig } from '../legacy/types';
import { SecurityAuditLogger } from './audit';

interface RateLimitStorage {
    get(key: string): Promise<{ count: number; resetTime: number } | null>;
    set(key: string, value: { count: number; resetTime: number }): Promise<void>;
    delete(key: string): Promise<void>;
    cleanup(): Promise<void>;
}

class MemoryRateLimitStorage implements RateLimitStorage {
    private storage = new Map<string, { count: number; resetTime: number }>();

    async get(key: string) {
        return this.storage.get(key) || null;
    }

    async set(key: string, value: { count: number; resetTime: number }) {
        this.storage.set(key, value);
    }

    async delete(key: string) {
        this.storage.delete(key);
    }

    async cleanup() {
        const now = Date.now();
        for (const [key, value] of this.storage.entries()) {
            if (now > value.resetTime) {
                this.storage.delete(key);
            }
        }
    }
}

// Future storage backends (easily pluggable):
// class RedisRateLimitStorage implements RateLimitStorage
// class DatabaseRateLimitStorage implements RateLimitStorage
// class CloudflareRateLimitStorage implements RateLimitStorage

export class RateLimitManager {
    private static storage: RateLimitStorage = new MemoryRateLimitStorage();
    private static config: RateLimitConfig;
    private static cleanupInterval: NodeJS.Timeout | null = null;

    /**
     * Initialize rate limiting with configuration
     */
    static initialize(config?: RateLimitConfig): void {
        this.config = config || ApiConfig.getSecurityConfig().rateLimit;

        // Start cleanup interval for memory storage
        if (!this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => {
                this.storage.cleanup().catch(console.error);
            }, 60000); // Cleanup every minute
        }
    }

    /**
     * Set custom storage backend (for technology updates)
     */
    static setStorage(storage: RateLimitStorage): void {
        this.storage = storage;
    }

    /**
     * Check if request is within rate limits
     */
    static async checkRateLimit(clientId: string): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
        retryAfter?: number;
    }> {
        if (!this.config) {
            this.initialize();
        }

        const key = this.generateKey(clientId);
        const now = Date.now();

        try {
            const existing = await this.storage.get(key);

            if (!existing || now > existing.resetTime) {
                // Create new rate limit window
                const newLimit = {
                    count: 1,
                    resetTime: now + this.config.windowMs
                };

                await this.storage.set(key, newLimit);

                return {
                    allowed: true,
                    remaining: this.config.maxRequests - 1,
                    resetTime: newLimit.resetTime
                };
            }

            if (existing.count >= this.config.maxRequests) {
                // Rate limit exceeded
                SecurityAuditLogger.logEvent(
                    'RATE_LIMIT_EXCEEDED',
                    clientId,
                    undefined,
                    ['POTENTIAL_ABUSE'],
                    {
                        requestCount: existing.count,
                        maxRequests: this.config.maxRequests,
                        windowMs: this.config.windowMs
                    }
                );

                return {
                    allowed: false,
                    remaining: 0,
                    resetTime: existing.resetTime,
                    retryAfter: Math.ceil((existing.resetTime - now) / 1000)
                };
            }

            // Increment counter
            existing.count++;
            await this.storage.set(key, existing);

            return {
                allowed: true,
                remaining: this.config.maxRequests - existing.count,
                resetTime: existing.resetTime
            };

        } catch (error) {
            // On storage error, allow request but log issue
            console.error('Rate limit storage error:', error);
            SecurityAuditLogger.logEvent(
                'API_ERROR',
                'RateLimitManager',
                clientId,
                ['ERROR'],
                { error: error instanceof Error ? error.message : 'Unknown error' }
            );

            return {
                allowed: true,
                remaining: this.config.maxRequests,
                resetTime: now + this.config.windowMs
            };
        }
    }

    /**
     * Get rate limit status without consuming quota
     */
    static async getRateLimitStatus(clientId: string): Promise<{
        count: number;
        remaining: number;
        resetTime: number;
    }> {
        const key = this.generateKey(clientId);
        const existing = await this.storage.get(key);

        if (!existing) {
            return {
                count: 0,
                remaining: this.config?.maxRequests || 100,
                resetTime: Date.now() + (this.config?.windowMs || 60000)
            };
        }

        return {
            count: existing.count,
            remaining: Math.max(0, (this.config?.maxRequests || 100) - existing.count),
            resetTime: existing.resetTime
        };
    }

    /**
     * Reset rate limit for a client (admin function)
     */
    static async resetRateLimit(clientId: string): Promise<void> {
        const key = this.generateKey(clientId);
        await this.storage.delete(key);

        SecurityAuditLogger.logEvent(
            'RATE_LIMIT_EXCEEDED', // Using existing type for simplicity
            'RateLimitManager',
            clientId,
            ['COMPLIANCE'],
            { action: 'manual_reset' }
        );
    }

    /**
     * Get rate limiting metrics for monitoring
     */
    static getMetrics(): {
        config: RateLimitConfig;
        storageType: string;
        cleanupActive: boolean;
    } {
        return {
            config: this.config || ApiConfig.getSecurityConfig().rateLimit,
            storageType: this.storage.constructor.name,
            cleanupActive: this.cleanupInterval !== null
        };
    }

    /**
     * Update rate limit configuration (for real-time adjustments)
     */
    static updateConfig(newConfig: Partial<RateLimitConfig>): void {
        this.config = { ...this.config, ...newConfig };

        SecurityAuditLogger.logEvent(
            'TECHNOLOGY_UPDATE',
            'RateLimitManager',
            'system',
            ['COMPLIANCE'],
            { configUpdate: newConfig }
        );
    }

    /**
     * Cleanup and shutdown
     */
    static shutdown(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    // Private utility methods
    private static generateKey(clientId: string): string {
        const keyGenerator = this.config?.keyGenerator;
        if (keyGenerator) {
            return keyGenerator(clientId);
        }
        return `rate_limit:${clientId}`;
    }
}

// Initialize on module load
RateLimitManager.initialize();
