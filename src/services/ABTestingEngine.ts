/**
 * A/B Testing Engine for Premium Conversion Optimization
 * Target: Increase conversion rate from 4.2% to 8%+
 */

import React from 'react';

interface ABTest {
    id: string;
    name: string;
    description: string;
    variants: ABVariant[];
    trafficSplit: number[];
    status: 'active' | 'paused' | 'completed';
    startDate: string;
    endDate?: string;
    metrics: ABMetrics;
}

interface ABVariant {
    id: string;
    name: string;
    description: string;
    config: any;
    weight: number;
}

interface ABMetrics {
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    confidence: number;
    winner?: string;
}

class ABTestingEngine {
    private tests: Map<string, ABTest> = new Map();
    private userAssignments: Map<string, string> = new Map();

    constructor() {
        this.initializeTests();
    }

    private initializeTests() {
        // Premium Pricing Test
        this.addTest({
            id: 'premium_pricing_v2',
            name: 'Premium Pricing Optimization',
            description: 'Test different pricing strategies for maximum conversion',
            variants: [
                {
                    id: 'control',
                    name: 'Current Pricing',
                    description: '$19.99/month, $199.99/year',
                    config: {
                        monthlyPrice: 19.99,
                        yearlyPrice: 199.99,
                        yearlyDiscount: '2 months FREE',
                        urgencyTimer: true
                    },
                    weight: 50
                },
                {
                    id: 'value_optimized',
                    name: 'Value-Optimized Pricing',
                    description: '$9.99/month, $99.99/year with enhanced value props',
                    config: {
                        monthlyPrice: 9.99,
                        yearlyPrice: 99.99,
                        yearlyDiscount: 'Save $19.89 (16% OFF)',
                        urgencyTimer: true,
                        bonusFeatures: ['FREE TVLT Tokens', 'Exclusive NFT Badge']
                    },
                    weight: 50
                }
            ],
            trafficSplit: [50, 50],
            status: 'active',
            startDate: new Date().toISOString(),
            metrics: {
                impressions: 0,
                conversions: 0,
                conversionRate: 0,
                revenue: 0,
                confidence: 0
            }
        });

        // CTA Button Test
        this.addTest({
            id: 'cta_optimization',
            name: 'Premium CTA Button Optimization',
            description: 'Test different CTA copy and styling for higher clicks',
            variants: [
                {
                    id: 'control',
                    name: 'Upgrade Now',
                    description: 'Standard upgrade button',
                    config: {
                        text: 'UPGRADE NOW',
                        style: 'gradient',
                        urgency: false
                    },
                    weight: 33
                },
                {
                    id: 'urgency',
                    name: 'Limited Time Offer',
                    description: 'Urgency-driven CTA',
                    config: {
                        text: '🔥 CLAIM LIMITED OFFER',
                        style: 'pulsing',
                        urgency: true,
                        countdown: true
                    },
                    weight: 33
                },
                {
                    id: 'value_focus',
                    name: 'Value-Focused CTA',
                    description: 'Emphasize value proposition',
                    config: {
                        text: '💎 UNLOCK PREMIUM FEATURES',
                        style: 'premium',
                        urgency: false,
                        subtext: 'Join 500+ Premium Users'
                    },
                    weight: 34
                }
            ],
            trafficSplit: [33, 33, 34],
            status: 'active',
            startDate: new Date().toISOString(),
            metrics: {
                impressions: 0,
                conversions: 0,
                conversionRate: 0,
                revenue: 0,
                confidence: 0
            }
        });

        // Onboarding Flow Test
        this.addTest({
            id: 'onboarding_flow',
            name: 'Premium Onboarding Optimization',
            description: 'Test different onboarding flows to reduce time-to-value',
            variants: [
                {
                    id: 'control',
                    name: 'Standard Flow',
                    description: 'Current 4-step onboarding',
                    config: {
                        steps: ['welcome', 'features', 'pricing', 'checkout'],
                        skipOption: true
                    },
                    weight: 50
                },
                {
                    id: 'gamified',
                    name: 'Gamified Onboarding',
                    description: 'Interactive tutorial with TVLT rewards',
                    config: {
                        steps: ['calculator_demo', 'quiz_sample', 'rewards_preview', 'pricing'],
                        skipOption: false,
                        tvltReward: 10,
                        progressIndicator: true
                    },
                    weight: 50
                }
            ],
            trafficSplit: [50, 50],
            status: 'active',
            startDate: new Date().toISOString(),
            metrics: {
                impressions: 0,
                conversions: 0,
                conversionRate: 0,
                revenue: 0,
                confidence: 0
            }
        });
    }

    addTest(test: ABTest) {
        this.tests.set(test.id, test);
    }

    getVariant(testId: string, userId: string): ABVariant | null {
        const test = this.tests.get(testId);
        if (!test || test.status !== 'active') return null;

        // Check if user already assigned
        const existingAssignment = this.userAssignments.get(`${testId}_${userId}`);
        if (existingAssignment) {
            return test.variants.find(v => v.id === existingAssignment) || null;
        }

        // Assign user to variant based on weights
        const random = this.hashUserId(userId) % 100;
        let cumulativeWeight = 0;

        for (const variant of test.variants) {
            cumulativeWeight += variant.weight;
            if (random < cumulativeWeight) {
                this.userAssignments.set(`${testId}_${userId}`, variant.id);
                this.trackImpression(testId, variant.id);
                return variant;
            }
        }

        return test.variants[0]; // Fallback
    }

    trackImpression(testId: string, variantId: string) {
        const test = this.tests.get(testId);
        if (test) {
            test.metrics.impressions++;
            this.tests.set(testId, test);
            console.log(`👁️ A/B Test Impression: ${testId} - ${variantId}`);
        }
    }

    trackConversion(testId: string, userId: string, revenue: number = 0) {
        const test = this.tests.get(testId);
        const variantId = this.userAssignments.get(`${testId}_${userId}`);

        if (test && variantId) {
            test.metrics.conversions++;
            test.metrics.revenue += revenue;
            test.metrics.conversionRate = (test.metrics.conversions / test.metrics.impressions) * 100;

            // Calculate statistical confidence (simplified)
            test.metrics.confidence = Math.min(95, (test.metrics.conversions / 10) * 95);

            this.tests.set(testId, test);

            console.log(`🎯 A/B Test Conversion: ${testId} - ${variantId} - $${revenue}`);
        }
    }

    getTestResults(testId: string): ABTest | null {
        return this.tests.get(testId) || null;
    }

    getAllActiveTests(): ABTest[] {
        return Array.from(this.tests.values()).filter(test => test.status === 'active');
    }

    private hashUserId(userId: string): number {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Premium-specific test helpers
    getPremiumPricingVariant(userId: string) {
        return this.getVariant('premium_pricing_v2', userId);
    }

    getCTAVariant(userId: string) {
        return this.getVariant('cta_optimization', userId);
    }

    getOnboardingVariant(userId: string) {
        return this.getVariant('onboarding_flow', userId);
    }
}

// Global instance
export const abTesting = new ABTestingEngine();

// React hook for A/B testing
export const useABTest = (testId: string, userId: string) => {
    const [variant, setVariant] = React.useState<ABVariant | null>(null);

    React.useEffect(() => {
        const testVariant = abTesting.getVariant(testId, userId);
        setVariant(testVariant);
    }, [testId, userId]);

    const trackConversion = (revenue: number = 0) => {
        abTesting.trackConversion(testId, userId, revenue);
    };

    return { variant, trackConversion };
};

// Premium-specific hooks
export const usePremiumPricing = (userId: string) => {
    return useABTest('premium_pricing_v2', userId);
};

export const usePremiumCTA = (userId: string) => {
    return useABTest('cta_optimization', userId);
};

export default ABTestingEngine;
