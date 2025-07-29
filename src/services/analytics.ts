/**
 * DAY 1: ANALYTICS FOUNDATION & A/B TESTING INFRASTRUCTURE
 * Comprehensive tracking and optimization framework
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for analytics and A/B testing
interface AnalyticsEvent {
    event: string;
    parameters: Record<string, any>;
    timestamp: Date;
    userId?: string;
    sessionId: string;
}

interface ABTestVariant {
    name: string;
    weight: number;
    config: Record<string, any>;
}

interface ABTest {
    testId: string;
    variants: ABTestVariant[];
    startDate: Date;
    endDate?: Date;
    active: boolean;
}

// Analytics Service Class
class AnalyticsService {
    private sessionId: string;
    private userId?: string;
    private events: AnalyticsEvent[] = [];

    constructor() {
        this.sessionId = this.generateSessionId();
        this.initializeGA4();
    }

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private initializeGA4() {
        // Initialize Google Analytics 4
        if (typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(arguments);
            }
            (window as any).gtag = gtag;

            gtag('js', new Date());
            gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
                custom_map: {
                    custom_parameter_1: 'calculator_usage',
                    custom_parameter_2: 'premium_conversion',
                    custom_parameter_3: 'tvlt_earned'
                }
            });
        }
    }

    // Track custom events
    trackEvent(event: string, parameters: Record<string, any> = {}) {
        const analyticsEvent: AnalyticsEvent = {
            event,
            parameters: {
                ...parameters,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                page_url: window.location.href
            },
            timestamp: new Date(),
            userId: this.userId,
            sessionId: this.sessionId
        };

        this.events.push(analyticsEvent);

        // Send to Google Analytics 4
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event, analyticsEvent.parameters);
        }

        // Send to custom analytics endpoint
        this.sendToCustomAnalytics(analyticsEvent);

        console.log('📊 Analytics Event:', analyticsEvent);
    }

    // Track calculator usage
    trackCalculatorUsage(data: {
        asset: string;
        amount: number;
        usdValue: number;
        metalType: string;
        metalAmount: number;
        timeValue: number;
    }) {
        this.trackEvent('calculator_used', {
            asset_type: data.asset,
            amount_calculated: data.amount,
            usd_value: data.usdValue,
            metal_type: data.metalType,
            metal_amount: data.metalAmount,
            time_value_hours: data.timeValue,
            value_tier: this.getValueTier(data.usdValue)
        });
    }

    // Track premium conversions
    trackPremiumConversion(data: {
        conversionType: 'stripe' | 'tvlt' | 'nft';
        amount?: number;
        fromFeature: string;
    }) {
        this.trackEvent('premium_conversion', {
            conversion_type: data.conversionType,
            amount: data.amount,
            from_feature: data.fromFeature,
            time_to_conversion: this.getTimeToConversion()
        });
    }

    // Track engagement events
    trackEngagement(action: string, details: Record<string, any> = {}) {
        this.trackEvent('user_engagement', {
            engagement_action: action,
            ...details
        });
    }

    // Track funnel progression
    trackFunnelStep(step: string, metadata: Record<string, any> = {}) {
        this.trackEvent('funnel_progression', {
            funnel_step: step,
            step_timestamp: new Date().toISOString(),
            ...metadata
        });
    }

    private getValueTier(usdValue: number): string {
        if (usdValue < 100) return 'small';
        if (usdValue < 1000) return 'medium';
        if (usdValue < 10000) return 'large';
        return 'whale';
    }

    private getTimeToConversion(): number {
        // Calculate time from first visit to conversion
        const firstVisit = localStorage.getItem('timeVault_firstVisit');
        if (firstVisit) {
            return Date.now() - parseInt(firstVisit);
        }
        return 0;
    }

    private async sendToCustomAnalytics(event: AnalyticsEvent) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Failed to send analytics:', error);
        }
    }

    setUserId(userId: string) {
        this.userId = userId;
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
                user_id: userId
            });
        }
    }

    getSessionData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            eventCount: this.events.length,
            events: this.events
        };
    }
}

// A/B Testing Service Class
class ABTestingService {
    private activeTests: Map<string, ABTest> = new Map();
    private userVariants: Map<string, string> = new Map();

    constructor() {
        this.loadActiveTests();
    }

    private loadActiveTests() {
        // Load active A/B tests from configuration
        const tests: ABTest[] = [
            {
                testId: 'calculator_cta_style',
                variants: [
                    { name: 'default', weight: 50, config: { buttonColor: '#D4AF37', text: 'Try Premium' } },
                    { name: 'urgent', weight: 50, config: { buttonColor: '#EF4444', text: 'Unlock Now - Limited Time!' } }
                ],
                startDate: new Date('2025-07-28'),
                active: true
            },
            {
                testId: 'onboarding_flow',
                variants: [
                    { name: 'simple', weight: 30, config: { steps: 3, skipOption: true } },
                    { name: 'detailed', weight: 30, config: { steps: 5, skipOption: false } },
                    { name: 'gamified', weight: 40, config: { steps: 4, rewards: true, skipOption: true } }
                ],
                startDate: new Date('2025-07-28'),
                active: true
            },
            {
                testId: 'pricing_display',
                variants: [
                    { name: 'monthly', weight: 50, config: { defaultPeriod: 'monthly', showAnnualDiscount: true } },
                    { name: 'annual', weight: 50, config: { defaultPeriod: 'annual', emphasizeValue: true } }
                ],
                startDate: new Date('2025-07-28'),
                active: true
            }
        ];

        tests.forEach(test => this.activeTests.set(test.testId, test));
    }

    // Get variant for user
    getVariant(testId: string, userId?: string): string {
        const test = this.activeTests.get(testId);
        if (!test || !test.active) {
            return 'default';
        }

        const userKey = userId || this.getUserKey();

        // Check if user already has a variant assigned
        const existingVariant = this.userVariants.get(`${testId}_${userKey}`);
        if (existingVariant) {
            return existingVariant;
        }

        // Assign new variant based on weights
        const variant = this.assignVariant(test);
        this.userVariants.set(`${testId}_${userKey}`, variant);

        // Store in localStorage for persistence
        localStorage.setItem(`ab_test_${testId}`, variant);

        // Track variant assignment
        this.trackVariantAssignment(testId, variant);

        return variant;
    }

    private getUserKey(): string {
        let userKey = localStorage.getItem('timeVault_userKey');
        if (!userKey) {
            userKey = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('timeVault_userKey', userKey);
        }
        return userKey;
    }

    private assignVariant(test: ABTest): string {
        const random = Math.random() * 100;
        let cumulative = 0;

        for (const variant of test.variants) {
            cumulative += variant.weight;
            if (random <= cumulative) {
                return variant.name;
            }
        }

        return test.variants[0].name; // Fallback to first variant
    }

    private trackVariantAssignment(testId: string, variant: string) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ab_test_variant_assigned', {
                test_id: testId,
                variant: variant,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Get variant configuration
    getVariantConfig(testId: string, userId?: string): Record<string, any> {
        const test = this.activeTests.get(testId);
        const variantName = this.getVariant(testId, userId);

        const variant = test?.variants.find(v => v.name === variantName);
        return variant?.config || {};
    }

    // Track conversion for A/B test
    trackConversion(testId: string, conversionType: string, value?: number) {
        const variant = this.getVariant(testId);

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ab_test_conversion', {
                test_id: testId,
                variant: variant,
                conversion_type: conversionType,
                conversion_value: value,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// React Context for Analytics
const AnalyticsContext = createContext<{
    analytics: AnalyticsService;
    abTesting: ABTestingService;
} | null>(null);

// Analytics Provider Component
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [services] = useState(() => ({
        analytics: new AnalyticsService(),
        abTesting: new ABTestingService()
    }));

    useEffect(() => {
        // Set first visit timestamp
        if (!localStorage.getItem('timeVault_firstVisit')) {
            localStorage.setItem('timeVault_firstVisit', Date.now().toString());
        }

        // Track page view
        services.analytics.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track session start
        services.analytics.trackEvent('session_start');

        // Set up beforeunload to track session end
        const handleBeforeUnload = () => {
            services.analytics.trackEvent('session_end', {
                session_duration: Date.now() - parseInt(localStorage.getItem('timeVault_sessionStart') || '0')
            });
        };

        localStorage.setItem('timeVault_sessionStart', Date.now().toString());
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [services]);

    return (
        <AnalyticsContext.Provider value= { services } >
        { children }
        </AnalyticsContext.Provider>
  );
};

// Custom Hooks
export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within AnalyticsProvider');
    }
    return context.analytics;
};

export const useABTesting = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useABTesting must be used within AnalyticsProvider');
    }
    return context.abTesting;
};

// Higher-order component for A/B testing
export const withABTest = <P extends object>(
    Component: React.ComponentType<P>,
    testId: string
) => {
    return (props: P) => {
        const abTesting = useABTesting();
        const variant = abTesting.getVariant(testId);
        const config = abTesting.getVariantConfig(testId);

        return <Component { ...props } abVariant = { variant } abConfig = { config } />;
    };
};

// Performance Analytics Hook
export const usePerformanceAnalytics = () => {
    const analytics = useAnalytics();

    useEffect(() => {
        // Track Core Web Vitals
        if ('performance' in window && 'PerformanceObserver' in window) {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        analytics.trackEvent('performance_metric', {
                            metric_name: 'first_contentful_paint',
                            value: entry.startTime,
                            rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs_improvement' : 'poor'
                        });
                    }
                });
            });
            fcpObserver.observe({ type: 'paint', buffered: true });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                analytics.trackEvent('performance_metric', {
                    metric_name: 'largest_contentful_paint',
                    value: lastEntry.startTime,
                    rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
                });
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                analytics.trackEvent('performance_metric', {
                    metric_name: 'cumulative_layout_shift',
                    value: clsValue,
                    rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
                });
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        }
    }, [analytics]);
};

export default AnalyticsService;
