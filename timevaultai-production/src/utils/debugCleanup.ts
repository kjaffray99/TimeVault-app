/**
 * 🎯 COMPREHENSIVE OVERLAY TROUBLESHOOTING FIX
 * This script completely removes all debug panels and interference
 */

// Environment Detection and Debug Panel Removal
const removeDebugOverlays = () => {
    console.log('🧹 Starting comprehensive debug overlay cleanup...');

    // Remove all debug panels by selector patterns
    const debugSelectors = [
        '[style*="position: fixed"][style*="#ff6b6b"]', // Debug panels with red borders
        '[style*="position: fixed"][style*="#D4AF37"]', // Revenue testing panels with gold borders
        '[style*="// Debug component removed"]', // Enhanced debug panels
        '[style*="// Debug component removed"]', // Standard debug panels
        '[style*="RevenueTestingPanel"]', // Revenue testing components
        '[style*="DebugRevenuePanel"]', // Debug revenue components
        '.debug-panel', // Class-based debug panels
        '.revenue-testing-panel', // Class-based revenue panels
        '.enhancement-overlay', // Enhancement overlays
        '.performance-monitor-overlay', // Performance overlays
        '[data-testid*="debug"]', // Test debug elements
        '[data-testid*="overlay"]', // Test overlay elements
    ];

    let removedCount = 0;

    debugSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            console.log(`🗑️ Removing debug element:`, element);
            element.remove();
            removedCount++;
        });
    });

    // Remove any floating or fixed position elements that look like debug panels
    const allFixedElements = document.querySelectorAll('[style*="position: fixed"]');
    allFixedElements.forEach(element => {
        const style = element.getAttribute('style') || '';
        const text = element.textContent || '';

        // Check if it looks like a debug panel
        if (
            style.includes('z-index') &&
            (text.includes('DEBUG') ||
                text.includes('TEST') ||
                text.includes('ENHANCED') ||
                text.includes('REVENUE') ||
                text.includes('Environment') ||
                style.includes('#ff6b6b') ||
                style.includes('#D4AF37'))
        ) {
            console.log(`🗑️ Removing suspected debug overlay:`, element);
            element.remove();
            removedCount++;
        }
    });

    console.log(`✅ Cleanup complete. Removed ${removedCount} debug elements.`);

    return removedCount;
};

// Enhanced cleanup that runs periodically
const startCleanupMonitoring = () => {
    console.log('🔄 Starting continuous debug overlay monitoring...');

    // Initial cleanup
    removeDebugOverlays();

    // Set up observer for new debug elements
    const observer = new MutationObserver((mutations) => {
        let needsCleanup = false;

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const element = node as Element;
                    const style = element.getAttribute('style') || '';
                    const text = element.textContent || '';

                    if (
                        style.includes('position: fixed') &&
                        (text.includes('DEBUG') || text.includes('ENHANCED') || style.includes('#ff6b6b'))
                    ) {
                        needsCleanup = true;
                    }
                }
            });
        });

        if (needsCleanup) {
            setTimeout(removeDebugOverlays, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Periodic cleanup every 5 seconds
    setInterval(() => {
        const removed = removeDebugOverlays();
        if (removed > 0) {
            console.log(`🧹 Periodic cleanup removed ${removed} debug elements`);
        }
    }, 5000);

    console.log('✅ Cleanup monitoring active');
};

// Production Environment Enforcement
const enforceProductionMode = () => {
    console.log('🏭 Enforcing production mode...');

    // Override debug mode flags
    if (typeof window !== 'undefined') {
        (window as any).DEBUG_MODE = false;
        (window as any).SHOW_DEBUG = false;
        (window as any).SHOW_REVENUE_TESTING = false;
        (window as any).DEVELOPMENT_MODE = false;

        // Clear any debug intervals
        for (let i = 1; i < 10000; i++) {
            clearInterval(i);
        }

        // Override console in production
        if (process.env.NODE_ENV === 'production') {
            console.log = () => { };
            console.warn = () => { };
            console.error = (...args) => {
                // Only show actual errors
                if (args[0] && typeof args[0] === 'string' && !args[0].includes('DEBUG')) {
                    console.error(...args);
                }
            };
        }
    }

    console.log('✅ Production mode enforced');
};

// CSS Injection to Hide Any Remaining Debug Elements
const injectCleanupCSS = () => {
    console.log('💉 Injecting cleanup CSS...');

    const style = document.createElement('style');
    style.textContent = `
        /* Hide all debug panels */
        [style*="// Debug component removed"],
        [style*="// Debug component removed"],
        [style*="RevenueTestingPanel"],
        [style*="DebugRevenuePanel"],
        .debug-panel,
        .revenue-testing-panel,
        .enhancement-overlay,
        .performance-monitor-overlay {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            z-index: -999999 !important;
        }
        
        /* Hide fixed elements that look like debug panels */
        [style*="position: fixed"][style*="#ff6b6b"],
        [style*="position: fixed"][style*="#D4AF37"]:not(.calculator-component) {
            display: none !important;
        }
        
        /* Ensure main content is always visible */
        .calculator-container,
        .main-content,
        [class*="TimeVault"],
        [class*="Calculator"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 1 !important;
        }
        
        /* Clean up any interference */
        body > div[style*="position: fixed"]:not(.calculator-component) {
            display: none !important;
        }
    `;

    document.head.appendChild(style);
    console.log('✅ Cleanup CSS injected');
};

// Main cleanup function
const comprehensiveCleanup = () => {
    console.log('🚀 Starting comprehensive overlay troubleshooting...');

    try {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                enforceProductionMode();
                injectCleanupCSS();
                startCleanupMonitoring();
            });
        } else {
            enforceProductionMode();
            injectCleanupCSS();
            startCleanupMonitoring();
        }

        console.log('✅ Comprehensive cleanup initialized');

    } catch (error) {
        console.error('❌ Cleanup error:', error);
    }
};

// Auto-execute if in browser
if (typeof window !== 'undefined') {
    comprehensiveCleanup();
}

export {
    comprehensiveCleanup, enforceProductionMode,
    injectCleanupCSS, removeDebugOverlays,
    startCleanupMonitoring
};

