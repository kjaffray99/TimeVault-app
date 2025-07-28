import { analytics } from './analyticsEnhanced';

export class MonitoringService {
    private readonly metrics = new Map<string, number[]>();
    private readonly alerts = new Map<string, { threshold: number; callback: () => void }>();
    public isMonitoring = false;

    startMonitoring(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.initializeMonitoring();
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
    }

    private monitorPerformance(): void {
        // Monitor page load times
        if (typeof window !== 'undefined') {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.recordMetric('page_load_time', loadTime);

                if (loadTime > 3000) {
                    this.triggerAlert('slow_page_load', loadTime);
                }
            });

            // Monitor API response times using performance observer
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            const navEntry = entry as PerformanceNavigationTiming;
                            this.recordMetric('navigation_time', navEntry.loadEventEnd - navEntry.fetchStart);
                        }
                    }
                });

                observer.observe({ entryTypes: ['navigation'] });
            }
        }
    }

    private monitorErrors(): void {
        if (typeof window === 'undefined') return;

        window.addEventListener('error', (event) => {
            this.recordMetric('javascript_errors', 1);
            analytics.trackError(new Error(event.message), {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.recordMetric('promise_rejections', 1);
            analytics.trackError(new Error(String(event.reason)), {
                type: 'unhandled_promise_rejection'
            });
        });
    }

    private monitorUserBehavior(): void {
        if (typeof window === 'undefined') return;

        // Monitor user engagement
        let engagementStart = Date.now();
        let isEngaged = true;

        const resetEngagement = () => {
            if (isEngaged) {
                const engagementTime = Date.now() - engagementStart;
                this.recordMetric('engagement_duration', engagementTime);
            }
            engagementStart = Date.now();
            isEngaged = true;
        };

        // Simple throttle function
        const throttle = (func: () => void, limit: number) => {
            let inThrottle: boolean;
            return () => {
                if (!inThrottle) {
                    func();
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        // Track user activity
        ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, throttle(resetEngagement, 1000));
        });

        // Detect user idle
        setInterval(() => {
            if (Date.now() - engagementStart > 30000 && isEngaged) {
                isEngaged = false;
                this.recordMetric('user_idle_events', 1);
            }
        }, 5000);
    }

    private monitorResources(): void {
        if (typeof window === 'undefined') return;

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = this.monitorMemory();
                if (memory) {
                    this.recordMetric('memory_usage', memory.used);

                    if (memory.used > memory.limit * 0.8) {
                        this.triggerAlert('high_memory_usage', memory.used);
                    }
                }
            }, 10000);
        }

        // Monitor network connection
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            this.recordMetric('network_downlink', connection.downlink || 0);

            connection.addEventListener('change', () => {
                this.recordMetric('network_change_events', 1);
                analytics.trackEvent('network_change', {
                    category: 'performance',
                    downlink: connection.downlink,
                    effectiveType: connection.effectiveType
                });
            });
        }
    }

    private recordMetric(name: string, value: number): void {
        const existing = this.metrics.get(name) || [];
        existing.push(value);

        // Keep only last 100 measurements
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
            value
        });
    }

    setAlert(alertType: string, threshold: number, callback: () => void): void {
        this.alerts.set(alertType, { threshold, callback });
    }

    getMetrics(): Record<string, number[]> {
        const result: Record<string, number[]> = {};
        for (const [key, value] of this.metrics.entries()) {
            result[key] = value;
        }
        return result;
    }

    getAverageMetric(name: string): number {
        const values = this.metrics.get(name) || [];
        return values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
    }

    // Health check method
    getHealthStatus() {
        const memoryUsage = this.getAverageMetric('memory_usage');
        const loadTime = this.getAverageMetric('page_load_time');
        const errorRate = this.getAverageMetric('javascript_errors');

        return {
            status: this.calculateHealthStatus(memoryUsage, loadTime, errorRate),
            metrics: {
                memory_usage: memoryUsage,
                page_load_time: loadTime,
                error_rate: errorRate
            },
            timestamp: Date.now()
        };
    }

    private calculateHealthStatus(memory: number, loadTime: number, errors: number): string {
        if (memory > 100 || loadTime > 5000 || errors > 5) return 'critical';
        if (memory > 50 || loadTime > 3000 || errors > 2) return 'warning';
        return 'healthy';
    }

    stopMonitoring(): void {
        this.isMonitoring = false;
        // Clean up any intervals or observers here
    }

    // Memory monitoring utility
    private monitorMemory() {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576),
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
}

export const monitoring = new MonitoringService();
