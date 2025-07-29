/**
 * Mobile App Foundation - Progressive Web App Core
 * Cross-platform mobile experience with native-like features
 */

import {
    Battery,
    Bell,
    Calculator,
    ChevronLeft,
    Download,
    Home,
    Menu,
    MoreVertical, Search,
    Share,
    Signal,
    Smartphone,
    TrendingUp, User,
    Wifi, WifiOff,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface PWAInstallPrompt {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NotificationPermission {
    granted: boolean;
    prompt: () => Promise<'granted' | 'denied' | 'default'>;
}

interface DeviceCapabilities {
    isOnline: boolean;
    batteryLevel?: number;
    isCharging?: boolean;
    deviceMemory?: number;
    hardwareConcurrency: number;
    maxTouchPoints: number;
}

export const MobileAppFoundation: React.FC<{
    children: React.ReactNode;
    onInstallPrompt: () => void;
    onNotificationToggle: (enabled: boolean) => void;
}> = ({ children, onInstallPrompt, onNotificationToggle }) => {
    const [isInstallable, setIsInstallable] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
        isOnline: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        maxTouchPoints: navigator.maxTouchPoints || 0
    });
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [orientation, setOrientation] = useState(screen.orientation?.angle || 0);
    const swipeAreaRef = useRef<HTMLDivElement>(null);

    // PWA Installation Detection
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
            setIsInstallable(true);
            setShowInstallBanner(true);
        };

        const handleAppInstalled = () => {
            setIsInstallable(false);
            setShowInstallBanner(false);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Device Capabilities Detection
    useEffect(() => {
        const updateDeviceCapabilities = async () => {
            const capabilities: DeviceCapabilities = {
                isOnline: navigator.onLine,
                hardwareConcurrency: navigator.hardwareConcurrency || 4,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };

            // Battery API (if available)
            if ('getBattery' in navigator) {
                try {
                    const battery = await (navigator as any).getBattery();
                    capabilities.batteryLevel = Math.round(battery.level * 100);
                    capabilities.isCharging = battery.charging;
                } catch (error) {
                    console.log('Battery API not available');
                }
            }

            // Device Memory API (if available)
            if ('deviceMemory' in navigator) {
                capabilities.deviceMemory = (navigator as any).deviceMemory;
            }

            setDeviceCapabilities(capabilities);
        };

        const handleOnlineStatusChange = () => {
            setDeviceCapabilities(prev => ({
                ...prev,
                isOnline: navigator.onLine
            }));
        };

        const handleOrientationChange = () => {
            setOrientation(screen.orientation?.angle || 0);
        };

        updateDeviceCapabilities();
        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);
        screen.orientation?.addEventListener('change', handleOrientationChange);

        return () => {
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
            screen.orientation?.removeEventListener('change', handleOrientationChange);
        };
    }, []);

    // Notification Permission Management
    useEffect(() => {
        const checkNotificationPermission = () => {
            if ('Notification' in window) {
                setNotificationsEnabled(Notification.permission === 'granted');
            }
        };

        checkNotificationPermission();
    }, []);

    // Fullscreen Detection
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Touch Gesture Handlers
    useEffect(() => {
        let startY = 0;
        let startX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!swipeAreaRef.current) return;

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = startY - currentY;
            const diffX = startX - currentX;

            // Pull-to-refresh gesture
            if (diffY < -100 && Math.abs(diffX) < 50 && window.scrollY === 0) {
                // Implement pull-to-refresh logic
                window.location.reload();
            }

            // Swipe gestures for navigation
            if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
                if (diffX > 0) {
                    // Swipe left - next page
                    console.log('Swipe left detected');
                } else {
                    // Swipe right - previous page
                    console.log('Swipe right detected');
                }
            }
        };

        const swipeArea = swipeAreaRef.current;
        if (swipeArea) {
            swipeArea.addEventListener('touchstart', handleTouchStart, { passive: true });
            swipeArea.addEventListener('touchmove', handleTouchMove, { passive: true });
        }

        return () => {
            if (swipeArea) {
                swipeArea.removeEventListener('touchstart', handleTouchStart);
                swipeArea.removeEventListener('touchmove', handleTouchMove);
            }
        };
    }, []);

    const handleInstallApp = async () => {
        if (installPrompt) {
            await installPrompt.prompt();
            const choiceResult = await installPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                setShowInstallBanner(false);
                onInstallPrompt();
            }

            setInstallPrompt(null);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            const enabled = permission === 'granted';
            setNotificationsEnabled(enabled);
            onNotificationToggle(enabled);

            if (enabled) {
                // Send a welcome notification
                new Notification('TimeVault Notifications Enabled!', {
                    body: 'You\'ll now receive updates about your investments and achievements.',
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/badge-72x72.png'
                });
            }
        }
    };

    const shareApp = async () => {
        const shareData = {
            title: 'TimeVault - Convert Crypto to Precious Metals',
            text: 'Check out TimeVault! Convert your digital assets to gold and silver equivalents.',
            url: window.location.href
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback to clipboard
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied to clipboard!');
        }
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    };

    const MobileStatusBar = () => (
        <div className="mobile-status-bar">
            <div className="status-left">
                <span className="time">{new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            </div>
            <div className="status-center">
                <div className="notch" />
            </div>
            <div className="status-right">
                <Signal className={`status-icon ${deviceCapabilities.isOnline ? 'online' : 'offline'}`} />
                {!deviceCapabilities.isOnline && <WifiOff className="status-icon offline" />}
                {deviceCapabilities.isOnline && <Wifi className="status-icon online" />}
                <div className="battery-indicator">
                    <Battery
                        className={`battery-icon ${deviceCapabilities.isCharging ? 'charging' : ''}`}
                    />
                    {deviceCapabilities.batteryLevel && (
                        <span className="battery-level">{deviceCapabilities.batteryLevel}%</span>
                    )}
                </div>
            </div>
        </div>
    );

    const InstallBanner = () => (
        showInstallBanner && (
            <div className="install-banner">
                <div className="banner-content">
                    <Smartphone className="banner-icon" />
                    <div className="banner-text">
                        <h4>Install TimeVault App</h4>
                        <p>Get the full native experience!</p>
                    </div>
                </div>
                <div className="banner-actions">
                    <button onClick={handleInstallApp} className="install-btn">
                        <Download className="btn-icon" />
                        Install
                    </button>
                    <button
                        onClick={() => setShowInstallBanner(false)}
                        className="dismiss-btn"
                    >
                        <X className="btn-icon" />
                    </button>
                </div>
            </div>
        )
    );

    const MobileNavigation = () => (
        <div className="mobile-navigation">
            <nav className="mobile-nav">
                <a href="#home" className="nav-item active">
                    <Home className="nav-icon" />
                    <span>Home</span>
                </a>
                <a href="#calculator" className="nav-item">
                    <Calculator className="nav-icon" />
                    <span>Calculate</span>
                </a>
                <a href="#analytics" className="nav-item">
                    <TrendingUp className="nav-icon" />
                    <span>Analytics</span>
                </a>
                <a href="#profile" className="nav-item">
                    <User className="nav-icon" />
                    <span>Profile</span>
                </a>
                <button
                    className="nav-item menu-toggle"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <Menu className="nav-icon" />
                    <span>More</span>
                </button>
            </nav>
        </div>
    );

    const MobileHeader = () => (
        <div className="mobile-header">
            <button className="header-btn back-btn">
                <ChevronLeft className="header-icon" />
            </button>
            <h1 className="header-title">TimeVault</h1>
            <div className="header-actions">
                <button className="header-btn" onClick={shareApp}>
                    <Share className="header-icon" />
                </button>
                <button className="header-btn">
                    <Search className="header-icon" />
                </button>
                <button className="header-btn">
                    <MoreVertical className="header-icon" />
                </button>
            </div>
        </div>
    );

    const MobileMenu = () => (
        showMobileMenu && (
            <>
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setShowMobileMenu(false)}
                />
                <div className="mobile-menu">
                    <div className="menu-header">
                        <h3>Menu</h3>
                        <button onClick={() => setShowMobileMenu(false)}>
                            <X className="close-icon" />
                        </button>
                    </div>
                    <div className="menu-items">
                        <button className="menu-item" onClick={requestNotificationPermission}>
                            <Bell className="menu-icon" />
                            <span>Notifications</span>
                            <div className={`toggle ${notificationsEnabled ? 'enabled' : ''}`} />
                        </button>
                        <button className="menu-item" onClick={toggleFullscreen}>
                            <Smartphone className="menu-icon" />
                            <span>Fullscreen</span>
                        </button>
                        <button className="menu-item" onClick={shareApp}>
                            <Share className="menu-icon" />
                            <span>Share App</span>
                        </button>
                        {isInstallable && (
                            <button className="menu-item" onClick={handleInstallApp}>
                                <Download className="menu-icon" />
                                <span>Install App</span>
                            </button>
                        )}
                    </div>
                    <div className="device-info">
                        <h4>Device Info</h4>
                        <div className="info-grid">
                            <span>Connection: {deviceCapabilities.isOnline ? 'Online' : 'Offline'}</span>
                            <span>CPU Cores: {deviceCapabilities.hardwareConcurrency}</span>
                            <span>Touch Points: {deviceCapabilities.maxTouchPoints}</span>
                            {deviceCapabilities.deviceMemory && (
                                <span>Memory: {deviceCapabilities.deviceMemory}GB</span>
                            )}
                            <span>Orientation: {orientation}°</span>
                        </div>
                    </div>
                </div>
            </>
        )
    );

    return (
        <div className="mobile-app-foundation" ref={swipeAreaRef}>
            <MobileStatusBar />
            <InstallBanner />
            <MobileHeader />

            <main className="mobile-content">
                {children}
            </main>

            <MobileNavigation />
            <MobileMenu />

            <style jsx>{`
        .mobile-app-foundation {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
          color: #FFFFFF;
          position: relative;
          overflow: hidden;
        }

        .mobile-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 44px;
          padding: 0 1rem;
          background: rgba(0, 0, 0, 0.9);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-left .time {
          color: #FFFFFF;
        }

        .status-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .notch {
          width: 120px;
          height: 20px;
          background: #000000;
          border-radius: 0 0 16px 16px;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-icon {
          width: 1rem;
          height: 1rem;
        }

        .status-icon.online {
          color: #10B981;
        }

        .status-icon.offline {
          color: #EF4444;
        }

        .battery-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .battery-icon {
          width: 1rem;
          height: 1rem;
          color: #FFFFFF;
        }

        .battery-icon.charging {
          color: #10B981;
        }

        .battery-level {
          font-size: 0.75rem;
          color: #C0C0C0;
        }

        .install-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(212, 175, 55, 0.2);
          border-bottom: 2px solid #D4AF37;
          padding: 1rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .banner-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .banner-text h4 {
          margin: 0;
          color: #D4AF37;
          font-size: 0.875rem;
        }

        .banner-text p {
          margin: 0;
          color: #C0C0C0;
          font-size: 0.75rem;
        }

        .banner-actions {
          display: flex;
          gap: 0.5rem;
        }

        .install-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #D4AF37;
          color: #001F3F;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .dismiss-btn {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #C0C0C0;
          padding: 0.5rem;
          cursor: pointer;
        }

        .btn-icon {
          width: 1rem;
          height: 1rem;
        }

        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        }

        .header-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          color: #FFFFFF;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .header-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .header-title {
          flex: 1;
          text-align: center;
          margin: 0;
          color: #D4AF37;
          font-size: 1.125rem;
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .mobile-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          -webkit-overflow-scrolling: touch;
        }

        .mobile-navigation {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          padding: 0.5rem 0;
        }

        .mobile-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          color: #C0C0C0;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
          transition: color 0.2s ease;
          min-width: 60px;
        }

        .nav-item.active {
          color: #D4AF37;
        }

        .nav-item:hover {
          color: #FFFFFF;
        }

        .nav-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .nav-item span {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 300px;
          height: 100vh;
          background: rgba(0, 31, 63, 0.95);
          backdrop-filter: blur(20px);
          border-left: 2px solid #D4AF37;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
          overflow-y: auto;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        }

        .menu-header h3 {
          margin: 0;
          color: #D4AF37;
        }

        .close-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #C0C0C0;
          cursor: pointer;
        }

        .menu-items {
          padding: 1rem 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #FFFFFF;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .menu-item .menu-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 1rem;
          color: #D4AF37;
        }

        .menu-item span {
          flex: 1;
          text-align: left;
        }

        .toggle {
          width: 40px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          position: relative;
          transition: background-color 0.3s ease;
        }

        .toggle.enabled {
          background: #10B981;
        }

        .toggle::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: #FFFFFF;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s ease;
        }

        .toggle.enabled::after {
          transform: translateX(20px);
        }

        .device-info {
          padding: 1.5rem;
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          margin-top: 1rem;
        }

        .device-info h4 {
          margin: 0 0 1rem 0;
          color: #D4AF37;
          font-size: 0.875rem;
        }

        .info-grid {
          display: grid;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #C0C0C0;
        }

        /* PWA specific styles */
        @media (display-mode: standalone) {
          .mobile-status-bar {
            display: none;
          }
          
          .mobile-header {
            padding-top: env(safe-area-inset-top);
          }
          
          .mobile-navigation {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .mobile-menu {
            width: 100%;
          }
          
          .banner-content {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .header-title {
            font-size: 1rem;
          }
        }

        /* Touch-friendly tap targets */
        .nav-item,
        .header-btn,
        .menu-item {
          min-height: 44px;
          min-width: 44px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .install-banner,
          .mobile-menu {
            animation: none;
          }
          
          .toggle::after {
            transition: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .mobile-header,
          .mobile-navigation,
          .mobile-menu {
            border-color: #FFFFFF;
          }
          
          .status-icon.online {
            color: #00FF00;
          }
          
          .status-icon.offline {
            color: #FF0000;
          }
        }
      `}</style>
        </div>
    );
};

export default MobileAppFoundation;
