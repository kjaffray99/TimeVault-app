// Google Analytics 4 Enhanced E-commerce Tracking
// TimeVault AI - Premium Analytics Implementation

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

// Initialize Google Analytics
export function initializeGA(measurementId: string) {
    if (typeof window === 'undefined') return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        page_title: 'TimeVault AI - Crypto Calculator',
        page_location: window.location.href,
        custom_map: {
            custom_parameter_1: 'premium_user',
            custom_parameter_2: 'conversion_source'
        },
    });

    console.log('✅ Google Analytics 4 initialized');
}

// Track Premium Upgrade Click
export function trackPremiumUpgradeClick(planName: string, price: number) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'begin_checkout', {
        event_category: 'monetization',
        event_label: planName,
        currency: 'USD',
        value: price,
        items: [{
            item_id: planName.toLowerCase().replace(' ', '_'),
            item_name: planName,
            category: 'subscription',
            quantity: 1,
            price: price,
        }],
        custom_parameter_1: 'premium_upgrade',
        custom_parameter_2: 'pricing_page',
    });

    console.log('📊 Tracked premium upgrade click:', { planName, price });
}

// Track Successful Purchase
export function trackPurchase(data: {
    transactionId: string;
    value: number;
    currency: string;
    items: Array<{
        item_id: string;
        item_name: string;
        category: string;
        quantity: number;
        price: number;
    }>;
    customerId?: string;
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'purchase', {
        transaction_id: data.transactionId,
        value: data.value,
        currency: data.currency,
        items: data.items,
        event_category: 'monetization',
        event_label: 'subscription_purchase',
        custom_parameter_1: 'premium_conversion',
        custom_parameter_2: 'stripe_checkout',
    });

    // Track conversion
    window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual Google Ads conversion ID
        value: data.value,
        currency: data.currency,
        transaction_id: data.transactionId,
    });

    console.log('💰 Tracked purchase:', data);
}

// Track Calculator Usage
export function trackCalculatorUsage(data: {
    cryptoType: string;
    metalType: string;
    amount: number;
    conversionValue: number;
    userType: 'free' | 'premium';
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'calculator_usage', {
        event_category: 'engagement',
        event_label: `${data.cryptoType}_to_${data.metalType}`,
        crypto_type: data.cryptoType,
        metal_type: data.metalType,
        conversion_amount: data.amount,
        conversion_value: data.conversionValue,
        user_type: data.userType,
        custom_parameter_1: data.userType,
        custom_parameter_2: 'calculator_interaction',
    });

    console.log('🧮 Tracked calculator usage:', data);
}

// Track Page Views
export function trackPageView(url: string, title: string) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_title: title,
        page_location: url,
    });

    console.log('📄 Tracked page view:', { url, title });
}

// Track User Engagement
export function trackEngagement(action: string, category: string, label?: string, value?: number) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        custom_parameter_1: 'user_engagement',
        custom_parameter_2: category,
    });

    console.log('🎯 Tracked engagement:', { action, category, label, value });
}

// Track Premium Feature Usage
export function trackPremiumFeatureUsage(feature: string, userType: 'premium' | 'trial') {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'premium_feature_usage', {
        event_category: 'premium',
        event_label: feature,
        feature_name: feature,
        user_type: userType,
        custom_parameter_1: userType,
        custom_parameter_2: 'premium_engagement',
    });

    console.log('⭐ Tracked premium feature usage:', { feature, userType });
}

// Track Subscription Events
export function trackSubscriptionEvent(event: 'created' | 'updated' | 'canceled', data: {
    subscriptionId: string;
    planName: string;
    price: number;
    customerId: string;
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', `subscription_${event}`, {
        event_category: 'subscription',
        event_label: data.planName,
        subscription_id: data.subscriptionId,
        plan_name: data.planName,
        price: data.price,
        customer_id: data.customerId,
        custom_parameter_1: 'subscription_lifecycle',
        custom_parameter_2: event,
    });

    console.log('📋 Tracked subscription event:', { event, data });
}

// Track User Onboarding Progress
export function trackOnboardingStep(step: number, stepName: string, completed: boolean) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'onboarding_progress', {
        event_category: 'onboarding',
        event_label: stepName,
        step_number: step,
        step_name: stepName,
        completed: completed,
        custom_parameter_1: 'user_onboarding',
        custom_parameter_2: completed ? 'step_completed' : 'step_viewed',
    });

    console.log('🚀 Tracked onboarding step:', { step, stepName, completed });
}

// Track Revenue Metrics
export function trackRevenue(data: {
    amount: number;
    currency: string;
    source: string;
    planType: string;
    isRecurring: boolean;
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'revenue_generated', {
        event_category: 'revenue',
        event_label: data.planType,
        value: data.amount,
        currency: data.currency,
        revenue_source: data.source,
        plan_type: data.planType,
        is_recurring: data.isRecurring,
        custom_parameter_1: 'revenue_tracking',
        custom_parameter_2: data.source,
    });

    console.log('💰 Tracked revenue:', data);
}

// Track Error Events
export function trackError(error: string, category: string, fatal: boolean = false) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'exception', {
        description: error,
        fatal: fatal,
        event_category: category,
        custom_parameter_1: 'error_tracking',
        custom_parameter_2: category,
    });

    console.error('🚨 Tracked error:', { error, category, fatal });
}

// Track Performance Metrics
export function trackPerformance(metric: string, value: number, category: string = 'performance') {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'timing_complete', {
        name: metric,
        value: Math.round(value),
        event_category: category,
        custom_parameter_1: 'performance_tracking',
        custom_parameter_2: metric,
    });

    console.log('⚡ Tracked performance:', { metric, value, category });
}

// Custom Event Tracking for A/B Testing
export function trackExperiment(experimentId: string, variantId: string, event: string) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'experiment_impression', {
        event_category: 'experiment',
        event_label: `${experimentId}_${variantId}`,
        experiment_id: experimentId,
        variant_id: variantId,
        experiment_event: event,
        custom_parameter_1: 'ab_testing',
        custom_parameter_2: experimentId,
    });

    console.log('🧪 Tracked experiment:', { experimentId, variantId, event });
}

// Enhanced User Properties
export function setUserProperties(properties: {
    userId?: string;
    userType: 'free' | 'premium' | 'trial';
    signupDate?: string;
    totalCalculations?: number;
    premiumFeatures?: string[];
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        user_id: properties.userId,
        custom_map: {
            user_type: properties.userType,
            signup_date: properties.signupDate,
            total_calculations: properties.totalCalculations,
            premium_features: properties.premiumFeatures?.join(','),
        },
    });

    console.log('👤 Set user properties:', properties);
}

// Real-time Revenue Dashboard Tracking
export function trackRealtimeMetrics(metrics: {
    activeUsers: number;
    todayRevenue: number;
    conversionRate: number;
    premiumUsers: number;
}) {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', 'realtime_metrics', {
        event_category: 'dashboard',
        active_users: metrics.activeUsers,
        today_revenue: metrics.todayRevenue,
        conversion_rate: metrics.conversionRate,
        premium_users: metrics.premiumUsers,
        custom_parameter_1: 'realtime_tracking',
        custom_parameter_2: 'dashboard_metrics',
    });

    console.log('📊 Tracked realtime metrics:', metrics);
}

// Environment-specific configuration
export const analyticsConfig = {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!,
    debugMode: process.env.NODE_ENV === 'development',
    trackingEnabled: process.env.NODE_ENV === 'production',
    customDimensions: {
        userType: 'custom_dimension_1',
        conversionSource: 'custom_dimension_2',
        premiumFeatures: 'custom_dimension_3',
    },
    conversionIds: {
        signUp: 'AW-CONVERSION_ID/SIGNUP_LABEL',
        purchase: 'AW-CONVERSION_ID/PURCHASE_LABEL',
    },
};

// Initialize analytics on app load
export function initializeAnalytics() {
    if (typeof window === 'undefined') return;

    // Initialize GA4
    initializeGA(analyticsConfig.measurementId);

    // Set default user properties
    setUserProperties({
        userType: 'free',
        signupDate: new Date().toISOString(),
        totalCalculations: 0,
    });

    // Track initial page load
    trackPageView(window.location.href, document.title);

    console.log('🚀 Analytics fully initialized');
}
