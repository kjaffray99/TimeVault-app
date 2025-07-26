/**
 * Customer Service Experience Hook
 * 
 * Provides customer service features to optimize user experience and engagement
 * Includes proactive support, feedback collection, and experience tracking
 */

import { useWallet } from '@thirdweb-dev/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomerExperienceService } from '../services/customerExperience';
import type { CustomerExperienceMetrics, UserFeedback } from '../types';

interface UseCustomerServiceOptions {
    enableProactiveSupport?: boolean;
    feedbackTriggers?: {
        onError?: boolean;
        onCompletion?: boolean;
        timeBasedInterval?: number; // minutes
        frictionThreshold?: number; // number of friction points
    };
    performanceTracking?: boolean;
}

interface CustomerServiceState {
    showFeedbackModal: boolean;
    feedbackTrigger?: 'completion' | 'error' | 'time_based' | 'manual' | 'proactive';
    feedbackContext?: any;
    metrics?: CustomerExperienceMetrics;
    hasProactiveSupport: boolean;
    sessionStartTime: number;
    lastActivityTime: number;
    frictionCount: number;
}

export const useCustomerService = (options: UseCustomerServiceOptions = {}) => {
    const {
        enableProactiveSupport = true,
        feedbackTriggers = {
            onError: true,
            onCompletion: true,
            timeBasedInterval: 10, // 10 minutes
            frictionThreshold: 3
        },
        performanceTracking = true
    } = options;

    const wallet = useWallet();
    const [userId, setUserId] = useState<string>('anonymous');
    const sessionStartRef = useRef(Date.now());
    const lastActivityRef = useRef(Date.now());
    const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get wallet address safely
    useEffect(() => {
        const getWalletAddress = async () => {
            if (wallet?.getAddress) {
                try {
                    const address = await wallet.getAddress();
                    setUserId(address || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                } catch (error) {
                    console.warn('Wallet address not available:', error);
                    setUserId(`anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                }
            } else {
                setUserId(`anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            }
        };

        getWalletAddress();
    }, [wallet]);

    const [state, setState] = useState<CustomerServiceState>({
        showFeedbackModal: false,
        hasProactiveSupport: enableProactiveSupport,
        sessionStartTime: sessionStartRef.current,
        lastActivityTime: lastActivityRef.current,
        frictionCount: 0
    });

    // Initialize customer experience tracking
    useEffect(() => {
        CustomerExperienceService.initialize();

        // Track session start
        CustomerExperienceService.trackUserJourney(userId, 'session_start', {
            timestamp: Date.now(),
            options: options
        });

        return () => {
            // Track session end
            CustomerExperienceService.trackUserJourney(userId, 'session_end', {
                timestamp: Date.now(),
                duration: Date.now() - sessionStartRef.current
            });
        };
    }, [userId]);

    // Track user activity and detect inactivity
    useEffect(() => {
        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            setState(prev => ({ ...prev, lastActivityTime: Date.now() }));
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, []);

    // Time-based feedback trigger
    useEffect(() => {
        if (feedbackTriggers.timeBasedInterval && feedbackTriggers.timeBasedInterval > 0) {
            feedbackTimeoutRef.current = setTimeout(() => {
                triggerFeedback('time_based', {
                    sessionDuration: Date.now() - sessionStartRef.current,
                    lastActivity: lastActivityRef.current
                });
            }, feedbackTriggers.timeBasedInterval * 60 * 1000);
        }

        return () => {
            if (feedbackTimeoutRef.current) {
                clearTimeout(feedbackTimeoutRef.current);
            }
        };
    }, [feedbackTriggers.timeBasedInterval]);

    // Track page/component actions
    const trackAction = useCallback((action: string, context?: any, success: boolean = true) => {
        const responseTime = context?.responseTime || 0;

        CustomerExperienceService.trackUserJourney(userId, action, {
            ...context,
            success,
            responseTime,
            timestamp: Date.now()
        });

        // Update friction count for proactive support
        if (!success || responseTime > 3000) {
            setState(prev => {
                const newFrictionCount = prev.frictionCount + 1;

                // Trigger proactive support if threshold reached
                if (enableProactiveSupport &&
                    newFrictionCount >= (feedbackTriggers.frictionThreshold || 3)) {
                    triggerFeedback('proactive', {
                        frictionCount: newFrictionCount,
                        lastFriction: { action, success, responseTime }
                    });
                }

                return { ...prev, frictionCount: newFrictionCount };
            });
        }

        // Auto-trigger feedback on errors
        if (!success && feedbackTriggers.onError) {
            setTimeout(() => {
                triggerFeedback('error', { action, context });
            }, 1000); // Slight delay to not interrupt error handling
        }

        lastActivityRef.current = Date.now();
    }, [userId, enableProactiveSupport, feedbackTriggers]);

    // Track performance metrics
    const trackPerformance = useCallback((operation: string, duration: number, success: boolean = true) => {
        if (!performanceTracking) return;

        trackAction(`performance_${operation}`, {
            responseTime: duration,
            success,
            category: 'performance'
        }, success);
    }, [trackAction, performanceTracking]);

    // Trigger feedback modal
    const triggerFeedback = useCallback((
        trigger: 'completion' | 'error' | 'time_based' | 'manual' | 'proactive',
        context?: any
    ) => {
        setState(prev => ({
            ...prev,
            showFeedbackModal: true,
            feedbackTrigger: trigger,
            feedbackContext: context
        }));

        CustomerExperienceService.trackUserJourney(userId, 'feedback_triggered', {
            trigger,
            context,
            timestamp: Date.now()
        });
    }, [userId]);

    // Close feedback modal
    const closeFeedbackModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            showFeedbackModal: false,
            feedbackTrigger: undefined,
            feedbackContext: undefined
        }));
    }, []);

    // Submit feedback
    const submitFeedback = useCallback((feedback: Omit<UserFeedback, 'userId' | 'timestamp' | 'processed'>) => {
        CustomerExperienceService.collectFeedback({
            ...feedback,
            userId,
            timestamp: Date.now(),
            processed: false
        });

        closeFeedbackModal();
    }, [userId, closeFeedbackModal]);

    // Trigger completion feedback
    const trackCompletion = useCallback((feature: string, context?: any) => {
        trackAction(`${feature}_completed`, context, true);

        if (feedbackTriggers.onCompletion) {
            // Delay feedback to let user enjoy the success moment
            setTimeout(() => {
                triggerFeedback('completion', { feature, context });
            }, 2000);
        }
    }, [trackAction, feedbackTriggers.onCompletion, triggerFeedback]);

    // Get current customer experience metrics
    const getMetrics = useCallback(() => {
        return CustomerExperienceService.calculateCustomerSatisfaction();
    }, []);

    // Manual feedback trigger (for help buttons, etc.)
    const requestFeedback = useCallback((context?: any) => {
        triggerFeedback('manual', context);
    }, [triggerFeedback]);

    // Create a performance wrapper for async operations
    const withPerformanceTracking = useCallback(<T,>(
        operation: string,
        asyncFn: () => Promise<T>
    ): Promise<T> => {
        const startTime = Date.now();

        return asyncFn()
            .then(result => {
                const duration = Date.now() - startTime;
                trackPerformance(operation, duration, true);
                return result;
            })
            .catch(error => {
                const duration = Date.now() - startTime;
                trackPerformance(operation, duration, false);
                throw error;
            });
    }, [trackPerformance]);

    // Engagement metrics
    const getEngagementMetrics = useCallback(() => {
        const sessionDuration = Date.now() - sessionStartRef.current;
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;

        return {
            sessionDuration: Math.round(sessionDuration / 1000), // seconds
            timeSinceLastActivity: Math.round(timeSinceLastActivity / 1000),
            frictionCount: state.frictionCount,
            isActive: timeSinceLastActivity < 30000, // Active if activity within 30 seconds
            engagementLevel: sessionDuration > 300000 ? 'high' : // 5+ minutes
                sessionDuration > 120000 ? 'medium' : // 2+ minutes  
                    'low'
        };
    }, [state.frictionCount]);

    // Proactive help trigger
    const offerHelp = useCallback((context?: any) => {
        if (!enableProactiveSupport) return;

        CustomerExperienceService.trackUserJourney(userId, 'proactive_help_offered', {
            context,
            metrics: getEngagementMetrics(),
            timestamp: Date.now()
        });

        // Could trigger help modal, chat widget, etc.
        triggerFeedback('proactive', {
            type: 'help_offer',
            ...context
        });
    }, [userId, enableProactiveSupport, getEngagementMetrics, triggerFeedback]);

    // Customer satisfaction score
    const getSatisfactionScore = useCallback(() => {
        return getMetrics().overallScore;
    }, [getMetrics]);

    return {
        // State
        showFeedbackModal: state.showFeedbackModal,
        feedbackTrigger: state.feedbackTrigger,
        feedbackContext: state.feedbackContext,
        hasProactiveSupport: state.hasProactiveSupport,

        // Actions
        trackAction,
        trackPerformance,
        trackCompletion,
        triggerFeedback,
        closeFeedbackModal,
        submitFeedback,
        requestFeedback,
        offerHelp,
        withPerformanceTracking,

        // Metrics
        getMetrics,
        getEngagementMetrics,
        getSatisfactionScore,

        // Utils
        isEngaged: getEngagementMetrics().engagementLevel !== 'low',
        frictionCount: state.frictionCount,
        sessionDuration: Date.now() - sessionStartRef.current
    };
};

export default useCustomerService;
