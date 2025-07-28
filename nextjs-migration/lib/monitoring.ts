// Simple throttle function for browser compatibility
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, delay);
        }
    };
};

export class MonitoringService {
    private readonly metrics = new Map<string, number[]>();
    private readonly alerts = new Map<string, { threshold: number; callback: () => void }>();
    public isMonitoring = false;
    private monitoringIntervals: NodeJS.Timeout[] = [];

    startMonitoring(): void {
        if (this.isMonitoring || typeof window === 'undefined') return;

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
        if (typeof window === 'undefined') return;

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
        if (typeof window === 'undefined') return;

        // Monitor page load times
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.recordMetric('page_load_time', loadTime);

                if (loadTime > 3000) {
                    this.triggerAlert('slow_page_load', loadTime);
                }
            });
        }

        // Monitor FPS and frame drops
        let lastFrameTime = performance.now();
        let frameCount = 0;
        let frameTimes: number[] = [];

        const monitorFrame = () => {
            const currentTime = performance.now();
            const frameTime = currentTime - lastFrameTime;
            frameCount++;

            frameTimes.push(frameTime);
            if (frameTimes.length > 60) frameTimes.shift(); // Keep last 60 frames

            // Calculate average FPS every second
            if (frameCount % 60 === 0) {
                const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                const fps = 1000 / avgFrameTime;
                this.recordMetric('fps', fps);

                if (fps < 30) {
                    this.triggerAlert('low_fps', fps);
                }
            }

            lastFrameTime = currentTime;
            requestAnimationFrame(monitorFrame);
        };

        requestAnimationFrame(monitorFrame);
    }

    private monitorErrors(): void {
        if (typeof window === 'undefined') return;

        window.addEventListener('error', (event) => {
            this.recordMetric('js_errors', 1);
            console.error('JS Error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.recordMetric('promise_rejections', 1);
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }

    private monitorUserBehavior(): void {
        if (typeof window === 'undefined') return;

        // Monitor click interactions
        document.addEventListener('click', throttle((event: Event) => {
            const target = event.target as HTMLElement;
            this.recordMetric('user_clicks', 1);

            // Track specific interactions
            if (target.closest('.nav-tab')) {
                this.recordMetric('tab_switches', 1);
            }
            if (target.closest('.calculator-btn')) {
                this.recordMetric('calculator_usage', 1);
            }
        }, 100));

        // Monitor scroll behavior
        window.addEventListener('scroll', throttle(() => {
            this.recordMetric('scroll_events', 1);
        }, 200));
    }

    private monitorResources(): void {
        if (typeof window === 'undefined') return;

        const interval = setInterval(() => {
            // Memory usage monitoring
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100;
                this.recordMetric('memory_usage', memoryUsage);

                if (memoryUsage > 80) {
                    this.triggerAlert('high_memory_usage', memoryUsage);
                }
            }

            // DOM node count
            const nodeCount = document.querySelectorAll('*').length;
            this.recordMetric('dom_nodes', nodeCount);

            if (nodeCount > 1000) {
                this.triggerAlert('high_dom_count', nodeCount);
            }
        }, 10000); // Every 10 seconds

        this.monitoringIntervals.push(interval);
    }

    private monitorNetwork(): void {
        if (typeof window === 'undefined') return;

        // Monitor network requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = endTime - startTime;

                this.recordMetric('api_response_time', duration);
                this.recordMetric('api_requests', 1);

                if (duration > 5000) {
                    this.triggerAlert('slow_api_response', duration);
                }

                return response;
            } catch (error) {
                this.recordMetric('api_errors', 1);
                throw error;
            }
        };
    }

    recordMetric(name: string, value: number): void {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const values = this.metrics.get(name)!;
        values.push(value);

        // Keep only last 100 values to prevent memory issues
        if (values.length > 100) {
            values.shift();
        }
    }

    setAlert(name: string, threshold: number, callback: () => void): void {
        this.alerts.set(name, { threshold, callback });
    }

    private triggerAlert(name: string, value: number): void {
        const alert = this.alerts.get(name);
        if (alert && value > alert.threshold) {
            alert.callback();
        }
    }

    getMetrics(): Record<string, any> {
        const result: Record<string, any> = {};

        // Convert Map entries to array for compatibility
        const entries = Array.from(this.metrics.entries());

        for (const [name, values] of entries) {
            if (values.length > 0) {
                result[name] = {
                    current: values[values.length - 1],
                    average: values.reduce((a: number, b: number) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    count: values.length
                };
            }
        }

        return result;
    }

    generateReport(): string {
        const metrics = this.getMetrics();
        const report = ['🔍 TimeVault Performance Report', ''];

        for (const [name, data] of Object.entries(metrics)) {
            report.push(`${name}: Current ${data.current}, Avg ${data.average.toFixed(2)}`);
        }

        return report.join('\\n');
    }
}

export const monitoring = new MonitoringService();
