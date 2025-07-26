/**
 * Legacy API Bridge - Main Interface
 * 
 * Unified interface for all legacy API functionality
 * Future-proof design for easy technology updates and maintenance
 */

import { ApiConfig } from '../config/apiConfig';
import { SecurityAuditLogger } from '../security/audit';
import { RateLimitManager } from '../security/rateLimit';
import { LegacyClientUtils } from './clients';
import { ComplianceReporter } from './compliance';
import { LegacyServiceProxy } from './proxy';

export class LegacyApiBridge {
    private static initialized = false;

    /**
     * Initialize the legacy API bridge with enhanced security
     */
    static initialize(): void {
        if (this.initialized) return;

        // Initialize all subsystems
        ApiConfig.initialize();
        RateLimitManager.initialize();

        // Log initialization
        SecurityAuditLogger.logEvent(
            'TECHNOLOGY_UPDATE',
            'LegacyApiBridge',
            'system',
            undefined,
            {
                action: 'initialization',
                features: this.getActiveFeatures(),
                environment: process.env.NODE_ENV
            }
        );

        this.initialized = true;

        // Show welcome message with feature overview
        this.logWelcomeMessage();
    }

    /**
     * Get comprehensive system status
     */
    static async getSystemStatus() {
        if (!this.initialized) this.initialize();

        const [healthCheck, migrationStatus] = await Promise.all([
            LegacyServiceProxy.performHealthCheck(),
            Promise.resolve(LegacyClientUtils.getMigrationStatus())
        ]);

        return {
            timestamp: new Date().toISOString(),
            systemHealth: healthCheck,
            migration: migrationStatus,
            security: {
                auditMetrics: SecurityAuditLogger.getMetrics(),
                rateLimitMetrics: RateLimitManager.getMetrics()
            },
            configuration: {
                environment: ApiConfig.getEnvironmentConfig(),
                features: this.getActiveFeatures(),
                security: ApiConfig.getSecurityConfig()
            }
        };
    }

    /**
     * Generate full compliance and migration report
     */
    static generateFullReport(format: 'json' | 'csv' | 'summary' = 'json') {
        if (!this.initialized) this.initialize();

        return ComplianceReporter.exportReports(format);
    }

    /**
     * Perform system health check and optimization
     */
    static async performMaintenance() {
        if (!this.initialized) this.initialize();

        const results = {
            auditLogCleanup: false,
            rateLimitCleanup: false,
            configRefresh: false,
            healthCheck: null as any
        };

        try {
            // Cleanup audit logs if needed
            const auditMetrics = SecurityAuditLogger.getMetrics();
            if (auditMetrics.totalAuditEvents > 5000) {
                SecurityAuditLogger.clearAuditLog();
                results.auditLogCleanup = true;
            }

            // Refresh configuration
            ApiConfig.initialize();
            results.configRefresh = true;

            // Perform health check
            results.healthCheck = await LegacyServiceProxy.performHealthCheck();

            SecurityAuditLogger.logEvent(
                'TECHNOLOGY_UPDATE',
                'LegacyApiBridge',
                'system',
                ['COMPLIANCE'],
                {
                    action: 'maintenance',
                    results
                }
            );

            return results;
        } catch (error) {
            SecurityAuditLogger.logEvent(
                'API_ERROR',
                'LegacyApiBridge',
                'system',
                ['ERROR'],
                {
                    action: 'maintenance_failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            );

            throw error;
        }
    }

    /**
     * Update system configuration (for runtime updates)
     */
    static updateConfiguration(updates: {
        rateLimitConfig?: any;
        securityConfig?: any;
        featureFlags?: Record<string, boolean>;
    }) {
        if (!this.initialized) this.initialize();

        SecurityAuditLogger.logEvent(
            'TECHNOLOGY_UPDATE',
            'LegacyApiBridge',
            'admin',
            ['COMPLIANCE'],
            {
                action: 'configuration_update',
                updates
            }
        );

        // Update rate limiting if provided
        if (updates.rateLimitConfig) {
            RateLimitManager.updateConfig(updates.rateLimitConfig);
        }

        // Log configuration change
        console.info('⚙️  TimeVault Configuration Updated:', {
            timestamp: new Date().toISOString(),
            updates,
            activeFeatures: this.getActiveFeatures()
        });
    }

    /**
     * Shutdown bridge gracefully
     */
    static shutdown() {
        if (!this.initialized) return;

        SecurityAuditLogger.logEvent(
            'TECHNOLOGY_UPDATE',
            'LegacyApiBridge',
            'system',
            undefined,
            {
                action: 'shutdown',
                uptime: Date.now()
            }
        );

        // Cleanup resources
        RateLimitManager.shutdown();

        this.initialized = false;
    }

    // Private utility methods
    private static getActiveFeatures(): string[] {
        const features = [];
        const featureFlags = ApiConfig.getFeatureFlags();

        if (featureFlags.enhancedSecurity) features.push('Enhanced Security');
        if (featureFlags.advancedMetrics) features.push('Advanced Metrics');
        if (featureFlags.migrationWarnings) features.push('Migration Warnings');
        if (featureFlags.experimentalFeatures) features.push('Experimental Features');
        if (featureFlags.legacySupport) features.push('Legacy Support');

        return features;
    }

    private static logWelcomeMessage(): void {
        const features = this.getActiveFeatures();
        const migrationStatus = LegacyClientUtils.getMigrationStatus();

        console.info('🔒 TimeVault Legacy API Bridge Initialized:', {
            version: '2.0.0',
            securityLevel: 'Enterprise-Grade',
            features,
            environment: process.env.NODE_ENV,
            migration: {
                daysUntilDeprecation: migrationStatus.daysUntilDeprecation,
                showWarning: migrationStatus.showWarning,
                migrationGuide: migrationStatus.migrationGuide
            },
            capabilities: {
                rateLimiting: 'Active with intelligent abuse detection',
                auditLogging: 'Comprehensive security event tracking',
                serviceProxy: 'Enhanced reliability with retry logic',
                complianceReporting: 'Enterprise audit trail generation',
                performanceMonitoring: 'Real-time metrics and health checks'
            }
        });

        if (migrationStatus.showWarning) {
            console.warn('⚠️  Migration Notice:', {
                message: 'Legacy API deprecation approaching',
                daysRemaining: migrationStatus.daysUntilDeprecation,
                action: 'Begin migration to new services',
                guide: migrationStatus.migrationGuide
            });
        }
    }
}

// Initialize on module load
LegacyApiBridge.initialize();
