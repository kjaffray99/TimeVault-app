/**
 * Security Metrics Export - Compliance & Monitoring Interface
 * 
 * Provides unified access to all security and compliance metrics
 * Easy to integrate with external monitoring systems
 */

import { SecurityAuditLogger } from '../security/audit';
import { LegacyApiBridge } from './bridge';
import { ComplianceReporter } from './compliance';

export const SecurityMetrics = {
    /**
     * Get real-time security audit metrics
     */
    getAuditReport: () => SecurityAuditLogger.getMetrics(),

    /**
     * Get comprehensive compliance report
     */
    getComplianceReport: () => ComplianceReporter.generateReport(),

    /**
     * Get security audit summary with trends
     */
    getSecurityAudit: () => ComplianceReporter.generateSecurityAudit(),

    /**
     * Get performance metrics for all services
     */
    getPerformanceReport: () => ComplianceReporter.generatePerformanceReport(),

    /**
     * Get full system status
     */
    getSystemStatus: () => LegacyApiBridge.getSystemStatus(),

    /**
     * Export all metrics in specified format
     */
    exportMetrics: (format: 'json' | 'csv' | 'summary' = 'json') =>
        ComplianceReporter.exportReports(format),

    /**
     * Get audit log for external analysis
     */
    getAuditLog: (limit?: number) => SecurityAuditLogger.getAuditLog(limit),

    /**
     * Real-time system health check
     */
    healthCheck: () => LegacyApiBridge.performMaintenance()
};
