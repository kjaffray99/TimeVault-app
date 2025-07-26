# TimeVault - Deployment Fix Script
# This script creates a minimal working version for immediate deployment

# Create deployment configuration
cat > vercel-deploy.json << 'EOF'
{
  "name": "timevault",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "app/api/health.js": {
      "maxDuration": 10
    }
  }
}
EOF

# Environment setup
cat > .env.production << 'EOF'
VITE_APP_NAME=TimeVault
VITE_APP_VERSION=1.0.0
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_METALS_API_URL=https://api.metals.live/v1
VITE_API_TIMEOUT=10000
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_WALLET_CONNECT=true
EOF

echo "✅ Deployment configuration created"
echo "📝 Next steps:"
echo "1. Copy .env.example to .env and add your API keys"
echo "2. Fix remaining TypeScript errors (see build output above)"
echo "3. Run: npm run build"
echo "4. Deploy: vercel --prod"
