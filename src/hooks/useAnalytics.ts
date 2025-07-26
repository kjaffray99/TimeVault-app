/**
 * Analytics Hook for TimeVault MVP
 * Tracks user engagement and conversion events
 */

import { useCallback } from 'react';

interface AnalyticsProperties {
    [key: string]: string | number | boolean;
}

interface AnalyticsEvent {
    event: string;
    properties: AnalyticsProperties;
    timestamp: number;
    session_id: string;
}

// Generate session ID
const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('tv_session_id');
    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        sessionStorage.setItem('tv_session_id', sessionId);
    }
    return sessionId;
};

// Store events locally for offline analytics
const storeEvent = (event: AnalyticsEvent): void => {
    try {
        const events = JSON.parse(localStorage.getItem('tv_analytics_events') || '[]');
        events.push(event);

        // Keep only last 1000 events
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }

        localStorage.setItem('tv_analytics_events', JSON.stringify(events));
    } catch (error) {
        console.warn('Failed to store analytics event:', error);
    }
};

export const useAnalytics = () => {
    const track = useCallback((eventName: string, properties: AnalyticsProperties = {}) => {
        const event: AnalyticsEvent = {
            event: eventName,
            properties: {
                ...properties,
                url: window.location.href,
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                timestamp: Date.now()
            },
            timestamp: Date.now(),
            session_id: getSessionId()
        };

        // Store locally
        storeEvent(event);

        // Send to Google Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', eventName, {
                custom_parameter_1: JSON.stringify(properties),
                event_category: 'user_engagement',
                event_label: eventName
            });
        }

        // Send to custom analytics endpoint (future)
        if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
            fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            }).catch(error => {
                console.warn('Failed to send analytics event:', error);
            });
        }

        // Console log for development
        if (import.meta.env.DEV) {
            console.log('📊 Analytics Event:', eventName, properties);
        }
    }, []);

    // Track page view
    const trackPageView = useCallback((page: string, properties: AnalyticsProperties = {}) => {
        track('page_view', {
            page,
            ...properties
        });
    }, [track]);

    // Track conversion events
    const trackConversion = useCallback((conversionType: string, value?: number, properties: AnalyticsProperties = {}) => {
        track('conversion', {
            conversion_type: conversionType,
            value: value || 0,
            ...properties
        });
    }, [track]);

    // Track premium interest
    const trackPremiumInterest = useCallback((source: string, properties: AnalyticsProperties = {}) => {
        track('premium_interest', {
            source,
            ...properties
        });
    }, [track]);

    // Get stored events (for debugging or export)
    const getStoredEvents = useCallback((): AnalyticsEvent[] => {
        try {
            return JSON.parse(localStorage.getItem('tv_analytics_events') || '[]');
        } catch {
            return [];
        }
    }, []);

    // Clear stored events
    const clearStoredEvents = useCallback((): void => {
        localStorage.removeItem('tv_analytics_events');
    }, []);

    return {
        track,
        trackPageView,
        trackConversion,
        trackPremiumInterest,
        getStoredEvents,
        clearStoredEvents
    };
};
