'use client'

import { Download, Monitor, Smartphone, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function ProgressiveWebApp() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    const isInstalled = isStandalone || isInWebAppiOS

    if (!isInstalled) {
      // Listen for PWA install prompt
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
        e.preventDefault()
        setInstallPrompt(e)
        setIsInstallable(true)

        // Show install banner after 30 seconds
        setTimeout(() => {
          setShowInstallBanner(true)
        }, 30000)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // Register service worker for PWA functionality
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setIsInstallable(false)
      setShowInstallBanner(false)
    }
  }

  return (
    <>
      {/* Online/Offline Status */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isOnline
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Install Banner */}
      {showInstallBanner && isInstallable && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5" />
              <div>
                <p className="font-semibold">Install TimeVault AI</p>
                <p className="text-sm opacity-90">Get faster access and offline features</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 text-sm bg-white text-purple-600 rounded hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Features Info */}
      {isInstallable && !showInstallBanner && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={handleInstallClick}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
            title="Install TimeVault AI"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* PWA Capabilities Display */}
      <div className="hidden md:block fixed left-4 bottom-4 z-30">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Monitor className="w-4 h-4" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile optimized</span>
          </div>
        </div>
      </div>
    </>
  )
}
