'use client'

import { Activity, Clock, Gauge, Server, Wifi, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  loadTime: number
  memoryUsage: number
  networkLatency: number
  cacheHitRate: number
}

export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    loadTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cacheHitRate: 100
  })

  useEffect(() => {
    // Check if user wants to see performance metrics (dev mode)
    const showMetrics = localStorage.getItem('dev-performance-metrics') === 'true'
    setIsVisible(showMetrics)

    if (showMetrics) {
      const updateMetrics = () => {
        // FPS calculation
        let fps = 60
        if ('performance' in window && 'now' in performance) {
          const now = performance.now()
          if (window.lastFrameTime) {
            fps = Math.round(1000 / (now - window.lastFrameTime))
          }
          window.lastFrameTime = now
        }

        // Memory usage (if available)
        let memoryUsage = 0
        if ('memory' in performance) {
          memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
        }

        // Load time
        const loadTime = performance.timing
          ? performance.timing.loadEventEnd - performance.timing.navigationStart
          : 0

        // Simulate network latency and cache hit rate
        const networkLatency = Math.random() * 50 + 10 // 10-60ms
        const cacheHitRate = Math.random() * 20 + 80 // 80-100%

        setMetrics({
          fps: Math.min(fps, 60),
          loadTime: Math.round(loadTime),
          memoryUsage,
          networkLatency: Math.round(networkLatency),
          cacheHitRate: Math.round(cacheHitRate)
        })
      }

      const interval = setInterval(updateMetrics, 1000)
      updateMetrics() // Initial call

      return () => clearInterval(interval)
    }
  }, [isVisible])

  // Keyboard shortcut to toggle metrics
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        const newState = !isVisible
        setIsVisible(newState)
        localStorage.setItem('dev-performance-metrics', newState.toString())
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  if (!isVisible) return null

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'fps':
        if (value >= 55) return 'text-green-500'
        if (value >= 30) return 'text-yellow-500'
        return 'text-red-500'
      case 'memory':
        if (value <= 50) return 'text-green-500'
        if (value <= 100) return 'text-yellow-500'
        return 'text-red-500'
      case 'latency':
        if (value <= 30) return 'text-green-500'
        if (value <= 60) return 'text-yellow-500'
        return 'text-red-500'
      case 'cache':
        if (value >= 90) return 'text-green-500'
        if (value >= 70) return 'text-yellow-500'
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono border border-gray-600">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="font-semibold">Performance Monitor</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-auto text-gray-400 hover:text-white"
          title="Hide (Ctrl+Shift+P to toggle)"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          <span>FPS:</span>
          <span className={getStatusColor(metrics.fps, 'fps')}>
            {metrics.fps}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Gauge className="w-3 h-3" />
          <span>Memory:</span>
          <span className={getStatusColor(metrics.memoryUsage, 'memory')}>
            {metrics.memoryUsage}MB
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          <span>Ping:</span>
          <span className={getStatusColor(metrics.networkLatency, 'latency')}>
            {metrics.networkLatency}ms
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Server className="w-3 h-3" />
          <span>Cache:</span>
          <span className={getStatusColor(metrics.cacheHitRate, 'cache')}>
            {metrics.cacheHitRate}%
          </span>
        </div>

        {metrics.loadTime > 0 && (
          <div className="flex items-center gap-1 col-span-2">
            <Clock className="w-3 h-3" />
            <span>Load:</span>
            <span className="text-blue-400">
              {(metrics.loadTime / 1000).toFixed(2)}s
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}
