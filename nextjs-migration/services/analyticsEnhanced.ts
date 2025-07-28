export class AnalyticsEnhanced {
    private readonly events: Array<{ event: string; data: any; timestamp: number }> = [];
    private readonly sessionId: string = crypto.randomUUID();
    private readonly userId: string;
    private flushTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.userId = this.generateUserId();
        this.initializeSession();
        this.setupAutoFlush();
    }

    private generateUserId(): string {
        if (typeof window === 'undefined') return 'server-user';

        let userId = localStorage.getItem('timevault_user_id');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('timevault_user_id', userId);
        }
        return userId;
    }

    private initializeSession() {
        if (typeof window === 'undefined') return;

        this.trackEvent('session_start', {
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform
        });
    }

    private setupAutoFlush() {
        // Flush events every 30 seconds
        this.flushTimer = setInterval(() => {
            if (this.events.length > 0) {
                this.flushEvents();
            }
        }, 30000);

        // Flush on page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.flushEvents();
            });
        }
    }

    trackEvent(event: string, data: any = {}) {
        const eventData = {
            event,
            data: {
                ...data,
                session_id: this.sessionId,
                user_id: this.userId,
                timestamp: Date.now(),
                page_url: typeof window !== 'undefined' ? window.location.href : 'server'
            },
            timestamp: Date.now()
        };

        this.events.push(eventData);

        // Send to Google Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event, {
                event_category: data.category || 'user_interaction',
                event_label: data.label || '',
                value: data.value || 0,
                custom_parameters: data
            });
        }

        // Batch send to backend every 10 events
        if (this.events.length >= 10) {
            this.flushEvents();
        }
    }

    private async flushEvents() {
        if (this.events.length === 0) return;

        const eventsToSend = [...this.events];
        this.events.length = 0;

        try {
            // Only attempt to send if we're in browser environment
            if (typeof window !== 'undefined') {
                await fetch('/api/analytics/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eventsToSend)
                });
            }
        } catch (error) {
            console.warn('Failed to send analytics events:', error);
            // Re-add failed events back to queue (up to a limit)
            if (this.events.length < 50) {
                this.events.unshift(...eventsToSend);
            }
        }
    }

    // Customer Experience specific tracking
    trackUserJourney(step: string, metadata: any = {}) {
        this.trackEvent('user_journey', {
            category: 'ux',
            step,
            ...metadata
        });
    }

    trackPerformance(metric: string, value: number, context: any = {}) {
        this.trackEvent('performance_metric', {
            category: 'performance',
            metric,
            value,
            ...context
        });
    }

    trackError(error: Error, context: any = {}) {
        this.trackEvent('error', {
            category: 'error',
            message: error.message,
            stack: error.stack,
            ...context
        });
    }

    // Customer satisfaction tracking
    trackSatisfaction(rating: number, feedback: string = '', context: any = {}) {
        this.trackEvent('satisfaction_rating', {
            category: 'cx',
            rating,
            feedback,
            ...context
        });
    }

    // Enhanced user behavior tracking
    trackConversion(type: string, value: number = 0, metadata: any = {}) {
        this.trackEvent('conversion', {
            category: 'conversion',
            conversion_type: type,
            value,
            ...metadata
        });
    }

    trackEngagement(action: string, duration: number = 0, metadata: any = {}) {
        this.trackEvent('engagement', {
            category: 'engagement',
            action,
            duration,
            ...metadata
        });
    }

    // Utility methods
    isTrackingEnabled(): boolean {
        return typeof window !== 'undefined' && !navigator.doNotTrack;
    }

    getUserBehaviorPattern() {
        // This would analyze user behavior patterns
        // For now, return mock data
        return {
            likelyToUseQuiz: Math.random() > 0.5,
            likelyToUpgrade: Math.random() > 0.7,
            engagementLevel: 'high',
            preferredFeatures: ['calculator', 'quiz']
        };
    }

    getSessionData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            eventsQueued: this.events.length
        };
    }

    // Cleanup method
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flushEvents();
    }
}

export const analytics = new AnalyticsEnhanced();
