/**
 * API Configuration - Centralized & Environment-Aware
 * 
 * Single source of truth for all API configuration
 * Easy to update for new technologies and deployment environments
 */

import type { RateLimitConfig } from '../legacy/types';

interface ApiEnvironmentConfig {
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

interface SecurityConfiguration {
    rateLimit: RateLimitConfig;
    audit: {
        enableLogging: boolean;
        maxLogEntries: number;
        sensitiveDataMasking: boolean;
        exportEnabled: boolean;
    };
    validation: {
        strictTypeChecking: boolean;
        sanitizeInputs: boolean;
        validateOrigins: boolean;
    };
    headers: {
        corsEnabled: boolean;
        securityHeaders: boolean;
        customHeaders: Record<string, string>;
    };
}

interface ApiEndpointConfig {
    timeouts: {
        default: number;
        crypto: number;
        metals: number;
    };
    retries: {
        maxAttempts: number;
        backoffMs: number;
    };
    caching: {
        enabled: boolean;
        defaultTtl: number;
        cryptoTtl: number;
        metalsTtl: number;
    };
}

export class ApiConfig {
    /**
     * Initialize configuration based on environment
     */
    static initialize(): void {
        // Configuration is now computed on-demand rather than stored
        // This makes the system more responsive to environment changes
    }

    /**
     * Environment detection and configuration
     */
    static getEnvironmentConfig(): ApiEnvironmentConfig {
        const nodeEnv = process.env.NODE_ENV || 'development';

        return {
            isDevelopment: nodeEnv === 'development',
            isProduction: nodeEnv === 'production',
            isTest: nodeEnv === 'test',
            logLevel: this.getLogLevel()
        };
    }

    static isDevelopment(): boolean {
        return this.getEnvironmentConfig().isDevelopment;
    }

    static isProduction(): boolean {
        return this.getEnvironmentConfig().isProduction;
    }

    /**
     * Security configuration with environment-specific settings
     */
    static getSecurityConfig(): SecurityConfiguration {
        const baseConfig: SecurityConfiguration = {
            rateLimit: {
                windowMs: 60000, // 1 minute
                maxRequests: this.isProduction() ? 50 : 100,
                skipSuccessfulRequests: false
            },
            audit: {
                enableLogging: true,
                maxLogEntries: this.isProduction() ? 5000 : 1000,
                sensitiveDataMasking: this.isProduction(),
                exportEnabled: this.isProduction()
            },
            validation: {
                strictTypeChecking: true,
                sanitizeInputs: true,
                validateOrigins: this.isProduction()
            },
            headers: {
                corsEnabled: true,
                securityHeaders: this.isProduction(),
                customHeaders: this.getCustomHeaders()
            }
        };

        // Override with environment variables if available
        if (process.env.VITE_RATE_LIMIT_MAX) {
            baseConfig.rateLimit.maxRequests = parseInt(process.env.VITE_RATE_LIMIT_MAX, 10);
        }

        return baseConfig;
    }

    /**
     * API endpoint configuration
     */
    static getEndpointConfig(): ApiEndpointConfig {
        return {
            timeouts: {
                default: parseInt(process.env.VITE_API_TIMEOUT || '10000', 10),
                crypto: parseInt(process.env.VITE_CRYPTO_API_TIMEOUT || '8000', 10),
                metals: parseInt(process.env.VITE_METALS_API_TIMEOUT || '6000', 10)
            },
            retries: {
                maxAttempts: parseInt(process.env.VITE_API_MAX_RETRIES || '3', 10),
                backoffMs: parseInt(process.env.VITE_API_BACKOFF_MS || '1000', 10)
            },
            caching: {
                enabled: process.env.VITE_CACHE_ENABLED !== 'false',
                defaultTtl: parseInt(process.env.VITE_CACHE_TTL || '300000', 10), // 5 minutes
                cryptoTtl: parseInt(process.env.VITE_CRYPTO_CACHE_TTL || '60000', 10), // 1 minute
                metalsTtl: parseInt(process.env.VITE_METALS_CACHE_TTL || '300000', 10) // 5 minutes
            }
        };
    }

    /**
     * Feature flags for gradual rollouts and A/B testing
     */
    static getFeatureFlags(): Record<string, boolean> {
        return {
            enhancedSecurity: process.env.VITE_ENHANCED_SECURITY === 'true',
            advancedMetrics: process.env.VITE_ADVANCED_METRICS === 'true',
            migrationWarnings: process.env.VITE_MIGRATION_WARNINGS !== 'false',
            experimentalFeatures: process.env.VITE_EXPERIMENTAL === 'true',
            legacySupport: process.env.VITE_LEGACY_SUPPORT !== 'false'
        };
    }

    /**
     * Technology stack configuration for easy updates
     */
    static getTechnologyConfig() {
        return {
            apis: {
                crypto: {
                    primary: 'coingecko',
                    fallback: 'coinmarketcap',
                    version: 'v3'
                },
                metals: {
                    primary: 'metals.live',
                    fallback: 'metalpriceapi',
                    version: 'v1'
                }
            },
            monitoring: {
                enabled: this.isProduction(),
                provider: process.env.VITE_MONITORING_PROVIDER || 'internal',
                endpoint: process.env.VITE_MONITORING_ENDPOINT
            },
            analytics: {
                enabled: process.env.VITE_ANALYTICS_ENABLED === 'true',
                provider: process.env.VITE_ANALYTICS_PROVIDER || 'internal'
            }
        };
    }

    /**
     * Migration and deprecation settings
     */
    static getMigrationConfig() {
        return {
            legacyApiDeprecationDate: process.env.VITE_LEGACY_DEPRECATION_DATE || '2025-12-31',
            migrationGracePeriod: parseInt(process.env.VITE_MIGRATION_GRACE_PERIOD || '90', 10), // days
            warningThreshold: parseInt(process.env.VITE_WARNING_THRESHOLD || '30', 10), // days before deprecation
            forceUpgradeDate: process.env.VITE_FORCE_UPGRADE_DATE,
            migrationDocumentationUrl: process.env.VITE_MIGRATION_DOCS_URL || '/docs/migration'
        };
    }

    // Private utility methods
    private static getLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
        const level = process.env.VITE_LOG_LEVEL?.toLowerCase();
        if (['debug', 'info', 'warn', 'error'].includes(level || '')) {
            return level as 'debug' | 'info' | 'warn' | 'error';
        }
        return this.isProduction() ? 'warn' : 'info';
    }

    private static getCustomHeaders(): Record<string, string> {
        const headers: Record<string, string> = {};

        if (this.isProduction()) {
            headers['X-API-Version'] = process.env.npm_package_version || '1.0.0';
            headers['X-Security-Level'] = 'enterprise';
        }

        // Add any custom headers from environment
        Object.keys(process.env).forEach(key => {
            if (key.startsWith('VITE_HEADER_')) {
                const headerName = key.replace('VITE_HEADER_', '').toLowerCase().replace(/_/g, '-');
                headers[headerName] = process.env[key] || '';
            }
        });

        return headers;
    }
}

// Initialize configuration on module load
ApiConfig.initialize();
