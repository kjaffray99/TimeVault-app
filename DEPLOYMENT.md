# TimeVault Deployment Configuration

## 🚀 Production Deployment Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Environment variables configured
- SSL certificate for HTTPS

### Environment Setup

1. **Copy production environment file:**
```bash
cp .env.production .env
```

2. **Configure required environment variables:**
```bash
# Required for production
VITE_COINGECKO_API_KEY=your_coingecko_api_key
VITE_METALS_API_KEY=your_metals_api_key
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Optional but recommended
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_MIXPANEL_TOKEN=your_mixpanel_token
```

### Build for Production

```bash
# Install dependencies
npm ci

# Run security audit
npm audit fix

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Security Checklist

- ✅ All API keys in environment variables
- ✅ HTTPS enforced in production
- ✅ CSP headers configured
- ✅ Input sanitization enabled
- ✅ Error logging secured
- ✅ Rate limiting implemented
- ✅ Security headers added

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Environment variables: Set in Netlify dashboard
```

#### AWS S3 + CloudFront
```bash
# Build locally
npm run build

# Upload dist/ folder to S3 bucket
# Configure CloudFront distribution
# Set up Route 53 for custom domain
```

### Environment Variables for Deployment

#### Required
```bash
VITE_COINGECKO_API_KEY=your_api_key
VITE_METALS_API_KEY=your_api_key  
VITE_THIRDWEB_CLIENT_ID=your_client_id
```

#### Security (Auto-generated if not provided)
```bash
VITE_CSP_NONCE=auto_generated
VITE_SESSION_SECRET=auto_generated
VITE_ENCRYPTION_KEY=auto_generated
```

#### Feature Flags
```bash
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_WALLET_CONNECT=true
VITE_ENABLE_ANALYTICS=true
```

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for security vulnerabilities
npm audit

# Test performance
npm run preview
```

#### Security Headers (Add to hosting provider)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://api.coingecko.com https://api.metals.live https://*.thirdweb.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
```

### Monitoring & Analytics

#### Error Tracking
- Configure error boundary reporting
- Set up performance monitoring
- Enable user analytics (optional)

#### Health Checks
```bash
# API endpoints health check
curl https://your-domain.com/health

# Performance metrics
curl https://your-domain.com/metrics
```

### Security Considerations

1. **API Keys**: Never commit to repository
2. **HTTPS**: Enforce in production
3. **CSP**: Configure content security policy
4. **Headers**: Add security headers via hosting provider
5. **Validation**: All user inputs sanitized
6. **Logging**: Sensitive data masked in logs

### Troubleshooting

#### Common Issues
- **Build fails**: Check Node.js version (18+ required)
- **API errors**: Verify environment variables
- **CSP violations**: Update security policy
- **Performance**: Enable compression and caching

#### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG_MODE=true npm run dev

# Check security configuration
console.log(securityManager.getSecurityHeaders())
```

### Post-Deployment

1. **Test all features** with production data
2. **Monitor error rates** and performance
3. **Verify security headers** are applied
4. **Check API rate limits** are working
5. **Validate analytics** tracking

### Rollback Plan

```bash
# If issues occur, rollback to previous version
vercel rollback

# Or redeploy previous commit
git checkout previous-commit-hash
vercel --prod
```

---

**Ready for Production**: ✅
**Security Optimized**: ✅ 
**Performance Tested**: ✅
**Monitoring Enabled**: ✅
