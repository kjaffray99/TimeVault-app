/**
 * TimeVault Styling System v2.0
 * 
 * Complete design system with automatic styling capabilities
 */

// Core design system
import './design-system.css';

// Component exports
export {
    TimeVaultButton, TimeVaultCard, TimeVaultContainer, TimeVaultGrid,
    TimeVaultHeading, TimeVaultInput,
    TimeVaultSelect, TimeVaultStack, timeVaultMixins, useTimeVaultStyles,
    withTimeVaultStyles
} from './components';

// Theme system
export {
    TimeVaultThemeProvider, createTimeVaultStyledComponent, useTimeVaultCSSVars, useTimeVaultTheme,
    withTimeVaultTheme
} from './ThemeProvider';

// Automation system
export {
    AutoStyled, createStyleObserver,
    initializeTimeVaultStyling, injectTimeVaultStyles, useAutoStyles,
    useSmartStyles
} from './automation';

// Quick setup function
export const setupTimeVault = (options?: {
    automation?: boolean;
    observerOptions?: any;
}) => {
    const { automation = true, observerOptions = {} } = options || {};

    const cleanupFunctions: (() => void)[] = [];

    if (automation) {
        const { initializeTimeVaultStyling } = require('./automation');
        const cleanup = initializeTimeVaultStyling({
            injectStyles: true,
            autoObserver: true,
            observerOptions,
        });
        cleanupFunctions.push(cleanup);
    }

    return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
    };
};
