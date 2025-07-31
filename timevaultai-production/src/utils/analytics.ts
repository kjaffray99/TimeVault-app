export async function trackAnalytics(event: string, data: any = {}) {
    if (typeof window === 'undefined') return;

    try {
        // Track with Google Analytics if available
        if (window.gtag) {
            window.gtag('event', event, {
                custom_parameter_1: data.type || 'general',
                custom_parameter_2: data.value || '',
                ...data
            });
        }

        // Send to our internal analytics endpoint
        await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event, data: { ...data, timestamp: new Date().toISOString() } }),
        });
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

export async function trackCalculation(cryptoType: string, amount: number, targetType: string) {
    return trackAnalytics('calculation_performed', {
        crypto_type: cryptoType,
        amount,
        target_type: targetType,
        user_agent: navigator.userAgent,
    });
}

export async function trackPremiumInterest(feature: string) {
    return trackAnalytics('premium_interest', {
        feature,
        page_url: window.location.href,
    });
}

export async function trackUserEngagement(action: string, details: any = {}) {
    return trackAnalytics('user_engagement', {
        action,
        ...details,
        session_duration: Date.now() - (window.sessionStartTime || Date.now()),
    });
}

export function measurePerformance(operation: string, startTime: number) {
    const duration = performance.now() - startTime;
    trackAnalytics('performance_metric', {
        operation,
        duration,
        timestamp: new Date().toISOString(),
    });
    return duration;
}

// Initialize session tracking
if (typeof window !== 'undefined') {
    window.sessionStartTime = Date.now();
}
