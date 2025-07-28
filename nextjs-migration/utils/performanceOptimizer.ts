// Performance optimization utilities for Next.js
export class PerformanceOptimizer {
    private static metrics = new Map<string, number[]>();

    // Measure synchronous operations
    static measureOperation<T>(name: string, operation: () => T): T {
        const start = performance.now();
        const result = operation();
        const duration = performance.now() - start;

        this.recordMetric(name, duration);

        // Log slow operations
        if (duration > 100) {
            console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        }

        return result;
    }

    // Measure asynchronous operations
    static async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
        const start = performance.now();
        const result = await operation();
        const duration = performance.now() - start;

        this.recordMetric(name, duration);

        if (duration > 500) {
            console.warn(`Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
        }

        return result;
    }

    // Record performance metrics
    private static recordMetric(name: string, value: number): void {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const values = this.metrics.get(name)!;
        values.push(value);

        // Keep only last 50 values
        if (values.length > 50) {
            values.shift();
        }
    }

    // Get performance report
    static reportMetrics(): Record<string, any> {
        const result: Record<string, any> = {};

        this.metrics.forEach((values, name) => {
            if (values.length > 0) {
                result[name] = {
                    current: values[values.length - 1],
                    average: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    count: values.length
                };
            }
        });

        // Add computed metrics
        result.averageResponseTime = result.api_response_time?.average || 0;
        result.totalOperations = Object.values(result).reduce((sum: number, metric: any) => sum + (metric.count || 0), 0);

        return result;
    }
}

// Memory optimization utilities
export const optimizeMemory = {
    // Debounce function calls
    debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    },

    // Throttle function calls
    throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func.apply(null, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, delay);
            }
        };
    },

    // Memoize function results
    memoize<T extends (...args: any[]) => any>(func: T): T {
        const cache = new Map();
        return ((...args: Parameters<T>) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(null, args);
            cache.set(key, result);
            return result;
        }) as T;
    },

    // Clean up memory leaks
    cleanup: {
        intervals: new Set<NodeJS.Timeout>(),
        listeners: new Map<EventTarget, { event: string; handler: EventListener }[]>(),

        addInterval(id: NodeJS.Timeout): void {
            this.intervals.add(id);
        },

        addListener(target: EventTarget, event: string, handler: EventListener): void {
            if (!this.listeners.has(target)) {
                this.listeners.set(target, []);
            }
            this.listeners.get(target)!.push({ event, handler });
            target.addEventListener(event, handler);
        },

        cleanupAll(): void {
            // Clear intervals
            this.intervals.forEach(id => clearInterval(id));
            this.intervals.clear();

            // Remove listeners
            this.listeners.forEach((listeners, target) => {
                listeners.forEach(({ event, handler }) => {
                    target.removeEventListener(event, handler);
                });
            });
            this.listeners.clear();
        },

        // Enhanced debounce function
        debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
            let timeout: NodeJS.Timeout;
            return ((...args: any[]) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            }) as T;
        },

        // Enhanced throttle function
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
        }
    }
};
