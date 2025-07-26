/**
 * Customer Support Event System
 * Provides event tracking for customer experience optimization
 */

export type SupportEventType =
    | 'tutorial_started'
    | 'faq_opened'
    | 'video_guide_opened'
    | 'support_contact_initiated'
    | 'feedback_modal_opened'
    | 'feature_request_initiated'
    | 'calculator_help_opened'
    | 'dashboard_help_opened'
    | 'wallet_help_opened'
    | 'help_widget_opened'
    | 'help_widget_closed';

export interface SupportEventData {
    context?: string;
    frictionLevel?: number;
    engagementScore?: number;
    [key: string]: any;
}

export const triggerSupportEvent = (
    eventType: SupportEventType,
    data: SupportEventData = {}
): void => {
    console.log(`🎯 Support Event: ${eventType}`, data);

    // Track event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventType, {
            event_category: 'customer_support',
            event_label: data.context || 'general',
            value: data.frictionLevel || 0
        });
    }

    // Store in localStorage for offline analytics
    try {
        const events = JSON.parse(localStorage.getItem('support_events') || '[]');
        events.push({
            type: eventType,
            data,
            timestamp: Date.now()
        });

        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }

        localStorage.setItem('support_events', JSON.stringify(events));
    } catch (error) {
        console.warn('Failed to store support event:', error);
    }
};

export const getContextualHelp = async (context: string): Promise<string[]> => {
    const helpContent: Record<string, string[]> = {
        calculator: [
            'Enter the amount of cryptocurrency you want to convert',
            'Select your preferred precious metal (gold or silver)',
            'View real-time conversion rates and market data',
            'Use the time equivalent feature to see value in hours/days'
        ],
        dashboard: [
            'Explore educational content in different tabs',
            'Take quizzes to earn TVLT token rewards',
            'Read market insights and analysis',
            'Access premium features with wallet connection'
        ],
        wallet: [
            'Connect your XRPL-compatible wallet',
            'Ensure you have sufficient funds for transactions',
            'Check network status and gas fees',
            'Verify wallet permissions and signatures'
        ],
        premium: [
            'Connect wallet to access premium features',
            'View advanced AI market insights',
            'Access exclusive educational content',
            'Mint educational NFT badges'
        ]
    };

    return helpContent[context] || [
        'Need help? Contact our support team',
        'Check our FAQ section for common questions',
        'Watch tutorial videos for step-by-step guidance'
    ];
};
