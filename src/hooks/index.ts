/**
 * Custom React Hooks for TimeVault
 * Reusable hooks for common functionality
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ========================================
// DEBOUNCE HOOK
// ========================================

/**
 * Debounces a value to limit rapid updates
 * Useful for search inputs and API calls
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// ========================================
// LOCAL STORAGE HOOK
// ========================================

/**
 * Manages localStorage with React state synchronization
 * Automatically handles JSON serialization and error handling
 */
export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
    // Get initial value from localStorage or use provided initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            // Save to localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

// ========================================
// PREVIOUS VALUE HOOK
// ========================================

/**
 * Returns the previous value of a state or prop
 * Useful for animations and transitions
 */
export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

// ========================================
// INTERSECTION OBSERVER HOOK
// ========================================

/**
 * Detects when an element enters/exits the viewport
 * Useful for lazy loading and scroll animations
 */
export const useIntersectionObserver = (
    elementRef: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => setEntry(entry),
            options
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [elementRef, options.threshold, options.root, options.rootMargin]);

    return entry;
};

// ========================================
// WINDOW SIZE HOOK
// ========================================

/**
 * Tracks window size changes
 * Useful for responsive design logic
 */
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

// ========================================
// CLICK OUTSIDE HOOK
// ========================================

/**
 * Detects clicks outside of a referenced element
 * Useful for closing modals and dropdowns
 */
export const useClickOutside = (
    ref: React.RefObject<HTMLElement>,
    handler: () => void
): void => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

// ========================================
// ANALYTICS HOOK
// ========================================

/**
 * Analytics Hook for Revenue Tracking
 * Tracks user interactions for conversion optimization
 */

interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
}

interface UseAnalyticsReturn {
    track: (event: string, properties?: Record<string, any>) => void;
    identify: (userId: string, traits?: Record<string, any>) => void;
    page: (name: string, properties?: Record<string, any>) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
    const track = useCallback((event: string, properties?: Record<string, any>) => {
        const analyticsEvent: AnalyticsEvent = {
            event,
            properties: {
                timestamp: new Date().toISOString(),
                url: typeof window !== 'undefined' ? window.location.href : '',
                userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
                ...properties,
            },
        };

        // Log to console for development
        console.log('📊 Analytics Event:', analyticsEvent);

        // Store in localStorage for development tracking
        if (typeof window !== 'undefined') {
            const events = JSON.parse(localStorage.getItem('timevault_analytics') || '[]');
            events.push(analyticsEvent);

            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }

            localStorage.setItem('timevault_analytics', JSON.stringify(events));
        }

        // TODO: Integration with real analytics services
        // Google Analytics 4, Mixpanel, PostHog, etc.
    }, []);

    const identify = useCallback((userId: string, traits?: Record<string, any>) => {
        const identifyEvent = {
            userId,
            traits: {
                timestamp: new Date().toISOString(),
                ...traits,
            },
        };

        console.log('👤 User Identified:', identifyEvent);

        // Store user info for analytics
        if (typeof window !== 'undefined') {
            localStorage.setItem('timevault_user_id', userId);
            if (traits) {
                localStorage.setItem('timevault_user_traits', JSON.stringify(traits));
            }
        }
    }, []);

    const page = useCallback((name: string, properties?: Record<string, any>) => {
        const pageEvent = {
            name,
            properties: {
                timestamp: new Date().toISOString(),
                url: typeof window !== 'undefined' ? window.location.href : '',
                path: typeof window !== 'undefined' ? window.location.pathname : '',
                referrer: typeof window !== 'undefined' ? document.referrer : '',
                ...properties,
            },
        };

        console.log('📄 Page View:', pageEvent);

        // Store page views
        if (typeof window !== 'undefined') {
            const pageViews = JSON.parse(localStorage.getItem('timevault_page_views') || '[]');
            pageViews.push(pageEvent);

            // Keep only last 50 page views
            if (pageViews.length > 50) {
                pageViews.splice(0, pageViews.length - 50);
            }

            localStorage.setItem('timevault_page_views', JSON.stringify(pageViews));
        }
    }, []);

    return {
        track,
        identify,
        page,
    };
};
