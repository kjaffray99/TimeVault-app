/**
 * Help Widget Component
 * 
 * Proactive customer support widget that appears based on user behavior
 * Provides contextual help and escalation to customer service
 */

import React, { useEffect, useState } from 'react';
import { useCustomerService } from '../../hooks/useCustomerService';
import { getContextualHelp, triggerSupportEvent } from '../../utils/supportEvents';
import { FeedbackModal } from '../Feedback/FeedbackModal';
import './HelpWidget.css';

interface HelpWidgetProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    autoShow?: boolean;
    context?: string;
}

interface HelpOption {
    id: string;
    title: string;
    description: string;
    icon: string;
    action: () => void;
    priority: number;
}

export const HelpWidget: React.FC<HelpWidgetProps> = ({
    position = 'bottom-right',
    autoShow = true,
    context = 'general'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentHelp, setCurrentHelp] = useState<string | null>(null);
    const [helpOptions, setHelpOptions] = useState<HelpOption[]>([]);

    const {
        frictionCount,
        isEngaged,
        sessionDuration,
        trackAction,
        offerHelp,
        getEngagementMetrics
    } = useCustomerService(); useEffect(() => {
        // Auto-show widget based on friction detection
        const engagementMetrics = getEngagementMetrics();

        if (autoShow && frictionCount > 3) {
            setIsOpen(true);
            trackAction('proactive_help_shown', {
                frictionCount,
                context,
                trigger: 'auto_friction_detection'
            });
        }

        // Auto-show after extended time without engagement
        if (autoShow && sessionDuration > 180000 && !isEngaged) { // 3 minutes
            setIsOpen(true);
            trackAction('proactive_help_shown', {
                sessionDuration,
                context,
                trigger: 'low_engagement'
            });
        }

        // Load contextual help options
        loadHelpOptions();
    }, [frictionCount, isEngaged, sessionDuration, context, autoShow, getEngagementMetrics, trackAction]);

    const loadHelpOptions = async () => {
        const contextualHelp = await getContextualHelp(context);
        const options: HelpOption[] = [
            {
                id: 'quick_tutorial',
                title: 'Quick Tutorial',
                description: 'Get a quick walkthrough of this feature',
                icon: '🎯',
                action: () => startTutorial(),
                priority: contextualHelp.tutorialRecommended ? 10 : 5
            },
            {
                id: 'faq',
                title: 'Frequently Asked Questions',
                description: 'Find answers to common questions',
                icon: '❓',
                action: () => showFAQ(),
                priority: 8
            },
            {
                id: 'video_help',
                title: 'Video Guide',
                description: 'Watch a step-by-step video tutorial',
                icon: '📹',
                action: () => openVideoGuide(),
                priority: 7
            },
            {
                id: 'contact_support',
                title: 'Contact Support',
                description: 'Chat with our customer service team',
                icon: '💬',
                action: () => contactSupport(),
                priority: contextualHelp.supportRecommended ? 10 : 3
            },
            {
                id: 'feedback',
                title: 'Send Feedback',
                description: 'Tell us about your experience',
                icon: '📝',
                action: () => openFeedback(),
                priority: 6
            },
            {
                id: 'feature_request',
                title: 'Request Feature',
                description: 'Suggest new features or improvements',
                icon: '💡',
                action: () => requestFeature(),
                priority: 4
            }
        ];

        // Add context-specific options
        if (context === 'calculator') {
            options.push({
                id: 'calculator_help',
                title: 'Calculator Help',
                description: 'Learn how to use the conversion calculator',
                icon: '🧮',
                action: () => showCalculatorHelp(),
                priority: 9
            });
        } else if (context === 'dashboard') {
            options.push({
                id: 'dashboard_help',
                title: 'Dashboard Guide',
                description: 'Explore dashboard features and tabs',
                icon: '📊',
                action: () => showDashboardHelp(),
                priority: 9
            });
        } else if (context === 'wallet') {
            options.push({
                id: 'wallet_help',
                title: 'Wallet Connection',
                description: 'Get help connecting your wallet',
                icon: '👛',
                action: () => showWalletHelp(),
                priority: 9
            });
        }

        // Sort by priority and contextual relevance
        const sortedOptions = options.sort((a, b) => b.priority - a.priority);
        setHelpOptions(sortedOptions);
    };

    const startTutorial = () => {
        triggerSupportEvent('tutorial_started', { context });
        setCurrentHelp('tutorial');
        // Implementation would integrate with tour/tutorial system
        console.log('Starting tutorial for:', context);
        setIsOpen(false);
    };

    const showFAQ = () => {
        triggerSupportEvent('faq_opened', { context });
        setCurrentHelp('faq');
        // Implementation would open FAQ modal or navigate to FAQ page
        console.log('Opening FAQ for:', context);
        setIsOpen(false);
    };

    const openVideoGuide = () => {
        triggerSupportEvent('video_guide_opened', { context });
        // Implementation would open video modal or navigate to video page
        window.open('https://youtube.com/timevault-tutorials', '_blank');
        setIsOpen(false);
    };

    const contactSupport = () => {
        triggerSupportEvent('support_contact_initiated', {
            context,
            frictionLevel,
            engagementScore
        });
        // Implementation would open chat widget or support form
        console.log('Contacting support for:', context);
        setIsOpen(false);
    };

    const openFeedback = () => {
        triggerSupportEvent('feedback_modal_opened', { context });
        setShowFeedback(true);
        setIsOpen(false);
    };

    const requestFeature = () => {
        triggerSupportEvent('feature_request_initiated', { context });
        // Implementation would open feature request form
        console.log('Opening feature request for:', context);
        setIsOpen(false);
    };

    const showCalculatorHelp = () => {
        triggerSupportEvent('calculator_help_opened', {});
        setCurrentHelp('calculator_guide');
        // Implementation would show calculator-specific help
        console.log('Showing calculator help');
        setIsOpen(false);
    };

    const showDashboardHelp = () => {
        triggerSupportEvent('dashboard_help_opened', {});
        setCurrentHelp('dashboard_guide');
        // Implementation would show dashboard-specific help
        console.log('Showing dashboard help');
        setIsOpen(false);
    };

    const showWalletHelp = () => {
        triggerSupportEvent('wallet_help_opened', {});
        setCurrentHelp('wallet_guide');
        // Implementation would show wallet connection help
        console.log('Showing wallet help');
        setIsOpen(false);
    };

    const toggleWidget = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        if (newIsOpen) {
            triggerSupportEvent('help_widget_opened', { context });
        } else {
            triggerSupportEvent('help_widget_closed', { context });
        }
    };

    const getFrictionIndicator = () => {
        if (frictionLevel > 0.7) return { color: 'critical', icon: '🚨' };
        if (frictionLevel > 0.5) return { color: 'warning', icon: '⚠️' };
        if (frictionLevel > 0.3) return { color: 'caution', icon: '💭' };
        return { color: 'normal', icon: '💬' };
    };

    const frictionIndicator = getFrictionIndicator();

    return (
        <>
            <div className={`help-widget help-widget--${position}`}>
                {/* Main Widget Button */}
                <button
                    className={`help-widget__trigger help-widget__trigger--${frictionIndicator.color}`}
                    onClick={toggleWidget}
                    aria-label="Open help widget"
                    title={isOpen ? 'Close help' : 'Get help'}
                >
                    {isOpen ? '✕' : frictionIndicator.icon}
                    {frictionLevel > 0.5 && (
                        <div className="help-widget__pulse"></div>
                    )}
                </button>

                {/* Widget Panel */}
                {isOpen && (
                    <div className="help-widget__panel">
                        <header className="help-widget__header">
                            <h3>How can we help?</h3>
                            <button
                                className="help-widget__close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close help widget"
                            >
                                ✕
                            </button>
                        </header>

                        <div className="help-widget__content">
                            {frictionLevel > 0.5 && (
                                <div className="help-widget__alert">
                                    <span className="help-widget__alert-icon">🤔</span>
                                    <p>
                                        We noticed you might be having trouble.
                                        We're here to help!
                                    </p>
                                </div>
                            )}

                            <div className="help-widget__options">
                                {helpOptions.slice(0, 6).map((option) => (
                                    <button
                                        key={option.id}
                                        className="help-widget__option"
                                        onClick={option.action}
                                    >
                                        <span className="help-widget__option-icon">
                                            {option.icon}
                                        </span>
                                        <div className="help-widget__option-content">
                                            <h4>{option.title}</h4>
                                            <p>{option.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="help-widget__footer">
                                <p>
                                    Need immediate assistance?
                                    <button
                                        className="help-widget__link"
                                        onClick={contactSupport}
                                    >
                                        Contact our support team
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback Modal */}
            {showFeedback && (
                <FeedbackModal
                    isOpen={showFeedback}
                    onClose={() => setShowFeedback(false)}
                    context={context}
                    trigger="help_widget"
                />
            )}
        </>
    );
};

export default HelpWidget;
