
// Vercel Pro Performance Monitoring
export const performanceConfig = {
  // Speed Insights
  speedInsights: {
    enabled: true,
    sampleRate: 1.0,
    trackCoreWebVitals: true,
    trackCustomMetrics: true
  },
  
  // Audience Insights  
  audienceInsights: {
    enabled: true,
    trackUserBehavior: true,
    trackConversions: true,
    trackRevenue: true
  },
  
  // Security Insights
  securityInsights: {
    enabled: true,
    trackAttacks: true,
    trackVulnerabilities: true,
    realTimeAlerts: true
  },
  
  // Custom Revenue Metrics
  revenueMetrics: {
    dailyTarget: 1167,
    monthlyTarget: 35000,
    conversionTarget: 0.025,
    affiliateTarget: 0.10,
    
    alerts: {
      dailyMissBy: 0.20,
      conversionDrop: 0.15,
      errorSpike: 0.05
    }
  }
};

// Real-time metric tracking
export function trackRevenueMetric(metric, value) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'revenue_metric', {
      metric_name: metric,
      metric_value: value,
      timestamp: Date.now(),
      vercel_pro: true
    });
  }
}

export default performanceConfig;
