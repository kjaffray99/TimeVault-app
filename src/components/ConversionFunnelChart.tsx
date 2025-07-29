/**
 * Conversion Funnel Chart Component
 */
import React from 'react';

interface ConversionFunnel {
    step: string;
    users: number;
    conversions: number;
    conversionRate: number;
    dropOffRate: number;
}

interface ConversionFunnelChartProps {
    funnelData: ConversionFunnel[];
}

export const ConversionFunnelChart: React.FC<ConversionFunnelChartProps> = ({ funnelData }) => {
    const maxUsers = Math.max(...funnelData.map(f => f.users));

    const chartStyles = {
        container: {
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
        },
        title: {
            color: '#D4AF37',
            marginBottom: '2rem',
            textAlign: 'center' as const
        },
        stepContainer: {
            marginBottom: '1.5rem',
            position: 'relative' as const
        },
        stepInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
        },
        stepName: {
            fontWeight: 'bold',
            color: '#FFFFFF'
        },
        stepMetrics: {
            display: 'flex',
            gap: '1rem',
            fontSize: '0.9rem'
        },
        users: { color: '#10B981' },
        conversionRate: { color: '#3B82F6' },
        dropOff: { color: '#EF4444' },
        funnelBar: {
            height: '40px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            position: 'relative' as const
        }
    };

    return (
        <div style={chartStyles.container}>
            <h3 style={chartStyles.title}>Conversion Funnel Analysis</h3>

            {funnelData.map((step) => (
                <div key={step.step} style={chartStyles.stepContainer}>
                    <div style={chartStyles.stepInfo}>
                        <div style={chartStyles.stepName}>{step.step.replace('_', ' ').toUpperCase()}</div>
                        <div style={chartStyles.stepMetrics}>
                            <span style={chartStyles.users}>{step.users} users</span>
                            <span style={chartStyles.conversionRate}>{step.conversionRate.toFixed(1)}% conversion</span>
                            {step.dropOffRate > 0 && (
                                <span style={chartStyles.dropOff}>{step.dropOffRate.toFixed(1)}% drop-off</span>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            ...chartStyles.funnelBar,
                            width: `${Math.max(step.users / maxUsers * 100, 10)}%`,
                            backgroundColor: step.dropOffRate > 50 ? '#EF4444' : step.dropOffRate > 30 ? '#F59E0B' : '#10B981'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
