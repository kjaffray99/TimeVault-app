/**
 * Security Audit Logger - Modular & Future-Proof
 * 
 * Handles all security event logging with pluggable backends
 * Easy to update for new logging technologies or compliance requirements
 */

import { ApiConfig } from '../config/apiConfig';
import type { SecurityAudit, SecurityEventType, SecurityFlag } from '../legacy/types';

interface LoggerBackend {
    log(event: SecurityAudit): void;
    getMetrics(): any;
}

class ConsoleLoggerBackend implements LoggerBackend {
    log(event: SecurityAudit): void {
        if (ApiConfig.isDevelopment()) {
            console.log('🔒 Security Event:', event);
        } else {
            console.warn('TimeVault Security Audit:', event);
        }
    }

    getMetrics() {
        return { backend: 'console', active: true };
    }
}

// Future backend examples (easily pluggable):
// class DatadogLoggerBackend implements LoggerBackend
// class ElasticsearchLoggerBackend implements LoggerBackend
// class CloudWatchLoggerBackend implements LoggerBackend

export class SecurityAuditLogger {
    private static auditLog: SecurityAudit[] = [];
    private static backends: LoggerBackend[] = [new ConsoleLoggerBackend()];
    private static readonly MAX_LOG_ENTRIES = ApiConfig.getSecurityConfig().audit.maxLogEntries;

    /**
     * Add a new logging backend (for technology updates)
     */
    static addBackend(backend: LoggerBackend): void {
        this.backends.push(backend);
    }

    /**
     * Remove a logging backend
     */
    static removeBackend(backendType: string): void {
        this.backends = this.backends.filter(
            backend => backend.constructor.name !== backendType
        );
    }

    /**
     * Log a security event with enhanced metadata
     */
    static logEvent(
        action: SecurityEventType,
        source: string,
        clientInfo?: string,
        flags?: SecurityFlag[],
        metadata?: Record<string, any>
    ): void {
        const requestId = this.generateRequestId();
        const audit: SecurityAudit = {
            timestamp: Date.now(),
            action,
            source,
            clientInfo,
            securityFlags: flags,
            requestId,
            metadata: {
                ...metadata,
                environment: process.env.NODE_ENV,
                version: process.env.npm_package_version || 'unknown'
            }
        };

        // Add to in-memory log
        this.auditLog.push(audit);

        // Memory management
        if (this.auditLog.length > this.MAX_LOG_ENTRIES) {
            this.auditLog.shift();
        }

        // Send to all backends
        this.backends.forEach(backend => {
            try {
                backend.log(audit);
            } catch (error) {
                console.error('Logger backend error:', error);
            }
        });
    }

    /**
     * Get security metrics with enhanced analytics
     */
    static getMetrics() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        const recentEvents = this.auditLog.filter(log => now - log.timestamp < oneHour);

        return {
            totalAuditEvents: this.auditLog.length,
            rateLimitEvents: this.auditLog.filter(log => log.rateLimited).length,
            securityFlags: this.auditLog.filter(log => log.securityFlags?.length).length,
            lastHour: recentEvents.length,
            avgResponseTime: this.calculateAverageResponseTime(),
            errorRate: this.calculateErrorRate(),
            technologyDebtEvents: this.auditLog.filter(
                log => log.securityFlags?.includes('TECHNOLOGY_DEBT')
            ).length,
            migrationWarnings: this.auditLog.filter(
                log => log.securityFlags?.includes('MIGRATION_NEEDED')
            ).length
        };
    }

    /**
     * Get audit log for compliance reporting
     */
    static getAuditLog(limit?: number): SecurityAudit[] {
        return limit ? this.auditLog.slice(-limit) : [...this.auditLog];
    }

    /**
     * Clear audit log (for testing or privacy compliance)
     */
    static clearAuditLog(): void {
        this.auditLog = [];
    }

    /**
     * Export audit log for external analysis
     */
    static exportAuditLog(format: 'json' | 'csv' = 'json') {
        if (format === 'csv') {
            return this.convertToCSV(this.auditLog);
        }
        return JSON.stringify(this.auditLog, null, 2);
    }

    // Private utility methods
    private static generateRequestId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `tv_${timestamp}_${random}`;
    }

    private static calculateAverageResponseTime(): number {
        const eventsWithDuration = this.auditLog.filter(log => log.duration);
        if (eventsWithDuration.length === 0) return 0;

        const totalDuration = eventsWithDuration.reduce((sum, log) => sum + (log.duration || 0), 0);
        return Math.round(totalDuration / eventsWithDuration.length);
    }

    private static calculateErrorRate(): number {
        if (this.auditLog.length === 0) return 0;

        const errorEvents = this.auditLog.filter(
            log => log.action === 'API_ERROR' || log.securityFlags?.includes('ERROR')
        );

        return Math.round((errorEvents.length / this.auditLog.length) * 100);
    }

    private static convertToCSV(data: SecurityAudit[]): string {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item =>
            Object.values(item).map(value =>
                typeof value === 'object' ? JSON.stringify(value) : String(value)
            ).join(',')
        );

        return [headers, ...rows].join('\n');
    }
}
