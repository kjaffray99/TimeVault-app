/**
 * 🏗️ PRODUCTION CONFIGURATION SYSTEM
 * Comprehensive environment and feature management
 * Future-proofed for scaling and deployment
 */

export interface ProductionConfig {
    environment: 'development' | 'staging' | 'production';
    server: {
        port: number;
        host: string;
        protocol: 'http' | 'https';
    };
    apis: {
        coingecko: {
            baseUrl: string;
            apiKey?: string;
            timeout: number;
            rateLimit: number;
        };
        metals: {
            baseUrl: string;
            apiKey?: string;
            timeout: number;
        };
        thirdweb: {
            clientId: string;
            network: string;
        };
    };
    features: {
        premiumMode: boolean;
        portfolioAnalytics: boolean;
        nftMinting: boolean;
        stripePayments: boolean;
        advancedCharts: boolean;
        realTimeUpdates: boolean;
        cacheOptimization: boolean;
    };
    performance: {
        enableTurbopack: boolean;
        enableSWR: boolean;
        cacheStrategy: 'memory' | 'redis' | 'hybrid';
        bundleOptimization: boolean;
    };
    monitoring: {
        analytics: boolean;
        errorTracking: boolean;
        performanceMetrics: boolean;
        userBehavior: boolean;
    };
}

// Production configuration
export const productionConfig: ProductionConfig = {
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development',
    server: {
        port: parseInt(process.env.PORT || '3003'),
        host: process.env.VERCEL_URL || process.env.SITE_URL || 'localhost',
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
    },
    apis: {
        coingecko: {
            baseUrl: 'https://api.coingecko.com/api/v3',
            apiKey: process.env.COINGECKO_API_KEY,
            timeout: 8000,
            rateLimit: 50, // requests per minute
        },
        metals: {
            baseUrl: 'https://api.metals.live/v1',
            apiKey: process.env.METALS_API_KEY,
            timeout: 5000,
        },
        thirdweb: {
            clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'demo',
            network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'sepolia',
        },
    },
    features: {
        premiumMode: process.env.NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES === 'true',
        portfolioAnalytics: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS === 'true',
        nftMinting: process.env.NEXT_PUBLIC_ENABLE_NFT_MINTING === 'true',
        stripePayments: process.env.NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS === 'true',
        advancedCharts: true,
        realTimeUpdates: true,
        cacheOptimization: true,
    },
    performance: {
        enableTurbopack: true,
        enableSWR: true,
        cacheStrategy: process.env.REDIS_URL ? 'redis' : 'memory',
        bundleOptimization: process.env.NODE_ENV === 'production',
    },
    monitoring: {
        analytics: process.env.NODE_ENV === 'production',
        errorTracking: process.env.NODE_ENV === 'production',
        performanceMetrics: true,
        userBehavior: process.env.NODE_ENV === 'production',
    },
};

// Feature flag utilities
export const isFeatureEnabled = (feature: keyof ProductionConfig['features']): boolean => {
    return productionConfig.features[feature];
};

export const getApiConfig = (api: keyof ProductionConfig['apis']) => {
    return productionConfig.apis[api];
};

export const isDevelopment = () => productionConfig.environment === 'development';
export const isProduction = () => productionConfig.environment === 'production';

// Future development roadmap flags
export const FUTURE_FEATURES = {
    // Phase 2 - Advanced Analytics (Days 8-14)
    MACHINE_LEARNING_PREDICTIONS: false,
    PORTFOLIO_OPTIMIZATION_AI: false,
    SOCIAL_TRADING_FEATURES: false,

    // Phase 3 - Ecosystem Expansion (Days 15-30)
    DEFI_INTEGRATION: false,
    MULTI_CHAIN_SUPPORT: false,
    STAKING_REWARDS: false,
    GOVERNANCE_TOKEN: false,

    // Phase 4 - Enterprise Features (Days 31-90)
    WHITE_LABEL_SOLUTIONS: false,
    API_MARKETPLACE: false,
    INSTITUTIONAL_DASHBOARD: false,
    COMPLIANCE_REPORTING: false,

    // Phase 5 - Innovation (Days 91+)
    VR_AR_INTEGRATION: false,
    QUANTUM_SECURITY: false,
    CARBON_OFFSET_TRACKING: false,
    METAVERSE_PRESENCE: false,
} as const;

export default productionConfig;
