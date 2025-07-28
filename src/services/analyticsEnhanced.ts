export class AnalyticsEnhanced {
    private readonly events: Array<{ event: string; data: any; timestamp: number }> = [];
    private readonly sessionId: string = crypto.randomUUID();
    public readonly userId: string;
    private isTrackingEnabled: boolean = true;

    constructor() {
        this.userId = this.generateUserId();
        this.initializeSession();
    }

    private generateUserId(): string {
        let userId = localStorage.getItem('timevault_user_id');
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem('timevault_user_id', userId);
        }
        return userId;
    }

    private initializeSession() {
        this.trackEvent('session_start', {
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
        });

        // Auto-flush events periodically
        setInterval(() => {
            this.flushEvents();
        }, 30000);

        // Flush events before page unload
        window.addEventListener('beforeunload', () => {
            this.flushEvents();
        });
    }

    trackEvent(event: string, data: any = {}) {
        if (!this.isTrackingEnabled) return;

        const eventData = {
            event,
            data: {
                ...data,
                session_id: this.sessionId,
                user_id: this.userId,
                timestamp: Date.now(),
                page_url: window.location.href,
                page_title: document.title
            },
            timestamp: Date.now()
        };

        this.events.push(eventData);

        // Send to Google Analytics
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
            // For now, store locally since we don't have a backend
            const existingEvents = JSON.parse(localStorage.getItem('timevault_analytics') || '[]');
            existingEvents.push(...eventsToSend);

            // Keep only last 500 events
            if (existingEvents.length > 500) {
                existingEvents.splice(0, existingEvents.length - 500);
            }

            localStorage.setItem('timevault_analytics', JSON.stringify(existingEvents));
        } catch (error) {
            console.warn('Failed to store analytics events:', error);
            // Re-add failed events back to queue
            this.events.unshift(...eventsToSend);
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
            stack: error.stack?.substring(0, 500), // Limit stack trace size
            ...context
        });
    }

    // Customer satisfaction tracking
    trackSatisfaction(rating: number, feedback: string = '', context: any = {}) {
        this.trackEvent('satisfaction_rating', {
            category: 'cx',
            rating,
            feedback: feedback.substring(0, 500), // Limit feedback length
            ...context
        });
    }

    // Conversion tracking
    trackConversion(type: string, value: number = 0, metadata: any = {}) {
        this.trackEvent('conversion', {
            category: 'monetization',
            conversion_type: type,
            value,
            ...metadata
        });
    }

    // Engagement tracking
    trackEngagement(action: string, duration: number = 0, metadata: any = {}) {
        this.trackEvent('engagement', {
            category: 'engagement',
            action,
            duration,
            ...metadata
        });
    }

    // A/B testing support
    trackExperiment(experimentName: string, variant: string, outcome?: string) {
        this.trackEvent('experiment', {
            category: 'experiments',
            experiment_name: experimentName,
            variant,
            outcome
        });
    }

    // Get user behavior patterns
    getUserBehaviorPattern(): UserBehaviorPattern {
        try {
            const events = JSON.parse(localStorage.getItem('timevault_analytics') || '[]');
            const userEvents = events.filter((e: any) => e.data.user_id === this.userId);

            const quizEvents = userEvents.filter((e: any) => e.event.includes('quiz')).length;
            const premiumEvents = userEvents.filter((e: any) => e.event.includes('premium')).length;

            return {
                likelyToUseQuiz: quizEvents > 5,
                likelyToUpgrade: premiumEvents > 3,
                engagementLevel: this.calculateEngagementLevel(userEvents),
                preferredFeatures: this.getPreferredFeatures(userEvents)
            };
        } catch {
            return {
                likelyToUseQuiz: false,
                likelyToUpgrade: false,
                engagementLevel: 'low',
                preferredFeatures: []
            };
        }
    }

    private calculateEngagementLevel(events: any[]): 'low' | 'medium' | 'high' {
        if (events.length > 50) return 'high';
        if (events.length > 20) return 'medium';
        return 'low';
    }

    private getPreferredFeatures(events: any[]): string[] {
        const featureCounts: Record<string, number> = {};

        events.forEach(event => {
            if (event.event.includes('calculator')) featureCounts.calculator = (featureCounts.calculator || 0) + 1;
            if (event.event.includes('quiz')) featureCounts.quiz = (featureCounts.quiz || 0) + 1;
            if (event.event.includes('share')) featureCounts.share = (featureCounts.share || 0) + 1;
        });

        return Object.entries(featureCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([feature]) => feature);
    }

    // Privacy controls
    enableTracking() {
        this.isTrackingEnabled = true;
        this.trackEvent('tracking_enabled');
    }

    disableTracking() {
        this.isTrackingEnabled = false;
        // Clear stored events
        localStorage.removeItem('timevault_analytics');
    }

    isTrackingEnabledStatus(): boolean {
        return this.isTrackingEnabled;
    }

    // Export analytics data for user
    exportUserData(): any {
        try {
            const events = JSON.parse(localStorage.getItem('timevault_analytics') || '[]');
            return {
                userId: this.userId,
                events: events.filter((e: any) => e.data.user_id === this.userId),
                exportedAt: new Date().toISOString()
            };
        } catch {
            return null;
        }
    }

    // Delete user data
    deleteUserData() {
        localStorage.removeItem('timevault_user_id');
        localStorage.removeItem('timevault_analytics');
        this.disableTracking();
    }
}

interface UserBehaviorPattern {
    likelyToUseQuiz: boolean;
    likelyToUpgrade: boolean;
    engagementLevel: 'low' | 'medium' | 'high';
    preferredFeatures: string[];
}

export const analytics = new AnalyticsEnhanced();
