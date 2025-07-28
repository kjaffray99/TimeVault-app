import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { analytics } from '../services/analyticsEnhanced';
import { monitoring } from '../services/monitoringService';
import '../styles/day1-app.css';
import '../styles/gamification.css';
import '../styles/globals.css';

// Create optimized QueryClient for SSR
function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 5 * 60 * 1000, // 5 minutes
                staleTime: 30 * 1000, // 30 seconds
                retry: 2,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
            mutations: {
                retry: 1,
            },
        },
    });
}

export default function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => createQueryClient());

    // Performance monitoring initialization
    useEffect(() => {
        // Initialize analytics and monitoring in client
        if (typeof window !== 'undefined') {
            try {
                // Initialize monitoring system
                monitoring.startMonitoring();

                // Set up performance alerts
                monitoring.setAlert('slow_page_load', 3000, () => {
                    analytics.trackEvent('performance_alert', {
                        category: 'performance',
                        alert_type: 'slow_page_load'
                    });
                });

                // Track app initialization
                analytics.trackEvent('app_initialized', {
                    category: 'app_lifecycle',
                    timestamp: Date.now(),
                    version: '2.0-nextjs'
                });

                console.log('✅ TimeVault optimization systems initialized');
            } catch (error) {
                console.error('❌ Failed to initialize optimization systems:', error);
            }
        }

        // Cleanup on unmount
        return () => {
            if (typeof window !== 'undefined') {
                monitoring.stopMonitoring();
                analytics.destroy();
            }
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
}
