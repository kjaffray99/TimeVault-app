/**
 * Request tracking and rate limiting for optimal customer experience
 * Prevents API overload while maintaining responsive service
 */
export class RequestTracker {
    private requests: Map<string, number[]> = new Map();
    private readonly maxRequestsPerMinute = 100; // Increased for better UX
    private readonly burstAllowance = 20; // Allow quick bursts for responsive UI

    /**
     * Check if request can be made, prioritizing user experience
     */
    canMakeRequest(endpoint: string, priority: 'high' | 'normal' | 'low' = 'normal'): boolean {
        const now = Date.now();
        const requests = this.requests.get(endpoint) || [];

        // Clean old requests (older than 1 minute)
        const recentRequests = requests.filter(time => now - time < 60000);

        // Priority-based rate limiting for better customer experience
        const effectiveLimit = this.getEffectiveLimit(priority, recentRequests.length);

        if (recentRequests.length >= effectiveLimit) {
            // Log for customer service insights
            console.warn(`Rate limit approached for ${endpoint} (${recentRequests.length}/${effectiveLimit})`);
            return false;
        }

        recentRequests.push(now);
        this.requests.set(endpoint, recentRequests);
        return true;
    }

    /**
     * Get effective rate limit based on priority and customer experience needs
     */
    private getEffectiveLimit(priority: 'high' | 'normal' | 'low', currentCount: number): number {
        switch (priority) {
            case 'high':
                // Critical user actions get higher limits
                return Math.min(this.maxRequestsPerMinute, this.burstAllowance + currentCount);
            case 'low':
                // Background operations get lower limits
                return Math.floor(this.maxRequestsPerMinute * 0.7);
            default:
                return this.maxRequestsPerMinute;
        }
    }

    /**
     * Get current usage stats for monitoring customer experience
     */
    getUsageStats(): { [endpoint: string]: { current: number; limit: number; utilizationPercent: number } } {
        const now = Date.now();
        const stats: any = {};

        for (const [endpoint, requests] of this.requests.entries()) {
            const recentRequests = requests.filter(time => now - time < 60000);
            const utilizationPercent = Math.round((recentRequests.length / this.maxRequestsPerMinute) * 100);

            stats[endpoint] = {
                current: recentRequests.length,
                limit: this.maxRequestsPerMinute,
                utilizationPercent
            };
        }

        return stats;
    }

    /**
     * Reset rate limits for specific endpoint (customer service tool)
     */
    resetEndpoint(endpoint: string): void {
        this.requests.delete(endpoint);
        console.info(`Rate limit reset for ${endpoint} - customer service action`);
    }
}
