/**
 * Fixed Help Widget Component
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

export const HelpWidget: React.FC<HelpWidgetProps> = ({
    position = 'bottom-right',
    autoShow = true,
    context = 'general'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [helpOptions, setHelpOptions] = useState<string[]>([]);

    const {
        frictionCount,
        isEngaged,
        sessionDuration,
        trackAction,
        getEngagementMetrics
    } = useCustomerService();

    // Convert frictionCount to frictionLevel for compatibility
    const frictionLevel = Math.min(frictionCount / 10, 1); // Normalize to 0-1 scale
    const engagementScore = isEngaged ? 0.8 : 0.2;

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

        // Load contextual help
        loadContextualHelp();
    }, [frictionCount, isEngaged, sessionDuration, context, autoShow, trackAction]);

    const loadContextualHelp = async () => {
        try {
            const contextualHelp = await getContextualHelp(context);
            setHelpOptions(contextualHelp);
        } catch (error) {
            console.warn('Failed to load contextual help:', error);
            setHelpOptions([
                'Need help? Contact our support team',
                'Check our FAQ section for common questions',
                'Watch tutorial videos for step-by-step guidance'
            ]);
        }
    };

    const startTutorial = () => {
        triggerSupportEvent('tutorial_started', { context });
        console.log('Starting tutorial for:', context);
        setIsOpen(false);
    };

    const showFAQ = () => {
        triggerSupportEvent('faq_opened', { context });
        console.log('Opening FAQ for:', context);
        setIsOpen(false);
    };

    const openVideoGuide = () => {
        triggerSupportEvent('video_guide_opened', { context });
        window.open('https://youtube.com/timevault-tutorials', '_blank');
        setIsOpen(false);
    };

    const contactSupport = () => {
        triggerSupportEvent('support_contact_initiated', {
            context,
            frictionLevel,
            engagementScore
        });
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
        console.log('Opening feature request for:', context);
        setIsOpen(false);
    };

    const showCalculatorHelp = () => {
        triggerSupportEvent('calculator_help_opened', {});
        console.log('Showing calculator help');
        setIsOpen(false);
    };

    const showDashboardHelp = () => {
        triggerSupportEvent('dashboard_help_opened', {});
        console.log('Showing dashboard help');
        setIsOpen(false);
    };

    const showWalletHelp = () => {
        triggerSupportEvent('wallet_help_opened', {});
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
                                <button className="help-widget__option" onClick={startTutorial}>
                                    <span className="help-widget__option-icon">🎯</span>
                                    <div className="help-widget__option-content">
                                        <h4>Quick Tutorial</h4>
                                        <p>Get a quick walkthrough of this feature</p>
                                    </div>
                                </button>

                                <button className="help-widget__option" onClick={showFAQ}>
                                    <span className="help-widget__option-icon">❓</span>
                                    <div className="help-widget__option-content">
                                        <h4>FAQ</h4>
                                        <p>Find answers to common questions</p>
                                    </div>
                                </button>

                                <button className="help-widget__option" onClick={openVideoGuide}>
                                    <span className="help-widget__option-icon">📹</span>
                                    <div className="help-widget__option-content">
                                        <h4>Video Guide</h4>
                                        <p>Watch step-by-step tutorials</p>
                                    </div>
                                </button>

                                <button className="help-widget__option" onClick={contactSupport}>
                                    <span className="help-widget__option-icon">💬</span>
                                    <div className="help-widget__option-content">
                                        <h4>Contact Support</h4>
                                        <p>Chat with our customer service team</p>
                                    </div>
                                </button>

                                <button className="help-widget__option" onClick={openFeedback}>
                                    <span className="help-widget__option-icon">📝</span>
                                    <div className="help-widget__option-content">
                                        <h4>Send Feedback</h4>
                                        <p>Tell us about your experience</p>
                                    </div>
                                </button>

                                <button className="help-widget__option" onClick={requestFeature}>
                                    <span className="help-widget__option-icon">💡</span>
                                    <div className="help-widget__option-content">
                                        <h4>Request Feature</h4>
                                        <p>Suggest new features or improvements</p>
                                    </div>
                                </button>
                            </div>

                            {/* Contextual Help */}
                            {helpOptions.length > 0 && (
                                <div className="help-widget__contextual">
                                    <h4>Quick Tips:</h4>
                                    <ul>
                                        {helpOptions.slice(0, 3).map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

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
                    trigger="manual"
                />
            )}
        </>
    );
};

export default HelpWidget;
