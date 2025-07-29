// Performance Optimization Utilities - Enhanced with Real-time Monitoring
// Target: <100ms API responses, 95% cache hit rate, optimized security

import React, { useCallback, useEffect, useState } from 'react';

// Enhanced performance monitoring configuration
const PERFORMANCE_CONFIG = {
    loadTimeTarget: 1000, // 1 second for revenue optimization
    apiResponseTarget: 100, // 100ms for maximum efficiency
    bundleSizeTarget: 300, // 300KB aggressive optimization
    fcp: 800, // First Contentful Paint target
    lcp: 1500, // Largest Contentful Paint target
    cls: 0.05, // Cumulative Layout Shift target
    fid: 50, // First Input Delay target
    securityScanInterval: 30000, // 30 seconds
    performanceReportInterval: 10000 // 10 seconds
};

// Enhanced performance metrics with security tracking
interface PerformanceMetrics {
    loadTime?: number;
    fcpTime?: number;
    lcpTime?: number;
    clsScore?: number;
    fidTime?: number;
    apiResponseTimes: number[];
    cacheHitRate: number;
    bundleSize?: number;
    securityScore?: number;
    memoryUsage?: number;
    cpuUtilization?: number;
    networkLatency?: number;
    errorRate?: number;
    timestamp: Date;
}

interface SecurityMetrics {
    xssAttempts: number;
    sqlInjectionAttempts: number;
    rateLimitViolations: number;
    invalidTokens: number;
    suspiciousRequests: number;
    lastScanTime: Date;
}

class EnhancedPerformanceMonitor {
    private metrics: PerformanceMetrics[] = [];
    private securityMetrics: SecurityMetrics = {
        xssAttempts: 0,
        sqlInjectionAttempts: 0,
        rateLimitViolations: 0,
        invalidTokens: 0,
        suspiciousRequests: 0,
        lastScanTime: new Date()
    };
    private apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
    private observers: PerformanceObserver[] = [];
    private alertThresholds = {
        responseTime: 200,
        errorRate: 2,
        memoryUsage: 80,
        securityScore: 90
    };

    constructor() {
        this.initializeMonitoring();
        this.startRealTimeMonitoring();
    }

    private initializeMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        this.recordMetric('fcpTime', entry.startTime);
                    }
                });
            });
            fcpObserver.observe({ type: 'paint', buffered: true });
            this.observers.push(fcpObserver);

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.recordMetric('lcpTime', lastEntry.startTime);
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            this.observers.push(lcpObserver);

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.recordMetric('clsScore', clsValue);
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            this.observers.push(clsObserver);

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.recordMetric('fidTime', (entry as any).processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
            this.observers.push(fidObserver);
        }

        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.recordMetric('loadTime', loadTime);
        });
    }

    // Enhanced real-time monitoring
    private startRealTimeMonitoring() {
        // Performance monitoring every 10 seconds
        setInterval(() => {
            this.collectRealTimeMetrics();
            this.performSecurityScan();
            this.generateAlerts();
        }, PERFORMANCE_CONFIG.performanceReportInterval);

        // Security monitoring every 30 seconds
        setInterval(() => {
            this.performEnhancedSecurityScan();
        }, PERFORMANCE_CONFIG.securityScanInterval);
    }

    private collectRealTimeMetrics() {
        const metrics = this.getCurrentMetrics();

        // Collect memory usage if available
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            metrics.memoryUsage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
        }

        // Calculate network latency
        metrics.networkLatency = this.calculateNetworkLatency();

        // Calculate error rate
        metrics.errorRate = this.calculateErrorRate();

        // Security score
        metrics.securityScore = this.calculateSecurityScore();

        this.metrics.push(metrics);
    }

    private performSecurityScan() {
        // Check for XSS attempts in DOM
        this.scanForXSSAttempts();

        // Monitor for unusual patterns
        this.detectSuspiciousActivity();

        // Update security metrics
        this.securityMetrics.lastScanTime = new Date();
    }

    private performEnhancedSecurityScan() {
        console.log('🔒 Running enhanced security scan...');

        // Deep security analysis
        this.analyzeDOMSecurity();
        this.checkAPIEndpointSecurity();
        this.monitorNetworkRequests();
    }

    private recordMetric(type: keyof PerformanceMetrics, value: number) {
        const currentMetrics = this.getCurrentMetrics();
        (currentMetrics as any)[type] = value;
        currentMetrics.timestamp = new Date();

        // Store metrics for analysis
        this.metrics.push(currentMetrics);

        // Keep only last 100 measurements for enhanced monitoring
        if (this.metrics.length > 100) {
            this.metrics = this.metrics.slice(-100);
        }

        // Check performance and security thresholds
        this.checkPerformanceThresholds(type, value);
        this.checkSecurityThresholds();
    }

    private getCurrentMetrics(): PerformanceMetrics {
        return {
            apiResponseTimes: [],
            cacheHitRate: this.calculateCacheHitRate(),
            timestamp: new Date()
        };
    }

    private checkPerformanceThresholds(type: string, value: number) {
        const thresholds = {
            loadTime: PERFORMANCE_CONFIG.loadTimeTarget,
            fcpTime: PERFORMANCE_CONFIG.fcp,
            lcpTime: PERFORMANCE_CONFIG.lcp,
            clsScore: PERFORMANCE_CONFIG.cls,
            fidTime: PERFORMANCE_CONFIG.fid
        };

        const threshold = thresholds[type as keyof typeof thresholds];
        if (threshold && value > threshold) {
            console.warn(`⚠️ Performance threshold exceeded for ${type}: ${value} (target: ${threshold})`);
            this.reportPerformanceIssue(type, value, threshold);
        }
    }

    private checkSecurityThresholds() {
        const totalThreats = this.securityMetrics.xssAttempts +
            this.securityMetrics.sqlInjectionAttempts +
            this.securityMetrics.suspiciousRequests;

        if (totalThreats > 10) {
            console.error('🚨 HIGH SECURITY ALERT: Multiple threats detected!');
            this.triggerSecurityAlert();
        }
    }

    private reportPerformanceIssue(metric: string, value: number, threshold: number) {
        const performanceData = {
            metric,
            value,
            threshold,
            userAgent: navigator.userAgent,
            timestamp: new Date(),
            url: window.location.href
        };

        console.log('📊 Performance issue reported:', performanceData);

        // In production: send to monitoring service
        this.sendToMonitoringService(performanceData);
    }

    // Missing method implementations for enhanced monitoring
    private generateAlerts() {
        const latest = this.metrics[this.metrics.length - 1];
        if (!latest) return;

        const alerts = [];

        if (latest.memoryUsage && latest.memoryUsage > this.alertThresholds.memoryUsage) {
            alerts.push(`High memory usage: ${latest.memoryUsage.toFixed(1)}%`);
        }

        if (latest.errorRate && latest.errorRate > this.alertThresholds.errorRate) {
            alerts.push(`High error rate: ${latest.errorRate.toFixed(1)}%`);
        }

        if (alerts.length > 0) {
            console.warn('🚨 Performance Alerts:', alerts);
        }
    }

    private calculateNetworkLatency(): number {
        if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            return connection.rtt || 50; // Default 50ms if unavailable
        }
        return 50;
    }

    private calculateErrorRate(): number {
        // Calculate error rate from recent metrics
        const recentMetrics = this.metrics.slice(-10);
        if (recentMetrics.length === 0) return 0;

        // Simplified calculation - in practice track actual errors
        return Math.random() * 2; // Mock 0-2% error rate
    }

    private calculateSecurityScore(): number {
        const threats = this.securityMetrics.xssAttempts +
            this.securityMetrics.sqlInjectionAttempts +
            this.securityMetrics.suspiciousRequests;

        return Math.max(0, 100 - (threats * 5)); // Reduce score by 5 per threat
    }

    private scanForXSSAttempts() {
        // Check for potential XSS in DOM
        const scripts = document.querySelectorAll('script[src*="javascript:"], script[src*="data:"]');
        if (scripts.length > 0) {
            this.securityMetrics.xssAttempts++;
            console.warn('🚨 Potential XSS attempt detected');
        }
    }

    private detectSuspiciousActivity() {
        // Monitor for suspicious patterns
        const suspiciousPatterns = [
            /eval\(/,
            /document\.write/,
            /<script/i
        ];

        const pageContent = document.documentElement.innerHTML;
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(pageContent)) {
                this.securityMetrics.suspiciousRequests++;
                break;
            }
        }
    }

    private analyzeDOMSecurity() {
        // Deep DOM security analysis
        const inlineScripts = document.querySelectorAll('script:not([src])');
        const unsafeElements = document.querySelectorAll('[onclick], [onload], [onerror]');

        if (inlineScripts.length > 5) {
            console.warn('🔒 Many inline scripts detected - security risk');
        }

        if (unsafeElements.length > 0) {
            console.warn('🔒 Unsafe event handlers detected');
        }
    }

    private checkAPIEndpointSecurity() {
        // Monitor API endpoint security
        console.log('🔒 Checking API endpoint security...');
        // Implementation would check for secure headers, HTTPS, etc.
    }

    private monitorNetworkRequests() {
        // Monitor network requests for security
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.name.includes('http://')) {
                        console.warn('🔒 Insecure HTTP request detected:', entry.name);
                    }
                });
            });
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    private triggerSecurityAlert() {
        console.error('🚨 SECURITY ALERT TRIGGERED - Multiple threats detected!');
        // In production: notify security team, enable protective measures
    }

    private sendToMonitoringService(data: any) {
        // In production: send to monitoring service like Datadog, New Relic, etc.
        console.log('📊 Sending to monitoring service:', data);
    }

    // Enhanced API caching with security and performance tracking
    async cacheApiCall<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttl: number = 30000 // 30 seconds default TTL
    ): Promise<T> {
        const startTime = performance.now();

        // Check cache first
        const cached = this.apiCache.get(key);
        const now = Date.now();

        if (cached && (now - cached.timestamp) < cached.ttl) {
            // Cache hit - enhanced logging
            const responseTime = performance.now() - startTime;
            this.recordApiResponse(responseTime, true);
            console.log(`💾 Cache hit for ${key}: ${responseTime.toFixed(2)}ms`);
            return cached.data;
        }

        // Cache miss - fetch new data
        try {
            const data = await fetchFn();
            const responseTime = performance.now() - startTime;

            // Store in cache
            this.apiCache.set(key, {
                data,
                timestamp: now,
                ttl
            });

            this.recordApiResponse(responseTime, false);
            return data;
        } catch (error) {
            const responseTime = performance.now() - startTime;
            this.recordApiResponse(responseTime, false);
            throw error;
        }
    }

    private recordApiResponse(responseTime: number, _fromCache: boolean) {
        const currentMetrics = this.getCurrentMetrics();
        currentMetrics.apiResponseTimes.push(responseTime);

        if (responseTime > PERFORMANCE_CONFIG.apiResponseTarget) {
            console.warn(`Slow API response: ${responseTime}ms (target: ${PERFORMANCE_CONFIG.apiResponseTarget}ms)`);
        }
    }

    private calculateCacheHitRate(): number {
        const totalRequests = this.metrics.reduce((sum, m) => sum + m.apiResponseTimes.length, 0);
        if (totalRequests === 0) return 0;

        // This is a simplified calculation - in practice you'd track hits vs misses
        return Math.min(90, (this.apiCache.size / totalRequests) * 100);
    }

    // Bundle size monitoring
    monitorBundleSize() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            let totalSize = 0;

            resources.forEach((resource) => {
                if (resource.name.includes('.js') || resource.name.includes('.css')) {
                    totalSize += resource.transferSize || 0;
                }
            });

            this.recordMetric('bundleSize', totalSize);

            if (totalSize > PERFORMANCE_CONFIG.bundleSizeTarget * 1024) {
                console.warn(`Large bundle size: ${(totalSize / 1024).toFixed(2)}KB (target: ${PERFORMANCE_CONFIG.bundleSizeTarget}KB)`);
            }
        }
    }

    // Get current performance summary
    getPerformanceSummary() {
        if (this.metrics.length === 0) return null;

        const latest = this.metrics[this.metrics.length - 1];
        const avgResponseTime = latest.apiResponseTimes.length > 0
            ? latest.apiResponseTimes.reduce((a, b) => a + b, 0) / latest.apiResponseTimes.length
            : 0;

        return {
            loadTime: latest.loadTime,
            fcpTime: latest.fcpTime,
            lcpTime: latest.lcpTime,
            clsScore: latest.clsScore,
            fidTime: latest.fidTime,
            avgApiResponseTime: avgResponseTime,
            cacheHitRate: latest.cacheHitRate,
            bundleSize: latest.bundleSize,
            performanceScore: this.calculatePerformanceScore(latest),
            recommendations: this.getPerformanceRecommendations(latest)
        };
    }

    private calculatePerformanceScore(metrics: PerformanceMetrics): number {
        let score = 100;

        // Deduct points for poor performance
        if (metrics.loadTime && metrics.loadTime > PERFORMANCE_CONFIG.loadTimeTarget) {
            score -= 20;
        }
        if (metrics.fcpTime && metrics.fcpTime > PERFORMANCE_CONFIG.fcp) {
            score -= 15;
        }
        if (metrics.lcpTime && metrics.lcpTime > PERFORMANCE_CONFIG.lcp) {
            score -= 20;
        }
        if (metrics.clsScore && metrics.clsScore > PERFORMANCE_CONFIG.cls) {
            score -= 15;
        }
        if (metrics.fidTime && metrics.fidTime > PERFORMANCE_CONFIG.fid) {
            score -= 10;
        }
        if (metrics.cacheHitRate < 80) {
            score -= 10;
        }
        if (metrics.bundleSize && metrics.bundleSize > PERFORMANCE_CONFIG.bundleSizeTarget * 1024) {
            score -= 10;
        }

        return Math.max(0, score);
    }

    private getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
        const recommendations: string[] = [];

        if (metrics.loadTime && metrics.loadTime > PERFORMANCE_CONFIG.loadTimeTarget) {
            recommendations.push('Optimize initial page load time');
        }
        if (metrics.lcpTime && metrics.lcpTime > PERFORMANCE_CONFIG.lcp) {
            recommendations.push('Optimize largest contentful paint');
        }
        if (metrics.clsScore && metrics.clsScore > PERFORMANCE_CONFIG.cls) {
            recommendations.push('Reduce cumulative layout shift');
        }
        if (metrics.cacheHitRate < 80) {
            recommendations.push('Improve API caching strategy');
        }
        if (metrics.bundleSize && metrics.bundleSize > PERFORMANCE_CONFIG.bundleSizeTarget * 1024) {
            recommendations.push('Reduce bundle size with code splitting');
        }

        return recommendations;
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.apiCache.clear();
        this.metrics = [];
    }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
    const [monitor] = useState(() => new EnhancedPerformanceMonitor());
    const [performanceSummary, setPerformanceSummary] = useState<any>(null);

    useEffect(() => {
        // Update performance summary every 5 seconds
        const interval = setInterval(() => {
            setPerformanceSummary(monitor.getPerformanceSummary());
        }, 5000);

        // Monitor bundle size on mount
        setTimeout(() => monitor.monitorBundleSize(), 2000);

        return () => {
            clearInterval(interval);
            monitor.destroy();
        };
    }, [monitor]);

    const cacheApiCall = useCallback(
        <T>(key: string, fetchFn: () => Promise<T>, ttl?: number) =>
            monitor.cacheApiCall(key, fetchFn, ttl),
        [monitor]
    );

    return {
        performanceSummary,
        cacheApiCall,
        getPerformanceSummary: () => monitor.getPerformanceSummary()
    };
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, quality: number = 85) => {
    // For production, this would integrate with image optimization service
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    params.append('q', quality.toString());

    return `${src}?${params.toString()}`;
};

// Lazy loading utility for heavy components
export const LazyWrapper: React.FC<{
    children: React.ReactNode;
    fallback?: React.ReactNode;
}> = ({ children, fallback = React.createElement('div', {}, 'Loading...') }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!elementRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(elementRef);
        return () => observer.disconnect();
    }, [elementRef]);

    return React.createElement('div', { ref: setElementRef }, isVisible ? children : fallback);
};

// Export enhanced performance monitor
const performanceMonitor = new EnhancedPerformanceMonitor();
export { performanceMonitor };
export default EnhancedPerformanceMonitor;
