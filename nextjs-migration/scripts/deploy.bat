@echo off
REM TimeVault Production Deployment Script for Windows
REM Usage: deploy.bat [environment]

setlocal enabledelayedexpansion

REM Colors (Windows doesn't support colors in basic cmd, but this prepares for future)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "NC=[0m"

REM Default environment
if "%~1"=="" (
    set "ENVIRONMENT=production"
) else (
    set "ENVIRONMENT=%~1"
)

echo 🚀 Starting TimeVault deployment for %ENVIRONMENT%...

REM Pre-deployment checks
echo 📋 Running pre-deployment checks...

REM Check Node.js version
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    exit /b 1
)

REM Check npm version
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed or not in PATH
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Run type checking
echo 🔍 Running type checking...
call npm run type-check
if errorlevel 1 (
    echo ❌ Type checking failed
    exit /b 1
)

REM Run linting
echo 🧹 Running linting...
call npm run lint
if errorlevel 1 (
    echo ❌ Linting failed
    exit /b 1
)

REM Build the application
echo 🏗️ Building application...
if "%ENVIRONMENT%"=="production" (
    set NODE_ENV=production
    call npm run build
) else (
    call npm run build
)

if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

REM Run bundle analysis (optional)
if "%ANALYZE%"=="true" (
    echo 📊 Running bundle analysis...
    set ANALYZE=true
    call npm run build
)

echo 🎉 Deployment preparation complete!
echo ✅ Ready for %ENVIRONMENT% deployment

REM Deployment instructions
echo 📝 Next steps:
if "%ENVIRONMENT%"=="production" (
    echo 1. Push to main branch to trigger Vercel deployment
    echo 2. Monitor deployment at https://vercel.com/dashboard
    echo 3. Verify deployment at https://timevault.app
) else (
    echo 1. Push to staging branch
    echo 2. Test on staging environment
    echo 3. Merge to main when ready
)

pause
