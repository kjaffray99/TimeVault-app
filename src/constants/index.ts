/**
 * TimeVault Application Constants
 * Centralized configuration for consistent behavior across the app
 */

// ========================================
// DESIGN SYSTEM CONSTANTS
// ========================================

export const COLORS = {
    PRIMARY_NAVY: '#001F3F',
    ACCENT_GOLD: '#D4AF37',
    NEUTRAL_WHITE: '#FFFFFF',
    NEUTRAL_SILVER: '#C0C0C0',

    // Extended palette for UI components
    SUCCESS: '#28A745',
    ERROR: '#DC3545',
    WARNING: '#FFC107',
    INFO: '#17A2B8',

    // Dark mode variants
    DARK_NAVY: '#000A1A',
    DARK_GOLD: '#B8941F',
    DARK_SURFACE: '#1A1A1A',

    // Opacity variants for backgrounds
    NAVY_ALPHA_10: 'rgba(0, 31, 63, 0.1)',
    NAVY_ALPHA_20: 'rgba(0, 31, 63, 0.2)',
    GOLD_ALPHA_10: 'rgba(212, 175, 55, 0.1)',
    GOLD_ALPHA_20: 'rgba(212, 175, 55, 0.2)',
} as const;

export const TYPOGRAPHY = {
    FONT_SIZES: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
    },
    FONT_WEIGHTS: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    LINE_HEIGHTS: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
    },
} as const;

export const SPACING = {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
} as const;

export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ========================================
// BUSINESS LOGIC CONSTANTS
// ========================================

export const ENGAGEMENT = {
    STREAK_MILESTONES: [3, 7, 14, 30, 100],
    CALCULATION_TRIGGERS: {
        FIRST_PREMIUM_UPSELL: 5,
        SECOND_PREMIUM_UPSELL: 15,
        LOYALTY_REWARD: 50,
    },
    ACHIEVEMENT_DURATION: 3000, // 3 seconds
    QUIZ_REWARDS: {
        BRONZE: 10,  // TVLT tokens
        SILVER: 25,
        GOLD: 50,
    },
} as const;

export const PREMIUM = {
    SUBSCRIPTION_PRICE: 9.99,
    TRIAL_DURATION_DAYS: 7,
    FEATURES: {
        HISTORICAL_CHARTS: 'historical_charts',
        AI_INSIGHTS: 'ai_insights',
        PORTFOLIO_TRACKING: 'portfolio_tracking',
        REAL_TIME_ALERTS: 'real_time_alerts',
        ADVANCED_ANALYTICS: 'advanced_analytics',
    },
} as const;

export const NFT = {
    COLLECTIONS: {
        EDUCATIONAL_BADGES: 'educational_badges',
        ACHIEVEMENT_MEDALS: 'achievement_medals',
        UTILITY_TOKENS: 'utility_tokens',
    },
    MINT_PRICES: {
        BRONZE_BADGE: 0.001, // ETH
        SILVER_BADGE: 0.005,
        GOLD_BADGE: 0.01,
    },
} as const;

// ========================================
// API CONFIGURATION
// ========================================

export const API = {
    ENDPOINTS: {
        COINGECKO: 'https://api.coingecko.com/api/v3',
        METALS_LIVE: 'https://api.metals.live/v1',
        XRPL_MAINNET: 'https://xrplcluster.com',
        XRPL_TESTNET: 'https://s.altnet.rippletest.net:51234',
    },
    TIMEOUTS: {
        DEFAULT: 10000,
        EXTENDED: 30000,
    },
    CACHE_DURATION: {
        CRYPTO_PRICES: 5 * 60 * 1000,      // 5 minutes
        METAL_PRICES: 15 * 60 * 1000,     // 15 minutes
        USER_DATA: 60 * 60 * 1000,        // 1 hour
    },
    RETRY_ATTEMPTS: 3,
} as const;

// ========================================
// VALIDATION CONSTANTS
// ========================================

export const VALIDATION = {
    MIN_AMOUNT: 0.000001,
    MAX_AMOUNT: 1000000,
    MIN_WAGE: 1,
    MAX_WAGE: 10000,
    DEBOUNCE_DELAY: 300,
} as const;

// ========================================
// ANALYTICS EVENTS
// ========================================

export const ANALYTICS_EVENTS = {
    // Calculator Events
    CALCULATOR_LOADED: 'calculator_loaded',
    CALCULATION_PERFORMED: 'calculation_performed',
    ASSET_CHANGED: 'asset_changed',
    AMOUNT_CHANGED: 'amount_changed',

    // Engagement Events
    STREAK_ACHIEVED: 'streak_achieved',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    PREMIUM_INTEREST: 'premium_interest',

    // Dashboard Events
    QUIZ_STARTED: 'quiz_started',
    QUIZ_COMPLETED: 'quiz_completed',
    TUTORIAL_VIEWED: 'tutorial_viewed',

    // Premium Events
    SUBSCRIPTION_STARTED: 'subscription_started',
    TRIAL_STARTED: 'trial_started',
    FEATURE_ACCESSED: 'premium_feature_accessed',
    PREMIUM_CHECKOUT_INITIATED: 'premium_checkout_initiated',
    PREMIUM_SUBSCRIPTION_COMPLETED: 'premium_subscription_completed',
    PREMIUM_CHECKOUT_FAILED: 'premium_checkout_failed',

    // NFT Events
    MINT_INITIATED: 'nft_mint_initiated',
    MINT_COMPLETED: 'nft_mint_completed',
    BADGE_EARNED: 'badge_earned',

    // Error Events
    API_ERROR: 'api_error',
    CALCULATION_ERROR: 'calculation_error',
    WALLET_ERROR: 'wallet_error',
} as const;

// ========================================
// CRYPTO ASSETS CONFIGURATION
// ========================================

export const SUPPORTED_ASSETS = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        decimals: 8,
        category: 'major',
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        category: 'major',
    },
    {
        id: 'ripple',
        symbol: 'XRP',
        name: 'XRP',
        decimals: 6,
        category: 'major',
    },
    {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        decimals: 6,
        category: 'altcoin',
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        category: 'altcoin',
    },
    {
        id: 'polygon',
        symbol: 'MATIC',
        name: 'Polygon',
        decimals: 18,
        category: 'altcoin',
    },
    {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        decimals: 18,
        category: 'altcoin',
    },
] as const;

export const PRECIOUS_METALS = [
    {
        id: 'gold',
        name: 'Gold',
        symbol: 'AU',
        unit: 'oz',
        category: 'precious',
    },
    {
        id: 'silver',
        name: 'Silver',
        symbol: 'AG',
        unit: 'oz',
        category: 'precious',
    },
    {
        id: 'platinum',
        name: 'Platinum',
        symbol: 'PT',
        unit: 'oz',
        category: 'precious',
    },
    {
        id: 'palladium',
        name: 'Palladium',
        symbol: 'PD',
        unit: 'oz',
        category: 'precious',
    },
] as const;

// ========================================
// LOCAL STORAGE KEYS
// ========================================

export const STORAGE_KEYS = {
    COMPLIANCE_ACCEPTED: 'timevault_compliance_accepted',
    LAST_USED: 'timevault_last_used',
    STREAK: 'timevault_streak',
    CALCULATION_COUNT: 'timevault_calculation_count',
    USER_PREFERENCES: 'timevault_user_preferences',
    QUIZ_PROGRESS: 'timevault_quiz_progress',
    PREMIUM_STATUS: 'timevault_premium_status',
    WALLET_ADDRESS: 'timevault_wallet_address',
    ACHIEVEMENT_HISTORY: 'timevault_achievements',
} as const;

// ========================================
// FEATURE FLAGS
// ========================================

export const FEATURE_FLAGS = {
    ENABLE_DARK_MODE: true,
    ENABLE_NFT_MINTING: true,
    ENABLE_PREMIUM_FEATURES: true,
    ENABLE_WALLET_CONNECT: true,
    ENABLE_QUIZ_SYSTEM: true,
    ENABLE_ANALYTICS: true,
    ENABLE_A_B_TESTING: false, // For future use
} as const;

// Type exports for TypeScript support
export type ColorKey = keyof typeof COLORS;
export type AnalyticsEvent = keyof typeof ANALYTICS_EVENTS;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
