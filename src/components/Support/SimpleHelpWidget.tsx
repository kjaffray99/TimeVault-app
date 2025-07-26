/**
 * Simple Help Widget Component
 * 
 * Functional customer support widget with basic proactive features
 */

import React, { useEffect, useState } from 'react';
import { useCustomerService } from '../../hooks/useCustomerService';
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
}

export const HelpWidget: React.FC<HelpWidgetProps> = ({
    position = 'bottom-right',
    autoShow = true,
    context = 'general'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [helpOptions, setHelpOptions] = useState<HelpOption[]>([]);

    const {
        frictionCount,
        isEngaged,
        sessionDuration,
        trackAction
    } = useCustomerService();

    useEffect(() => {
        // Auto-show widget based on friction detection
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

        // Load help options
        loadHelpOptions();
    }, [frictionCount, isEngaged, sessionDuration, context, autoShow, trackAction]);

    const loadHelpOptions = () => {
        const options: HelpOption[] = [
            {
                id: 'quick_tutorial',
                title: 'Quick Tutorial',
                description: 'Get a quick walkthrough of this feature',
                icon: '🎯',
                action: () => startTutorial()
            },
            {
                id: 'faq',
                title: 'Frequently Asked Questions',
                description: 'Find answers to common questions',
                icon: '❓',
                action: () => showFAQ()
            },
            {
                id: 'video_help',
                title: 'Video Guide',
                description: 'Watch a step-by-step video tutorial',
                icon: '📹',
                action: () => openVideoGuide()
            },
            {
                id: 'contact_support',
                title: 'Contact Support',
                description: 'Chat with our customer service team',
                icon: '💬',
                action: () => contactSupport()
            },
            {
                id: 'feedback',
                title: 'Send Feedback',
                description: 'Tell us about your experience',
                icon: '📝',
                action: () => openFeedback()
            },
            {
                id: 'feature_request',
                title: 'Request Feature',
                description: 'Suggest new features or improvements',
                icon: '💡',
                action: () => requestFeature()
            }
        ];

        // Add context-specific options
        if (context === 'calculator') {
            options.unshift({
                id: 'calculator_help',
                title: 'Calculator Help',
                description: 'Learn how to use the conversion calculator',
                icon: '🧮',
                action: () => showCalculatorHelp()
            });
        } else if (context === 'dashboard') {
            options.unshift({
                id: 'dashboard_help',
                title: 'Dashboard Guide',
                description: 'Explore dashboard features and tabs',
                icon: '📊',
                action: () => showDashboardHelp()
            });
        } else if (context === 'wallet') {
            options.unshift({
                id: 'wallet_help',
                title: 'Wallet Connection',
                description: 'Get help connecting your wallet',
                icon: '👛',
                action: () => showWalletHelp()
            });
        }

        setHelpOptions(options);
    };

    const startTutorial = () => {
        trackAction('tutorial_started', { context });
        console.log('Starting tutorial for:', context);
        setIsOpen(false);
    };

    const showFAQ = () => {
        trackAction('faq_opened', { context });
        console.log('Opening FAQ for:', context);
        setIsOpen(false);
    };

    const openVideoGuide = () => {
        trackAction('video_guide_opened', { context });
        window.open('https://youtube.com/timevault-tutorials', '_blank');
        setIsOpen(false);
    };

    const contactSupport = () => {
        trackAction('support_contact_initiated', {
            context,
            frictionCount
        });
        console.log('Contacting support for:', context);
        setIsOpen(false);
    };

    const openFeedback = () => {
        trackAction('feedback_modal_opened', { context });
        setShowFeedback(true);
        setIsOpen(false);
    };

    const requestFeature = () => {
        trackAction('feature_request_initiated', { context });
        console.log('Opening feature request for:', context);
        setIsOpen(false);
    };

    const showCalculatorHelp = () => {
        trackAction('calculator_help_opened', { context });
        console.log('Showing calculator help');
        setIsOpen(false);
    };

    const showDashboardHelp = () => {
        trackAction('dashboard_help_opened', { context });
        console.log('Showing dashboard help');
        setIsOpen(false);
    };

    const showWalletHelp = () => {
        trackAction('wallet_help_opened', { context });
        console.log('Showing wallet help');
        setIsOpen(false);
    };

    const toggleWidget = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        if (newIsOpen) {
            trackAction('help_widget_opened', { context });
        } else {
            trackAction('help_widget_closed', { context });
        }
    };

    const getFrictionIndicator = () => {
        if (frictionCount > 5) return { color: 'critical', icon: '🚨' };
        if (frictionCount > 3) return { color: 'warning', icon: '⚠️' };
        if (frictionCount > 1) return { color: 'caution', icon: '💭' };
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
                    {frictionCount > 3 && (
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
                            {frictionCount > 3 && (
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
                />
            )}
        </>
    );
};

export default HelpWidget;
