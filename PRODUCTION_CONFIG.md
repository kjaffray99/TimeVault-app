# 🌍 Production Environment Configuration

## VERCEL ENVIRONMENT VARIABLES (Set via Dashboard)

### Core Application
VITE_APP_NAME=TimeVault
VITE_APP_VERSION=1.2.0
VITE_ENVIRONMENT=production

### API Configuration  
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_METALS_API_URL=https://api.metals.live/v1
VITE_API_TIMEOUT=10000
VITE_RATE_LIMIT_MAX=50

### Performance Optimization
VITE_CACHE_ENABLED=true
VITE_ENHANCED_SECURITY=true
VITE_BUNDLE_ANALYZER=false
VITE_LAZY_LOADING=true

### Analytics & Tracking
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=your_mixpanel_token
VITE_HOTJAR_ID=your_hotjar_id

### Payment Integration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

### AI Services (Phase 2)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxxxxx

### Database (Phase 2)
DATABASE_URL=postgresql://user:pass@host:5432/timevault
REDIS_URL=redis://user:pass@host:6379

### Monitoring & Security
SENTRY_DSN=https://xxxxxxxxxxxxxxxx@sentry.io/xxxxxxxx
NEW_RELIC_LICENSE_KEY=xxxxxxxxxxxxxxxx
SECURITY_AUDIT_WEBHOOK=https://hooks.slack.com/xxxxxxxx

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Build passing locally
- [ ] TypeScript compilation successful
- [ ] All tests passing
- [ ] Bundle size optimized (<5MB)

### Deployment Steps
- [ ] `npm run build` - Production build
- [ ] `npx vercel --prod` - Deploy to production
- [ ] Verify environment variables loaded
- [ ] Test core functionality
- [ ] Monitor error rates

### Post-Deployment
- [ ] Analytics tracking working
- [ ] Premium subscription flow tested
- [ ] Social sharing functional
- [ ] Mobile responsiveness verified
- [ ] Performance metrics within targets

## 📊 MONITORING SETUP

### Key Metrics to Track
- **Page Load Time**: <2s target
- **Error Rate**: <0.1% target  
- **Conversion Rate**: Premium subscriptions
- **User Engagement**: Session duration, pages per session
- **Revenue Metrics**: Daily/monthly recurring revenue

### Alert Thresholds
- Error rate >1% - Immediate alert
- Page load time >5s - Warning alert
- Conversion rate drop >20% - Investigation needed
- Server response time >3s - Scale infrastructure

## 🔐 SECURITY CONFIGURATION

### Headers (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.coingecko.com https://api.metals.live;
```

## 🔄 ROLLBACK STRATEGY

### Immediate Rollback (if critical issues)
1. `vercel --prod --force` with previous working commit
2. Notify users via status page
3. Debug in staging environment
4. Re-deploy with fixes

### Feature Flags for Gradual Rollback
```typescript
const emergencyFlags = {
  disablePremium: false,
  disableAnalytics: false, 
  disableSocialShare: false,
  enableMaintenanceMode: false
};
```

## 📈 SCALING STRATEGY

### Traffic Thresholds
- **1K users/day**: Current Vercel plan sufficient
- **10K users/day**: Upgrade to Pro plan, implement CDN
- **100K users/day**: Move to dedicated infrastructure
- **1M users/day**: Microservices architecture

### Database Scaling
- **Phase 1**: File-based storage (current)
- **Phase 2**: PostgreSQL on Vercel
- **Phase 3**: Dedicated database cluster
- **Phase 4**: Multi-region database replication

### API Rate Limiting
- **Free users**: 100 requests/hour
- **Premium users**: 1000 requests/hour  
- **Enterprise**: Unlimited with SLA

---

**Deployment Command**: `npx vercel --prod`
**Domain**: https://timevaultai.com
**Status**: Ready for production deployment 🚀
