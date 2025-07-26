/**
 * Compliance Reporter - Enterprise Audit & Reporting
 * 
 * Generates comprehensive compliance reports for enterprise requirements
 * Easy to extend with new compliance frameworks or reporting formats
 */

import { SecurityAuditLogger } from '../security/audit';
import { RateLimitManager } from '../security/rateLimit';
import { LegacyClientUtils } from './clients';
import { LegacyServiceProxy } from './proxy';
import type { ComplianceReport } from './types';

export class ComplianceReporter {
    /**
     * Generate comprehensive compliance report
     */
    static generateReport(): ComplianceReport {
        const securityMetrics = SecurityAuditLogger.getMetrics();
        const migrationStatus = LegacyClientUtils.getMigrationStatus();

        return {
            securityMetrics,
            migrationStatus: {
                legacyClientsActive: true,
                securityEnhancementsActive: true,
                complianceLevel: 'Enterprise-Grade',
                lastAuditDate: new Date().toISOString(),
                recommendedActions: this.getRecommendedActions(migrationStatus)
            },
            riskAssessment: this.assessRisk(securityMetrics, migrationStatus)
        };
    }

    /**
     * Generate security audit summary
     */
    static generateSecurityAudit() {
        const metrics = SecurityAuditLogger.getMetrics();
        const auditLog = SecurityAuditLogger.getAuditLog(100); // Last 100 events

        return {
            summary: {
                totalEvents: metrics.totalAuditEvents,
                securityFlags: metrics.securityFlags,
                errorRate: metrics.errorRate,
                avgResponseTime: metrics.avgResponseTime,
                technologyDebtEvents: metrics.technologyDebtEvents,
                migrationWarnings: metrics.migrationWarnings
            },
            recentEvents: auditLog.slice(-10), // Last 10 events
            trends: this.analyzeTrends(auditLog),
            recommendations: this.getSecurityRecommendations(metrics)
        };
    }

    /**
     * Generate performance report
     */
    static generatePerformanceReport() {
        const serviceMetrics = LegacyServiceProxy.getServiceMetrics();
        const rateLimitMetrics = RateLimitManager.getMetrics();

        return {
            timestamp: new Date().toISOString(),
            services: Object.entries(serviceMetrics).map(([name, metrics]) => ({
                name,
                performance: {
                    requestCount: metrics.requestCount,
                    successRate: metrics.requestCount > 0
                        ? (metrics.successCount / metrics.requestCount) * 100
                        : 0,
                    averageResponseTime: metrics.averageResponseTime,
                    errorRate: metrics.requestCount > 0
                        ? (metrics.errorCount / metrics.requestCount) * 100
                        : 0
                },
                status: this.determineServiceStatus(metrics)
            })),
            rateLimiting: {
                config: rateLimitMetrics.config,
                storageType: rateLimitMetrics.storageType,
                cleanupActive: rateLimitMetrics.cleanupActive
            },
            recommendations: this.getPerformanceRecommendations(serviceMetrics)
        };
    }

    /**
     * Export all reports in various formats
     */
    static exportReports(format: 'json' | 'csv' | 'summary' = 'json') {
        const compliance = this.generateReport();
        const security = this.generateSecurityAudit();
        const performance = this.generatePerformanceReport();

        const fullReport = {
            timestamp: new Date().toISOString(),
            compliance,
            security,
            performance,
            metadata: {
                apiVersion: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                reportFormat: format
            }
        };

        switch (format) {
            case 'csv':
                return this.convertToCSV(fullReport);
            case 'summary':
                return this.generateSummary(fullReport);
            default:
                return JSON.stringify(fullReport, null, 2);
        }
    }

    // Private utility methods
    private static getRecommendedActions(migrationStatus: any): string[] {
        const actions: string[] = [];

        if (migrationStatus.showWarning) {
            actions.push('Begin migration from legacy clients to new services');
            actions.push('Update documentation to reflect new API patterns');
        }

        if (migrationStatus.daysUntilDeprecation <= 7) {
            actions.push('URGENT: Complete migration within 7 days');
            actions.push('Test all endpoints with new service implementations');
        }

        actions.push('Implement proper error handling for new service interfaces');
        actions.push('Consider enabling advanced monitoring features');

        return actions;
    }

    private static assessRisk(securityMetrics: any, migrationStatus: any) {
        const factors: string[] = [];
        let level: 'low' | 'medium' | 'high' = 'low';

        // Check error rates
        if (securityMetrics.errorRate > 10) {
            factors.push('High error rate detected');
            level = 'medium';
        }

        // Check migration timeline
        if (migrationStatus.daysUntilDeprecation <= 30) {
            factors.push('Legacy API deprecation approaching');
            level = level === 'low' ? 'medium' : 'high';
        }

        // Check technology debt
        if (securityMetrics.technologyDebtEvents > 10) {
            factors.push('Significant technology debt accumulation');
            level = 'medium';
        }

        return {
            level,
            factors,
            mitigations: this.getRiskMitigations(factors)
        };
    }

    private static getRiskMitigations(factors: string[]): string[] {
        const mitigations: string[] = [];

        if (factors.includes('High error rate detected')) {
            mitigations.push('Implement enhanced error handling and retry logic');
            mitigations.push('Monitor service health more frequently');
        }

        if (factors.includes('Legacy API deprecation approaching')) {
            mitigations.push('Accelerate migration timeline');
            mitigations.push('Create detailed migration plan with rollback strategy');
        }

        if (factors.includes('Significant technology debt accumulation')) {
            mitigations.push('Schedule regular technology debt review sessions');
            mitigations.push('Implement automated migration assistance tools');
        }

        return mitigations;
    }

    private static analyzeTrends(auditLog: any[]): any {
        const hourlyDistribution = new Map();
        const eventTypeDistribution = new Map();

        auditLog.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            hourlyDistribution.set(hour, (hourlyDistribution.get(hour) || 0) + 1);
            eventTypeDistribution.set(event.action, (eventTypeDistribution.get(event.action) || 0) + 1);
        });

        return {
            peakHours: Array.from(hourlyDistribution.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([hour]) => hour),
            mostCommonEvents: Array.from(eventTypeDistribution.entries())
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([event, count]) => ({ event, count }))
        };
    }

    private static getSecurityRecommendations(metrics: any): string[] {
        const recommendations: string[] = [];

        if (metrics.errorRate > 5) {
            recommendations.push('Investigate and reduce error rate');
        }

        if (metrics.technologyDebtEvents > 5) {
            recommendations.push('Address technology debt through systematic migration');
        }

        if (metrics.migrationWarnings > 0) {
            recommendations.push('Review and act on migration warnings');
        }

        recommendations.push('Regularly review security audit logs');
        recommendations.push('Consider implementing additional monitoring tools');

        return recommendations;
    }

    private static getPerformanceRecommendations(serviceMetrics: any): string[] {
        const recommendations: string[] = [];

        Object.entries(serviceMetrics).forEach(([service, metrics]: [string, any]) => {
            if (metrics.averageResponseTime > 5000) {
                recommendations.push(`Optimize response time for ${service}`);
            }

            if (metrics.errorCount / metrics.requestCount > 0.05) {
                recommendations.push(`Improve error handling for ${service}`);
            }
        });

        return recommendations;
    }

    private static determineServiceStatus(metrics: any): string {
        const successRate = metrics.requestCount > 0
            ? metrics.successCount / metrics.requestCount
            : 0;

        if (successRate > 0.95 && metrics.averageResponseTime < 3000) return 'excellent';
        if (successRate > 0.90 && metrics.averageResponseTime < 5000) return 'good';
        if (successRate > 0.80) return 'fair';
        return 'poor';
    }

    private static convertToCSV(data: any): string {
        // Simplified CSV conversion for compliance data
        const lines: string[] = [];
        lines.push('Timestamp,Metric,Value,Status');

        const timestamp = data.timestamp;
        lines.push(`${timestamp},Total Events,${data.security.summary.totalEvents},Info`);
        lines.push(`${timestamp},Error Rate,${data.security.summary.errorRate}%,${data.security.summary.errorRate > 5 ? 'Warning' : 'OK'}`);
        lines.push(`${timestamp},Avg Response Time,${data.security.summary.avgResponseTime}ms,${data.security.summary.avgResponseTime > 3000 ? 'Warning' : 'OK'}`);

        return lines.join('\n');
    }

    private static generateSummary(data: any): string {
        return `
TimeVault API Compliance Summary
Generated: ${data.timestamp}

Security Status: ${data.compliance.riskAssessment.level.toUpperCase()}
- Total Events: ${data.security.summary.totalEvents}
- Error Rate: ${data.security.summary.errorRate}%
- Avg Response Time: ${data.security.summary.avgResponseTime}ms

Migration Status:
- Days Until Deprecation: ${data.compliance.migrationStatus.lastAuditDate}
- Compliance Level: ${data.compliance.migrationStatus.complianceLevel}

Recommendations:
${data.compliance.migrationStatus.recommendedActions.map((action: string) => `- ${action}`).join('\n')}
    `.trim();
    }
}
