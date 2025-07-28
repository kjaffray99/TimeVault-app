import { optimizeMemory } from '../utils/performanceOptimizer';
import { analytics } from './analyticsEnhanced';

export class MonitoringService {
    private readonly metrics = new Map<string, number[]>();
    private readonly alerts = new Map<string, { threshold: number; callback: () => void }>();
    public isMonitoring = false;
    private monitoringIntervals: NodeJS.Timeout[] = [];

    startMonitoring(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.initializeMonitoring();
        console.log('🔍 TimeVault monitoring started');
    }

    stopMonitoring(): void {
        this.isMonitoring = false;
        this.monitoringIntervals.forEach(interval => clearInterval(interval));
        this.monitoringIntervals = [];
        console.log('🔍 TimeVault monitoring stopped');
    }

    private initializeMonitoring(): void {
        // Performance monitoring
        this.monitorPerformance();

        // Error monitoring
        this.monitorErrors();

        // User behavior monitoring
        this.monitorUserBehavior();

        // Resource monitoring
        this.monitorResources();

        // Network monitoring
        this.monitorNetwork();
    }

    private monitorPerformance(): void {
        // Monitor page load times
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.recordMetric('page_load_time', loadTime);

                if (loadTime > 3000) {
                    this.triggerAlert('slow_page_load', loadTime);
                }

                analytics.trackPerformance('page_load_time', loadTime);
            });
        }

        // Monitor navigation timing
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const navEntry = entry as PerformanceNavigationTiming;
                    this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
                    this.recordMetric('first_paint', navEntry.responseEnd - navEntry.requestStart);
                }
            }
        });

        if ('PerformanceObserver' in window) {
            observer.observe({ entryTypes: ['navigation'] });
        }

        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = performance.now();
            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - start;

                this.recordMetric('api_response_time', duration);

                if (duration > 5000) {
                    this.triggerAlert('slow_api_response', duration);
                }

                analytics.trackPerformance('api_response_time', duration, {
                    url: args[0]?.toString().replace(/[?&].*/, ''), // Remove query params
                    status: response.status
                });

                return response;
            } catch (error) {
                const duration = performance.now() - start;
                this.recordMetric('api_error', 1);
                analytics.trackError(error as Error, {
                    context: 'fetch_request',
                    url: args[0]?.toString(),
                    duration
                });
                throw error;
            }
        };
    }

    private monitorErrors(): void {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.recordMetric('javascript_errors', 1);
            analytics.trackError(new Error(event.message), {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                type: 'javascript_error'
            });
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.recordMetric('promise_rejections', 1);
            analytics.trackError(new Error(String(event.reason)), {
                type: 'unhandled_promise_rejection'
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.recordMetric('resource_errors', 1);
                analytics.trackError(new Error('Resource loading failed'), {
                    resource: (event.target as any)?.src || (event.target as any)?.href,
                    type: 'resource_error'
                });
            }
        }, true);
    }

    private monitorUserBehavior(): void {
        let engagementStart = Date.now();
        let isEngaged = true;
        let idleTimeoutId: NodeJS.Timeout;

        const resetEngagement = () => {
            if (isEngaged) {
                const engagementTime = Date.now() - engagementStart;
                this.recordMetric('engagement_duration', engagementTime);
            }
            engagementStart = Date.now();
            isEngaged = true;

            // Clear existing idle timeout
            clearTimeout(idleTimeoutId);

            // Set new idle timeout
            idleTimeoutId = setTimeout(() => {
                if (isEngaged) {
                    isEngaged = false;
                    this.recordMetric('user_idle_events', 1);
                    analytics.trackEngagement('user_idle', Date.now() - engagementStart);
                }
            }, 30000);
        };

        // Track user activity with throttling
        const throttledReset = optimizeMemory.throttle(resetEngagement, 1000);

        ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach(event => {
            document.addEventListener(event, throttledReset, { passive: true });
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.recordMetric('page_hidden', 1);
                analytics.trackEngagement('page_hidden', Date.now() - engagementStart);
            } else {
                this.recordMetric('page_visible', 1);
                analytics.trackEngagement('page_visible');
                resetEngagement();
            }
        });
    }

    private monitorResources(): void {
        // Monitor memory usage
        if ('memory' in performance) {
            const memoryInterval = setInterval(() => {
                const memory = optimizeMemory.monitorMemory();
                if (memory) {
                    this.recordMetric('memory_usage', memory.used);

                    if (memory.used > memory.limit * 0.8) {
                        this.triggerAlert('high_memory_usage', memory.used);
                    }

                    analytics.trackPerformance('memory_usage', memory.used, {
                        total: memory.total,
                        limit: memory.limit
                    });
                }
            }, 10000);

            this.monitoringIntervals.push(memoryInterval);
        }

        // Monitor storage usage
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const storageInterval = setInterval(async () => {
                try {
                    const estimate = await navigator.storage.estimate();
                    if (estimate.usage && estimate.quota) {
                        const usagePercent = (estimate.usage / estimate.quota) * 100;
                        this.recordMetric('storage_usage_percent', usagePercent);

                        if (usagePercent > 80) {
                            this.triggerAlert('high_storage_usage', usagePercent);
                        }
                    }
                } catch (error) {
                    console.warn('Failed to estimate storage:', error);
                }
            }, 30000);

            this.monitoringIntervals.push(storageInterval);
        }
    }

    private monitorNetwork(): void {
        // Monitor network connection
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;

            const recordNetworkInfo = () => {
                this.recordMetric('network_downlink', connection.downlink || 0);
                analytics.trackEvent('network_info', {
                    category: 'performance',
                    downlink: connection.downlink,
                    effectiveType: connection.effectiveType,
                    rtt: connection.rtt
                });
            };

            recordNetworkInfo();

            connection.addEventListener('change', () => {
                this.recordMetric('network_change_events', 1);
                recordNetworkInfo();
            });
        }

        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.recordMetric('online_events', 1);
            analytics.trackEvent('network_online', { category: 'connectivity' });
        });

        window.addEventListener('offline', () => {
            this.recordMetric('offline_events', 1);
            analytics.trackEvent('network_offline', { category: 'connectivity' });
        });
    }

    recordMetric(name: string, value: number): void {
        const existing = this.metrics.get(name) || [];
        existing.push(value);

        // Keep only last 100 measurements to prevent memory issues
        if (existing.length > 100) {
            existing.shift();
        }

        this.metrics.set(name, existing);
    }

    private triggerAlert(alertType: string, value: number): void {
        const alert = this.alerts.get(alertType);
        if (alert && value > alert.threshold) {
            alert.callback();
        }

        // Send alert to analytics
        analytics.trackEvent('performance_alert', {
            category: 'monitoring',
            alert_type: alertType,
            value,
            severity: this.getAlertSeverity(alertType, value)
        });

        console.warn(`🚨 Performance Alert: ${alertType} = ${value}`);
    }

    private getAlertSeverity(alertType: string, value: number): 'low' | 'medium' | 'high' | 'critical' {
        switch (alertType) {
            case 'slow_page_load':
                if (value > 10000) return 'critical';
                if (value > 5000) return 'high';
                if (value > 3000) return 'medium';
                return 'low';

            case 'high_memory_usage':
                if (value > 200) return 'critical';
                if (value > 150) return 'high';
                if (value > 100) return 'medium';
                return 'low';

            default:
                return 'medium';
        }
    }

    setAlert(alertType: string, threshold: number, callback: () => void): void {
        this.alerts.set(alertType, { threshold, callback });
    }

    getMetrics(): Record<string, number[]> {
        return Object.fromEntries(this.metrics);
    }

    getAverageMetric(name: string): number {
        const values = this.metrics.get(name) || [];
        return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
    }

    getMetricSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
        const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};

        for (const [name, values] of this.metrics) {
            if (values.length > 0) {
                summary[name] = {
                    avg: values.reduce((a, b) => a + b) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    count: values.length
                };
            }
        }

        return summary;
    }

    // Health check
    getSystemHealth(): SystemHealth {
        const metrics = this.getMetricSummary();
        const issues: string[] = [];

        // Check performance metrics
        if (metrics.page_load_time?.avg > 3000) {
            issues.push('Slow page load times');
        }

        if (metrics.memory_usage?.avg > 100) {
            issues.push('High memory usage');
        }

        if (metrics.javascript_errors?.count > 0) {
            issues.push('JavaScript errors detected');
        }

        const healthScore = Math.max(0, 100 - (issues.length * 20));

        return {
            score: healthScore,
            status: healthScore > 80 ? 'healthy' : healthScore > 60 ? 'warning' : 'critical',
            issues,
            lastCheck: new Date().toISOString(),
            metrics
        };
    }

    // Clear metrics for fresh start
    clearMetrics(): void {
        this.metrics.clear();
    }
}

interface SystemHealth {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    lastCheck: string;
    metrics: Record<string, { avg: number; min: number; max: number; count: number }>;
}

export const monitoring = new MonitoringService();
