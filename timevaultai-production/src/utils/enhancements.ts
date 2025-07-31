/**
 * 🔧 IMMEDIATE ENHANCEMENT IMPLEMENTATION
 * Critical optimizations based on deployment testing
 */

// Service Worker for offline functionality
'use client';

const CACHE_NAME = 'timevault-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

export function registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registered:', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content available, notify user
                                showUpdateNotification();
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        });
    }
}

function showUpdateNotification() {
    if (typeof window !== 'undefined') {
        const notification = document.createElement('div');
        notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #D4AF37;
        color: #001F3F;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: system-ui;
        font-weight: 600;
      ">
        🚀 New features available! 
        <button onclick="window.location.reload()" style="
          margin-left: 12px;
          background: #001F3F;
          color: #D4AF37;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        ">Update</button>
      </div>
    `;
        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }
}

// Google Analytics 4 Integration
export function initializeAnalytics() {
    if (typeof window !== 'undefined') {
        // Load Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }

        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'TimeVault Crypto Calculator',
            page_location: window.location.href
        });

        // Track calculator usage
        gtag('event', 'page_view', {
            event_category: 'engagement',
            event_label: 'calculator_load'
        });
    }
}

// Enhanced Performance Monitoring
export function initializePerformanceMonitoring() {
    if (typeof window !== 'undefined') {
        // Core Web Vitals tracking
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
        }).catch(() => {
            console.log('Web Vitals not available');
        });

        // Custom performance metrics
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const navEntry = entry as PerformanceNavigationTiming;
                    trackPerformanceMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart);
                    trackPerformanceMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart);
                }
            }
        });

        observer.observe({ entryTypes: ['navigation'] });
    }
}

function sendToAnalytics(metric: any) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
            event_category: 'web_vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
        });
    }
}

function trackPerformanceMetric(name: string, value: number) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
            name: name,
            value: Math.round(value)
        });
    }
}

// Dark Mode Implementation
export function initializeDarkMode() {
    if (typeof window !== 'undefined') {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('timevault-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('timevault-theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }
}

export function toggleDarkMode() {
    if (typeof window !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('timevault-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('timevault-theme', 'dark');
        }

        // Track theme change
        if (window.gtag) {
            window.gtag('event', 'theme_change', {
                event_category: 'ui_interaction',
                event_label: isDark ? 'light' : 'dark'
            });
        }
    }
}

// Real-time User Engagement Tracking
export function trackUserEngagement() {
    if (typeof window !== 'undefined') {
        let startTime = Date.now();
        let isActive = true;
        let totalEngagementTime = 0;

        // Track active time
        const trackActiveTime = () => {
            if (isActive) {
                totalEngagementTime += Date.now() - startTime;
                startTime = Date.now();
            }
        };

        // User activity detection
        const resetActiveTimer = () => {
            isActive = true;
            startTime = Date.now();
        };

        const setInactive = () => {
            if (isActive) {
                trackActiveTime();
                isActive = false;
            }
        };

        // Event listeners
        document.addEventListener('mousedown', resetActiveTimer);
        document.addEventListener('mousemove', resetActiveTimer);
        document.addEventListener('keypress', resetActiveTimer);
        document.addEventListener('scroll', resetActiveTimer);
        document.addEventListener('touchstart', resetActiveTimer);

        // Track when user becomes inactive
        let inactivityTimer: NodeJS.Timeout;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(setInactive, 30000); // 30 seconds
        };

        document.addEventListener('mousedown', resetInactivityTimer);
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        document.addEventListener('scroll', resetInactivityTimer);
        document.addEventListener('touchstart', resetInactivityTimer);

        resetInactivityTimer();

        // Send engagement data before page unload
        window.addEventListener('beforeunload', () => {
            trackActiveTime();
            if (window.gtag && totalEngagementTime > 5000) { // Only track if more than 5 seconds
                window.gtag('event', 'engagement_time', {
                    event_category: 'user_engagement',
                    value: Math.round(totalEngagementTime / 1000) // Convert to seconds
                });
            }
        });
    }
}

// Revenue Conversion Tracking
export function trackConversion(type: 'premium_view' | 'premium_click' | 'signup' | 'payment', value?: number) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
            event_category: 'revenue',
            event_label: type,
            value: value || 0
        });

        // Enhanced ecommerce tracking for payments
        if (type === 'payment' && value) {
            window.gtag('event', 'purchase', {
                transaction_id: `txn_${Date.now()}`,
                value: value,
                currency: 'USD',
                items: [{
                    item_id: 'premium_subscription',
                    item_name: 'TimeVault Premium',
                    category: 'subscription',
                    price: value
                }]
            });
        }
    }
}

// Initialize all enhancements
export function initializeEnhancements() {
    registerServiceWorker();
    initializeAnalytics();
    initializePerformanceMonitoring();
    initializeDarkMode();
    trackUserEngagement();
}

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default {
    registerServiceWorker,
    initializeAnalytics,
    initializePerformanceMonitoring,
    initializeDarkMode,
    toggleDarkMode,
    trackUserEngagement,
    trackConversion,
    initializeEnhancements
};
