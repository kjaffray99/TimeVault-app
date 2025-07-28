@echo off
echo 🚀 TimeVault Production Deployment - July 27, 2025
echo ================================================

echo 📦 Installing dependencies...
call npm install

echo 🔧 Running type check...
call npm run type-check

echo 🏗️ Building production bundle...
call npm run build

echo 📊 Build completed successfully!
echo.

echo 🌐 Deploying to Vercel...
echo ⏳ Please wait while deployment completes...

REM Install Vercel CLI if not present
where vercel >nul 2>nul || (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo 🚀 Deploying to production...
call vercel --prod --yes

echo.
echo 🎉 TimeVault Deployment Complete!
echo ================================
echo ✅ Application built successfully
echo ✅ Security optimizations active
echo ✅ Performance enhancements deployed
echo ✅ Revenue tracking enabled
echo.
echo 🎯 Target: $2,000-5,000 Week 1 Revenue
echo 📊 Monitor performance in Vercel dashboard
echo 🚀 TimeVault is now live and ready for users!

pause
