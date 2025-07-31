'use client'

import { Accessibility, Contrast, Eye, EyeOff, Type, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    // Load accessibility preferences from localStorage
    const savedFontSize = localStorage.getItem('accessibility-font-size')
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast')
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion')
    const savedSoundEnabled = localStorage.getItem('accessibility-sound-enabled')

    if (savedFontSize) setFontSize(parseInt(savedFontSize))
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true')
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true')
    if (savedSoundEnabled) setSoundEnabled(savedSoundEnabled === 'true')
  }, [])

  useEffect(() => {
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem('accessibility-font-size', fontSize.toString())
  }, [fontSize])

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    localStorage.setItem('accessibility-high-contrast', highContrast.toString())
  }, [highContrast])

  useEffect(() => {
    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
    }
    localStorage.setItem('accessibility-reduced-motion', reducedMotion.toString())
  }, [reducedMotion])

  useEffect(() => {
    localStorage.setItem('accessibility-sound-enabled', soundEnabled.toString())
  }, [soundEnabled])

  const resetToDefaults = () => {
    setFontSize(16)
    setHighContrast(false)
    setReducedMotion(false)
    setSoundEnabled(true)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg shadow-lg transition-colors"
        aria-label="Open accessibility options"
        title="Accessibility Options"
      >
        <Accessibility className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-xl p-6 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" role="heading" aria-level="3">
          Accessibility
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close accessibility panel"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsOpen(false)
            }
          }}
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Type className="w-4 h-4" />
            Font Size: {fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Adjust font size"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12px</span>
            <span>24px</span>
          </div>
        </div>

        {/* High Contrast */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <Contrast className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast Mode
            </span>
          </label>
        </div>

        {/* Reduced Motion */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduce Motion
            </span>
          </label>
        </div>

        {/* Sound */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sound Effects
            </span>
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetToDefaults}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Keyboard shortcuts: Alt+A to toggle this panel, Tab to navigate, Enter to activate.
        </p>
      </div>
    </div>
  )
}
