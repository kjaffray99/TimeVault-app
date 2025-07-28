import { lazy } from 'react';

// Lazy load heavy components
export const LazyPersonalTimeCalculator = lazy(() =>
    import('../components/PersonalTimeCalculator').then(module => ({
        default: module.PersonalTimeCalculator
    }))
);

export const LazyEducationalQuiz = lazy(() =>
    import('../components/EducationalQuiz').then(module => ({
        default: module.EducationalQuiz
    }))
);

export const LazyPremiumFeatures = lazy(() =>
    Promise.resolve({ default: () => React.createElement('div', null, 'Premium Features Coming Soon') })
);

// Performance monitoring utilities
export class PerformanceOptimizer {
    private static metrics: Map<string, number[]> = new Map();

    static measureOperation<T>(name: string, operation: () => T): T {
        const start = performance.now();
        const result = operation();
        const end = performance.now();

        const duration = end - start;
        const existing = this.metrics.get(name) || [];
        existing.push(duration);
        this.metrics.set(name, existing.slice(-100)); // Keep last 100 measurements

        // Log slow operations
        if (duration > 100) {
            console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        }

        return result;
    }

    static async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
        const start = performance.now();
        const result = await operation();
        const end = performance.now();

        const duration = end - start;
        const existing = this.metrics.get(name) || [];
        existing.push(duration);
        this.metrics.set(name, existing.slice(-100));

        if (duration > 500) {
            console.warn(`Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
        }

        return result;
    }

    static getAverageTime(name: string): number {
        const times = this.metrics.get(name) || [];
        return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
    }

    static reportMetrics() {
        const report: Record<string, number> = {};
        for (const [name] of this.metrics) {
            report[name] = this.getAverageTime(name);
        }

        // Send to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'performance_report', {
                'event_category': 'performance',
                'custom_parameters': report
            });
        }

        return report;
    }

    static clearMetrics() {
        this.metrics.clear();
    }

    static getMetrics(): Map<string, number[]> {
        return new Map(this.metrics);
    }
}

// Memory optimization utilities
export const optimizeMemory = {
    // Debounced function creator
    debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
        let timeout: NodeJS.Timeout;
        return ((...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        }) as T;
    },

    // Throttled function creator
    throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
        let inThrottle: boolean;
        return ((...args: any[]) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }) as T;
    },

    // Memory usage monitoring
    monitorMemory() {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576),
                total: Math.round(memory.totalJSHeapSize / 1048576),
                limit: Math.round(memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    },

    // Cleanup function for component unmounting
    cleanup: {
        intervals: new Set<NodeJS.Timeout>(),
        timeouts: new Set<NodeJS.Timeout>(),
        eventListeners: new Map<EventTarget, Array<{ type: string; listener: EventListener }>>(),

        addInterval(interval: NodeJS.Timeout) {
            this.intervals.add(interval);
            return interval;
        },

        addTimeout(timeout: NodeJS.Timeout) {
            this.timeouts.add(timeout);
            return timeout;
        },

        addEventListener(target: EventTarget, type: string, listener: EventListener) {
            target.addEventListener(type, listener);

            if (!this.eventListeners.has(target)) {
                this.eventListeners.set(target, []);
            }
            this.eventListeners.get(target)!.push({ type, listener });
        },

        clearAll() {
            // Clear intervals
            this.intervals.forEach(interval => clearInterval(interval));
            this.intervals.clear();

            // Clear timeouts
            this.timeouts.forEach(timeout => clearTimeout(timeout));
            this.timeouts.clear();

            // Remove event listeners
            this.eventListeners.forEach((listeners, target) => {
                listeners.forEach(({ type, listener }) => {
                    target.removeEventListener(type, listener);
                });
            });
            this.eventListeners.clear();
        }
    }
};

// Component optimization helpers
export const componentOptimization = {
    // Memoization helper for expensive calculations
    memoize<T extends (...args: any[]) => any>(fn: T): T {
        const cache = new Map();

        return ((...args: any[]) => {
            const key = JSON.stringify(args);

            if (cache.has(key)) {
                return cache.get(key);
            }

            const result = fn(...args);
            cache.set(key, result);

            // Limit cache size
            if (cache.size > 100) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }

            return result;
        }) as T;
    },

    // Shallow comparison for React.memo
    shallowEqual(obj1: any, obj2: any): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    },

    // Bundle size analyzer
    analyzeBundleSize() {
        if (typeof window !== 'undefined') {
            const scripts = Array.from(document.scripts);
            const totalSize = scripts.reduce((total, script) => {
                if (script.src) {
                    // Estimate size based on script presence
                    return total + 1;
                }
                return total;
            }, 0);

            return {
                scriptCount: scripts.length,
                estimatedSize: totalSize * 50, // Rough estimate in KB
                recommendations: this.getBundleOptimizationRecommendations(totalSize)
            };
        }
        return null;
    },

    getBundleOptimizationRecommendations(size: number): string[] {
        const recommendations: string[] = [];

        if (size > 10) {
            recommendations.push('Consider code splitting for large components');
        }

        if (size > 20) {
            recommendations.push('Implement tree shaking to remove unused code');
        }

        if (size > 30) {
            recommendations.push('Use dynamic imports for non-critical features');
        }

        return recommendations;
    }
};

// Performance monitoring hook for React components
export function usePerformanceMonitoring(componentName: string) {
    const startTime = performance.now();

    // Monitor component mount time
    React.useEffect(() => {
        const mountTime = performance.now() - startTime;
        PerformanceOptimizer.measureOperation(`${componentName}_mount`, () => mountTime);

        return () => {
            const unmountTime = performance.now();
            PerformanceOptimizer.measureOperation(`${componentName}_unmount`, () => unmountTime - startTime);
        };
    }, [componentName, startTime]);

    // Monitor render time
    React.useEffect(() => {
        const renderTime = performance.now() - startTime;
        PerformanceOptimizer.measureOperation(`${componentName}_render`, () => renderTime);
    });
}

// Import React for the hook
import React from 'react';
