// Analytics service for Next.js with client-side safety
export class AnalyticsService {
    private events: Array<{ name: string; properties: any; timestamp: number }> = [];
    private isInitialized = false;

    initialize(): void {
        if (typeof window === 'undefined' || this.isInitialized) return;

        this.isInitialized = true;
        console.log('📊 TimeVault Analytics initialized');
    }

    trackEvent(name: string, properties: Record<string, any> = {}): void {
        if (typeof window === 'undefined') return;

        const event = {
            name,
            properties: {
                ...properties,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: Date.now(),
                sessionId: this.getSessionId()
            },
            timestamp: Date.now()
        };

        this.events.push(event);

        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events.shift();
        }

        // Console logging for development
        console.log('📊 Analytics Event:', name, properties);
    }

    trackConversion(type: string, value: number, properties: Record<string, any> = {}): void {
        this.trackEvent('conversion', {
            type,
            value,
            ...properties
        });
    }

    trackUserEngagement(action: string, duration?: number): void {
        this.trackEvent('user_engagement', {
            action,
            duration,
            category: 'engagement'
        });
    }

    trackPerformance(metric: string, value: number): void {
        this.trackEvent('performance_metric', {
            metric,
            value,
            category: 'performance'
        });
    }

    private getSessionId(): string {
        if (typeof window === 'undefined') return 'server';

        let sessionId = sessionStorage.getItem('timevault_session_id');
        if (!sessionId) {
            sessionId = 'tv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('timevault_session_id', sessionId);
        }
        return sessionId;
    }

    getEvents(): Array<{ name: string; properties: any; timestamp: number }> {
        return [...this.events];
    }

    generateReport(): string {
        const eventCounts = this.events.reduce((acc, event) => {
            acc[event.name] = (acc[event.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const report = ['📊 Analytics Report', ''];
        Object.entries(eventCounts).forEach(([name, count]) => {
            report.push(`${name}: ${count} events`);
        });

        return report.join('\\n');
    }
}

export const analytics = new AnalyticsService();
