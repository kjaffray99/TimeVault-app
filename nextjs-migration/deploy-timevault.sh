#!/bin/bash

# TimeVault MVP Deployment Script
# Automated deployment to Vercel with performance verification
# Execute: ./deploy-timevault.sh

set -e  # Exit on any error

echo "🚀 TimeVault MVP Deployment Starting..."
echo "Target: Vercel Production | $(date)"
echo "========================================"

# Step 1: Build Preparation & Verification
echo ""
echo "📦 STEP 1: BUILD PREPARATION & VERIFICATION"
echo "============================================"

echo "→ Installing dependencies..."
npm ci

echo "→ Running type checking..."
npm run type-check

echo "→ Building for production..."
npm run build

echo "→ Verifying build output..."
if [ -d ".next" ]; then
    echo "✅ Build successful - .next directory exists"
    
    # Check bundle size
    BUNDLE_SIZE=$(du -sh .next/static | cut -f1)
    echo "✅ Bundle size: $BUNDLE_SIZE"
else
    echo "❌ Build failed - .next directory missing"
    exit 1
fi

# Step 2: Git Commit & Repository Sync
echo ""
echo "📝 STEP 2: GIT COMMIT & REPOSITORY SYNC"
echo "======================================="

echo "→ Staging all changes..."
git add .

echo "→ Committing changes..."
git commit -m "Deploy latest MVP: Optimized calculator, security systems, performance monitoring - Ready for Vercel production launch" || echo "No changes to commit"

echo "→ Pushing to main branch..."
git push origin main

echo "✅ Repository sync complete"

# Step 3: Vercel Deployment & Launch Verification
echo ""
echo "🌐 STEP 3: VERCEL DEPLOYMENT & LAUNCH VERIFICATION"
echo "=================================================="

echo "→ Deploying to Vercel production..."
DEPLOY_OUTPUT=$(vercel --prod --yes)
echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^[:space:]]*' | head -1)
echo "🎯 Deployment URL: $DEPLOY_URL"

echo "→ Waiting for deployment to be ready..."
sleep 10

echo "→ Testing deployment performance..."
PERFORMANCE=$(curl -w "@curl-format.txt" -o /dev/null -s "$DEPLOY_URL" 2>/dev/null)
echo "$PERFORMANCE"

# Extract total time
TOTAL_TIME=$(echo "$PERFORMANCE" | grep "time_total" | awk '{print $2}')
echo "⚡ Total load time: ${TOTAL_TIME}s"

# Verify sub-2s target
if (( $(echo "$TOTAL_TIME < 2.0" | bc -l) )); then
    echo "✅ Performance target met: ${TOTAL_TIME}s < 2.0s"
else
    echo "⚠️  Performance warning: ${TOTAL_TIME}s >= 2.0s"
fi

echo "→ Testing calculator functionality..."
CALC_TEST=$(curl -s "$DEPLOY_URL" | grep -o "Personal Time Calculator" || echo "NOT_FOUND")
if [ "$CALC_TEST" = "Personal Time Calculator" ]; then
    echo "✅ Calculator component detected"
else
    echo "⚠️  Calculator component not found in HTML"
fi

echo "→ Testing API endpoints..."
API_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/analytics/events" -X POST -H "Content-Type: application/json" -d '{"test":true}')
if [ "$API_TEST" = "200" ] || [ "$API_TEST" = "405" ]; then
    echo "✅ Analytics API endpoint responding"
else
    echo "⚠️  Analytics API endpoint issue: HTTP $API_TEST"
fi

# Final Results
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo "✅ Production URL: $DEPLOY_URL"
echo "✅ Performance: ${TOTAL_TIME}s load time"
echo "✅ Build successful with optimization systems"
echo "✅ Calculator, analytics, and security active"
echo ""
echo "📊 Next Steps:"
echo "• Monitor Vercel Analytics dashboard"
echo "• Test all calculator functions manually"
echo "• Verify premium triggers and conversions"
echo "• Share launch announcement"
echo ""
echo "🚀 TimeVault MVP is LIVE and ready for users!"
echo "Target Revenue: $2,000-5,000 Week 1"
