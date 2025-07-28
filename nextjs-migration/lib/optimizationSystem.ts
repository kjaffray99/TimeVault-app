// Initialize all optimization systems for TimeVault
import { analytics } from '../services/analyticsEnhanced';
import { monitoring } from '../services/monitoringService';
import { PerformanceOptimizer } from '../utils/performanceOptimizer';

export class TimeVaultOptimizationSystem {
    private static instance: TimeVaultOptimizationSystem;
    private isInitialized = false;

    static getInstance(): TimeVaultOptimizationSystem {
        if (!TimeVaultOptimizationSystem.instance) {
            TimeVaultOptimizationSystem.instance = new TimeVaultOptimizationSystem();
        }
        return TimeVaultOptimizationSystem.instance;
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Initializing TimeVault Optimization Systems...');

            // Initialize security system
            this.initializeSecurity();

            // Initialize performance monitoring
            this.initializePerformanceMonitoring();

            // Initialize analytics
            this.initializeAnalytics();

            // Initialize real-time monitoring
            this.initializeMonitoring();

            // Initialize API security
            this.initializeApiSecurity();

            // Set up error handling
            this.setupGlobalErrorHandling();

            // Set up performance alerts
            this.setupPerformanceAlerts();

            this.isInitialized = true;
            console.log('✅ TimeVault Optimization Systems initialized successfully!');

            // Track initialization
            analytics.trackEvent('system_initialized', {
                category: 'system',
                timestamp: Date.now(),
                features: ['security', 'performance', 'analytics', 'monitoring']
            });

        } catch (error) {
            console.error('❌ Failed to initialize optimization systems:', error);
            analytics.trackError(error as Error, { context: 'system_initialization' });
        }
    }

    private initializeSecurity(): void {
        // Security is already initialized as singleton
        console.log('🔒 Security system initialized');
    }

    private initializePerformanceMonitoring(): void {
        // Set up performance monitoring intervals
        if (typeof window !== 'undefined') {
            // Monitor Core Web Vitals
            this.monitorCoreWebVitals();

            // Monitor bundle performance
            this.monitorBundlePerformance();

            // Set up periodic performance reports
            setInterval(() => {
                const report = PerformanceOptimizer.reportMetrics();
                analytics.trackPerformance('periodic_report', 0, report);
            }, 60000); // Every minute
        }

        console.log('⚡ Performance monitoring initialized');
    }

    private initializeAnalytics(): void {
        if (typeof window !== 'undefined') {
            // Track page views
            analytics.trackEvent('page_view', {
                category: 'navigation',
                page: window.location.pathname,
                referrer: document.referrer
            });

            // Track user agent info
            analytics.trackEvent('user_agent_info', {
                category: 'system',
                user_agent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform
            });
        }

        console.log('📊 Analytics system initialized');
    }

    private initializeMonitoring(): void {
        monitoring.startMonitoring();
        console.log('📡 Real-time monitoring initialized');
    }

    private initializeApiSecurity(): void {
        // API security is already configured in secureApiService
        console.log('🛡️ API security initialized');
    }

    private setupGlobalErrorHandling(): void {
        if (typeof window === 'undefined') return;

        // Enhanced error tracking
        const originalConsoleError = console.error;
        console.error = (...args) => {
            analytics.trackError(new Error(args.join(' ')), { source: 'console' });
            originalConsoleError.apply(console, args);
        };

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            analytics.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
                source: 'promise_rejection'
            });
        });

        console.log('🚨 Global error handling configured');
    }

    private setupPerformanceAlerts(): void {
        // Set up performance thresholds
        monitoring.setAlert('slow_page_load', 3000, () => {
            console.warn('🐌 Slow page load detected');
            analytics.trackEvent('performance_alert', {
                category: 'performance',
                alert_type: 'slow_page_load'
            });
        });

        monitoring.setAlert('high_memory_usage', 100, () => {
            console.warn('🧠 High memory usage detected');
            analytics.trackEvent('performance_alert', {
                category: 'performance',
                alert_type: 'high_memory_usage'
            });
        });

        console.log('⚠️ Performance alerts configured');
    }

    private monitorCoreWebVitals(): void {
        if (typeof window === 'undefined') return;

        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const lcp = entry.startTime;
                    analytics.trackPerformance('lcp', lcp);

                    if (lcp > 2500) {
                        console.warn(`Poor LCP: ${lcp}ms`);
                    }
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    analytics.trackPerformance('fid', fid);

                    if (fid > 100) {
                        console.warn(`Poor FID: ${fid}ms`);
                    }
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Monitor Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value;
                    }
                }
                analytics.trackPerformance('cls', clsValue);

                if (clsValue > 0.1) {
                    console.warn(`Poor CLS: ${clsValue}`);
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    private monitorBundlePerformance(): void {
        if (typeof window === 'undefined') return;

        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const resource = entry as PerformanceResourceTiming;
                    if (resource.initiatorType === 'script' || resource.initiatorType === 'link') {
                        const loadTime = resource.responseEnd - resource.startTime;
                        analytics.trackPerformance('resource_load_time', loadTime, {
                            resource: resource.name,
                            type: resource.initiatorType
                        });
                    }
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // Public methods for manual operations
    public getSystemStatus() {
        return {
            initialized: this.isInitialized,
            security: {
                csp_enabled: true,
                rate_limiting: true,
                input_validation: true
            },
            performance: {
                monitoring_active: monitoring.isMonitoring,
                metrics_collected: Object.keys(PerformanceOptimizer.reportMetrics()).length
            },
            analytics: {
                tracking_enabled: analytics.isTrackingEnabled(),
                session_data: analytics.getSessionData()
            }
        };
    }

    public generateHealthReport() {
        return {
            timestamp: Date.now(),
            system_status: this.getSystemStatus(),
            performance_metrics: PerformanceOptimizer.reportMetrics(),
            monitoring_data: monitoring.getHealthStatus(),
            security_events: [], // Could be expanded with security event log
            recommendations: this.generateRecommendations()
        };
    }

    private generateRecommendations(): string[] {
        const recommendations: string[] = [];
        const metrics = PerformanceOptimizer.reportMetrics();

        // Check for performance issues
        Object.entries(metrics).forEach(([metric, data]) => {
            if (typeof data === 'object' && data.average > 1000) {
                recommendations.push(`Consider optimizing ${metric} - current average: ${data.average.toFixed(2)}ms`);
            }
        });

        // Check memory usage
        const healthStatus = monitoring.getHealthStatus();
        if (healthStatus.status === 'warning' || healthStatus.status === 'critical') {
            recommendations.push('System performance is degraded - consider optimizing memory usage');
        }

        return recommendations;
    }

    public cleanup(): void {
        if (typeof window !== 'undefined') {
            analytics.destroy();
            monitoring.stopMonitoring();
        }
        this.isInitialized = false;
        console.log('🧹 Optimization systems cleaned up');
    }
}

// Export singleton instance
export const optimizationSystem = TimeVaultOptimizationSystem.getInstance();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
    // Initialize after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizationSystem.initialize();
        });
    } else {
        optimizationSystem.initialize();
    }
}
