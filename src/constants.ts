/**
 * TimeVault Constants - Core App Configuration
 * Contains analytics events, API endpoints, and app settings
 */

// Analytics tracking events for revenue optimization
export const ANALYTICS_EVENTS = {
    // User engagement events
    APP_LOADED: 'app_loaded',
    PAGE_VIEW: 'page_view',
    FEATURE_ACCESSED: 'feature_accessed',

    // Premium conversion events  
    PREMIUM_INTEREST: 'premium_interest',
    PREMIUM_CHECKOUT_INITIATED: 'premium_checkout_initiated',
    PREMIUM_SUBSCRIPTION_COMPLETED: 'premium_subscription_completed',
    PREMIUM_CHECKOUT_FAILED: 'premium_checkout_failed',

    // Calculator usage events
    CALCULATOR_USED: 'calculator_used',
    CONVERSION_CALCULATED: 'conversion_calculated',
    RESULTS_SHARED: 'results_shared',

    // Social sharing events (viral growth)
    SOCIAL_SHARE_INITIATED: 'social_share_initiated',
    SOCIAL_SHARE_COMPLETED: 'social_share_completed',
    REFERRAL_LINK_GENERATED: 'referral_link_generated',

    // Gamification events
    BADGE_EARNED: 'badge_earned',
    STREAK_ACHIEVED: 'streak_achieved',
    DAILY_VISIT: 'daily_visit',

    // UI/UX events
    THEME_TOGGLED: 'theme_toggled',
    TAB_SWITCHED: 'tab_switched',
    ERROR_ENCOUNTERED: 'error_encountered',

    // Compliance events
    COMPLIANCE_ACCEPTED: 'compliance_accepted',
    COMPLIANCE_DECLINED: 'compliance_declined',
} as const;

// API configuration
export const API_CONFIG = {
    COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
    METALS_API_URL: 'https://api.metals.live/v1/spot',
    RATE_LIMIT_PER_MINUTE: 50,
    CACHE_DURATION_MS: 30000, // 30 seconds
    REQUEST_TIMEOUT_MS: 10000, // 10 seconds
} as const;

// App configuration
export const APP_CONFIG = {
    APP_NAME: 'TimeVault',
    APP_VERSION: '1.0.0',
    COMPANY_NAME: 'TimeVault AI',
    SUPPORT_EMAIL: 'support@timevaultai.com',
    PRIVACY_POLICY_URL: 'https://timevaultai.com/privacy',
    TERMS_OF_SERVICE_URL: 'https://timevaultai.com/terms',
} as const;

// Premium subscription configuration
export const PREMIUM_CONFIG = {
    MONTHLY_PRICE: 19.99,
    ANNUAL_PRICE: 199.99,
    LIFETIME_PRICE: 499.99,
    TRIAL_DAYS: 7,
    STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    NFT_VALUE_USD: 200,
} as const;

// Gamification configuration
export const GAMIFICATION_CONFIG = {
    STREAKS: {
        BEGINNER: 3,
        INTERMEDIATE: 7,
        ADVANCED: 30,
        MASTER: 100,
    },
    BADGES: {
        FIRST_CALCULATION: 'first_calculation',
        PREMIUM_USER: 'premium_user',
        SOCIAL_SHARER: 'social_sharer',
        STREAK_MASTER: 'streak_master',
    },
} as const;

// Theme configuration
export const THEME_CONFIG = {
    COLORS: {
        NAVY_PRIMARY: '#001F3F',
        GOLD_ACCENT: '#D4AF37',
        WHITE_NEUTRAL: '#FFFFFF',
        SILVER_NEUTRAL: '#C0C0C0',
        SUCCESS_GREEN: '#10B981',
        ERROR_RED: '#EF4444',
        WARNING_ORANGE: '#F59E0B',
    },
    BREAKPOINTS: {
        MOBILE: '640px',
        TABLET: '768px',
        DESKTOP: '1024px',
        LARGE: '1280px',
    },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    COMPLIANCE_ACCEPTED: 'timevault_compliance_accepted',
    PREMIUM_STATUS: 'timevault_premium_status',
    PREMIUM_PLAN: 'timevault_premium_plan',
    DARK_MODE: 'timevault_dark_mode',
    USER_PREFERENCES: 'timevault_user_preferences',
    LAST_VISIT: 'timevault_last_visit',
    VISIT_STREAK: 'timevault_visit_streak',
    EARNED_BADGES: 'timevault_earned_badges',
} as const;

// Error messages
export const ERROR_MESSAGES = {
    API_TIMEOUT: 'Request timed out. Please try again.',
    API_ERROR: 'Unable to fetch data. Please check your connection.',
    CALCULATION_ERROR: 'Unable to calculate conversion. Please try again.',
    PAYMENT_ERROR: 'Payment processing failed. Please try again.',
    GENERIC_ERROR: 'Something went wrong. Please refresh the page.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    PREMIUM_ACTIVATED: 'Welcome to TimeVault Premium! 🎉',
    CALCULATION_COMPLETE: 'Conversion calculated successfully! ✅',
    SHARED_SUCCESSFULLY: 'Shared successfully! 🚀',
    BADGE_EARNED: 'Congratulations! You earned a new badge! 🏆',
} as const;

// Validation rules
export const VALIDATION = {
    MIN_AMOUNT: 0.00000001,
    MAX_AMOUNT: 999999999,
    DECIMAL_PLACES: 8,
} as const;

export default {
    ANALYTICS_EVENTS,
    API_CONFIG,
    APP_CONFIG,
    PREMIUM_CONFIG,
    GAMIFICATION_CONFIG,
    THEME_CONFIG,
    STORAGE_KEYS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    VALIDATION,
} as const;
