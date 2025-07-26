/**
 * Legacy Clients - Secure Backward Compatibility
 * 
 * Provides secure fallback functionality for deprecated clients
 * Easy to update with new authentication methods or API endpoints
 */

import { ApiConfig } from '../config/apiConfig';
import { SecurityAuditLogger } from '../security/audit';
import { LegacyServiceProxy } from './proxy';
import { CryptoPriceService, MetalsPriceService } from './services';
import type { LegacyClientConfig } from './types';

/**
 * Legacy CoinGecko Client with secure fallbacks
 */
export const coinGeckoClient = {
    get: async (url: string, config?: LegacyClientConfig) => {
        const clientId = config?.clientId || 'legacy-coingecko-client';

        // Log deprecation warning
        SecurityAuditLogger.logEvent(
            'LEGACY_CLIENT_ACCESS',
            'coinGeckoClient',
            clientId,
            ['DEPRECATED', 'MIGRATION_NEEDED'],
            {
                endpoint: url,
                migrationUrl: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
                deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate
            }
        );

        // Show migration warning in development
        if (ApiConfig.isDevelopment()) {
            console.warn('⚠️  Using deprecated coinGeckoClient:', {
                message: 'Migrate to CryptoPriceService for enhanced security and performance',
                endpoint: url,
                migrationGuide: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
                deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate
            });
        }

        // Provide secure fallback functionality based on URL patterns
        if (url.includes('/simple/price') || url.includes('/coins/markets')) {
            const result = await LegacyServiceProxy.executeWithRetry(
                () => CryptoPriceService.getCryptoPrices(),
                'LEGACY_CRYPTO_FALLBACK',
                clientId,
                config
            );

            if (!result.success) {
                throw new Error(result.error || 'Legacy crypto service unavailable');
            }

            // Transform to legacy format if needed
            return {
                data: result.data,
                status: 200,
                headers: { 'x-legacy-fallback': 'true' }
            };
        }

        // For unsupported endpoints, provide clear migration guidance
        const migrationError = new Error(
            `Legacy endpoint '${url}' is no longer supported. ` +
            `Please migrate to CryptoPriceService. ` +
            `See migration guide: ${ApiConfig.getMigrationConfig().migrationDocumentationUrl}`
        );

        SecurityAuditLogger.logEvent(
            'MIGRATION_WARNING',
            'coinGeckoClient',
            clientId,
            ['DEPRECATED', 'MIGRATION_NEEDED'],
            {
                unsupportedEndpoint: url,
                recommendation: 'Use CryptoPriceService.getCryptoPrices()'
            }
        );

        throw migrationError;
    },

    /**
     * Get client status and migration information
     */
    getStatus: () => ({
        deprecated: true,
        migrationRequired: true,
        supportedEndpoints: ['/simple/price', '/coins/markets'],
        migrationGuide: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
        deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate,
        recommendedService: 'CryptoPriceService'
    })
};

/**
 * Legacy Metals Client with secure fallbacks
 */
export const metalsClient = {
    get: async (url: string, config?: LegacyClientConfig) => {
        const clientId = config?.clientId || 'legacy-metals-client';

        // Log deprecation warning
        SecurityAuditLogger.logEvent(
            'LEGACY_CLIENT_ACCESS',
            'metalsClient',
            clientId,
            ['DEPRECATED', 'MIGRATION_NEEDED'],
            {
                endpoint: url,
                migrationUrl: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
                deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate
            }
        );

        // Show migration warning in development
        if (ApiConfig.isDevelopment()) {
            console.warn('⚠️  Using deprecated metalsClient:', {
                message: 'Migrate to MetalsPriceService for enhanced security and performance',
                endpoint: url,
                migrationGuide: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
                deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate
            });
        }

        // Provide secure fallback functionality based on URL patterns
        if (url.includes('metals.live') || url.includes('metals') || url.includes('precious')) {
            const result = await LegacyServiceProxy.executeWithRetry(
                () => MetalsPriceService.getMetalsPrices(),
                'LEGACY_METALS_FALLBACK',
                clientId,
                config
            );

            if (!result.success) {
                throw new Error(result.error || 'Legacy metals service unavailable');
            }

            // Transform to legacy format if needed
            return {
                data: result.data,
                status: 200,
                headers: { 'x-legacy-fallback': 'true' }
            };
        }

        // For unsupported endpoints, provide clear migration guidance
        const migrationError = new Error(
            `Legacy endpoint '${url}' is no longer supported. ` +
            `Please migrate to MetalsPriceService. ` +
            `See migration guide: ${ApiConfig.getMigrationConfig().migrationDocumentationUrl}`
        );

        SecurityAuditLogger.logEvent(
            'MIGRATION_WARNING',
            'metalsClient',
            clientId,
            ['DEPRECATED', 'MIGRATION_NEEDED'],
            {
                unsupportedEndpoint: url,
                recommendation: 'Use MetalsPriceService.getMetalsPrices()'
            }
        );

        throw migrationError;
    },

    /**
     * Get client status and migration information
     */
    getStatus: () => ({
        deprecated: true,
        migrationRequired: true,
        supportedEndpoints: ['metals.live', '/precious', '/metals'],
        migrationGuide: ApiConfig.getMigrationConfig().migrationDocumentationUrl,
        deprecationDate: ApiConfig.getMigrationConfig().legacyApiDeprecationDate,
        recommendedService: 'MetalsPriceService'
    })
};

/**
 * Legacy client utilities for migration assistance
 */
export const LegacyClientUtils = {
    /**
     * Get migration status for all legacy clients
     */
    getMigrationStatus: () => {
        const config = ApiConfig.getMigrationConfig();
        const deprecationDate = new Date(config.legacyApiDeprecationDate);
        const now = new Date();
        const daysUntilDeprecation = Math.ceil((deprecationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
            daysUntilDeprecation,
            warningThreshold: config.warningThreshold,
            showWarning: daysUntilDeprecation <= config.warningThreshold,
            migrationRequired: daysUntilDeprecation <= 0,
            migrationGuide: config.migrationDocumentationUrl,
            clients: {
                coinGecko: coinGeckoClient.getStatus(),
                metals: metalsClient.getStatus()
            }
        };
    },

    /**
     * Generate migration report for compliance
     */
    generateMigrationReport: () => {
        const proxyMetrics = LegacyServiceProxy.getServiceMetrics();
        const migrationStatus = LegacyClientUtils.getMigrationStatus();

        return {
            timestamp: new Date().toISOString(),
            migrationStatus,
            usageMetrics: proxyMetrics,
            recommendations: [
                'Replace coinGeckoClient.get() with CryptoPriceService.getCryptoPrices()',
                'Replace metalsClient.get() with MetalsPriceService.getMetalsPrices()',
                'Update error handling to use new ApiResult interface',
                'Implement proper TypeScript types for enhanced type safety',
                'Consider using new retry and timeout configuration options'
            ],
            estimatedMigrationEffort: {
                simple: '1-2 hours for basic replacements',
                moderate: '4-8 hours for complex integrations',
                complex: '1-2 days for custom implementations'
            }
        };
    }
};
