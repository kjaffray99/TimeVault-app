#!/bin/bash

# TimeVault Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${YELLOW}🚀 Starting TimeVault deployment for ${ENVIRONMENT}...${NC}"

# Pre-deployment checks
echo -e "${YELLOW}📋 Running pre-deployment checks...${NC}"

# Check if required environment variables are set
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -z "$NEXT_PUBLIC_THIRDWEB_CLIENT_ID" ]; then
        echo -e "${RED}❌ NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set${NC}"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        echo -e "${RED}❌ NEXTAUTH_SECRET is not set${NC}"
        exit 1
    fi
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run type checking
echo -e "${YELLOW}🔍 Running type checking...${NC}"
npm run type-check

# Run linting
echo -e "${YELLOW}🧹 Running linting...${NC}"
npm run lint

# Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    NODE_ENV=production npm run build
else
    npm run build
fi

# Run bundle analysis (optional)
if [ "$ANALYZE" = "true" ]; then
    echo -e "${YELLOW}📊 Running bundle analysis...${NC}"
    ANALYZE=true npm run build
fi

# Test the build
echo -e "${YELLOW}🧪 Testing the build...${NC}"
npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Basic health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    kill $SERVER_PID
    exit 1
fi

# Stop test server
kill $SERVER_PID

echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo -e "${GREEN}✅ Ready for ${ENVIRONMENT} deployment${NC}"

# Deployment instructions
echo -e "${YELLOW}📝 Next steps:${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "1. Push to main branch to trigger Vercel deployment"
    echo "2. Monitor deployment at https://vercel.com/dashboard"
    echo "3. Verify deployment at https://timevault.app"
else
    echo "1. Push to staging branch"
    echo "2. Test on staging environment"
    echo "3. Merge to main when ready"
fi
