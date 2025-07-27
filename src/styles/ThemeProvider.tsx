/**
 * TimeVault Theme Provider
 * 
 * Provides theme context and automatic styling capabilities
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

// ========================================
// THEME TYPES
// ========================================

export interface TimeVaultTheme {
    mode: 'light' | 'dark';
    primaryColor: string;
    accentColor: string;
    surface: string;
    text: string;
    border: string;
}

export interface TimeVaultThemeConfig {
    autoDetectMode: boolean;
    persistMode: boolean;
    customColors?: Partial<TimeVaultTheme>;
}

// ========================================
// DEFAULT THEMES
// ========================================

const defaultDarkTheme: TimeVaultTheme = {
    mode: 'dark',
    primaryColor: '#001F3F',
    accentColor: '#D4AF37',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.1)',
};

const defaultLightTheme: TimeVaultTheme = {
    mode: 'light',
    primaryColor: '#001F3F',
    accentColor: '#D4AF37',
    surface: 'rgba(0, 31, 63, 0.05)',
    text: '#001F3F',
    border: 'rgba(0, 31, 63, 0.1)',
};

// ========================================
// THEME CONTEXT
// ========================================

interface TimeVaultThemeContextValue {
    theme: TimeVaultTheme;
    toggleMode: () => void;
    setTheme: (theme: Partial<TimeVaultTheme>) => void;
    applyTheme: () => void;
}

const TimeVaultThemeContext = createContext<TimeVaultThemeContextValue | null>(null);

// ========================================
// THEME PROVIDER
// ========================================

interface TimeVaultThemeProviderProps {
    children: React.ReactNode;
    config?: TimeVaultThemeConfig;
    defaultTheme?: TimeVaultTheme;
}

export const TimeVaultThemeProvider: React.FC<TimeVaultThemeProviderProps> = ({
    children,
    config = { autoDetectMode: true, persistMode: true },
    defaultTheme = defaultDarkTheme,
}) => {
    const [theme, setThemeState] = useState<TimeVaultTheme>(defaultTheme);

    // Initialize theme
    useEffect(() => {
        let initialTheme = defaultTheme;

        // Load from localStorage if persistence is enabled
        if (config.persistMode) {
            const savedTheme = localStorage.getItem('timevault-theme');
            if (savedTheme) {
                try {
                    initialTheme = { ...initialTheme, ...JSON.parse(savedTheme) };
                } catch (error) {
                    console.warn('Failed to parse saved theme:', error);
                }
            }
        }

        // Auto-detect system preference
        if (config.autoDetectMode && !localStorage.getItem('timevault-theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            initialTheme = prefersDark ? defaultDarkTheme : defaultLightTheme;
        }

        // Apply custom colors
        if (config.customColors) {
            initialTheme = { ...initialTheme, ...config.customColors };
        }

        setThemeState(initialTheme);
    }, [config, defaultTheme]);

    // Apply theme to CSS variables
    const applyTheme = () => {
        const root = document.documentElement;

        // Set CSS custom properties
        root.style.setProperty('--tv-current-mode', theme.mode);
        root.style.setProperty('--tv-current-primary', theme.primaryColor);
        root.style.setProperty('--tv-current-accent', theme.accentColor);
        root.style.setProperty('--tv-current-surface', theme.surface);
        root.style.setProperty('--tv-current-text', theme.text);
        root.style.setProperty('--tv-current-border', theme.border);

        // Add theme class to body
        document.body.className = document.body.className
            .replace(/tv-theme-\w+/g, '')
            .concat(` tv-theme-${theme.mode}`)
            .trim();
    };

    // Apply theme whenever it changes
    useEffect(() => {
        applyTheme();

        // Persist theme if enabled
        if (config.persistMode) {
            localStorage.setItem('timevault-theme', JSON.stringify(theme));
        }
    }, [theme, config.persistMode]);

    // Toggle between light and dark mode
    const toggleMode = () => {
        const newMode = theme.mode === 'dark' ? 'light' : 'dark';
        const newTheme = newMode === 'dark' ? defaultDarkTheme : defaultLightTheme;
        setThemeState({ ...newTheme, ...config.customColors });
    };

    // Update theme with partial changes
    const setTheme = (partialTheme: Partial<TimeVaultTheme>) => {
        setThemeState(current => ({ ...current, ...partialTheme }));
    };

    const contextValue: TimeVaultThemeContextValue = {
        theme,
        toggleMode,
        setTheme,
        applyTheme,
    };

    return (
        <TimeVaultThemeContext.Provider value={contextValue}>
            {children}
        </TimeVaultThemeContext.Provider>
    );
};

// ========================================
// THEME HOOK
// ========================================

export const useTimeVaultTheme = () => {
    const context = useContext(TimeVaultThemeContext);
    if (!context) {
        throw new Error('useTimeVaultTheme must be used within a TimeVaultThemeProvider');
    }
    return context;
};

// ========================================
// THEME UTILITIES
// ========================================

/**
 * Higher-order component that automatically applies theme-aware styling
 */
export const withTimeVaultTheme = (
    WrappedComponent: React.ComponentType<any>
) => {
    const ThemedComponent = (props: any) => {
        const { theme } = useTimeVaultTheme();

        return (
            <WrappedComponent
                {...props}
                theme={theme}
            />
        );
    };

    ThemedComponent.displayName = `withTimeVaultTheme(${WrappedComponent.displayName || WrappedComponent.name})`;
    return ThemedComponent;
};

/**
 * Hook to get theme-aware CSS variables
 */
export const useTimeVaultCSSVars = () => {
    const { theme } = useTimeVaultTheme();

    return {
        '--tv-dynamic-primary': theme.primaryColor,
        '--tv-dynamic-accent': theme.accentColor,
        '--tv-dynamic-surface': theme.surface,
        '--tv-dynamic-text': theme.text,
        '--tv-dynamic-border': theme.border,
    } as React.CSSProperties;
};

/**
 * Utility to create theme-aware styled components
 */
export const createTimeVaultStyledComponent = (
    baseStyles: React.CSSProperties,
    themeMapper?: (theme: TimeVaultTheme) => React.CSSProperties
) => {
    return (props: { children: React.ReactNode; className?: string }) => {
        const { theme } = useTimeVaultTheme();
        const dynamicVars = useTimeVaultCSSVars();
        const themeStyles = themeMapper ? themeMapper(theme) : {};

        const combinedStyles = {
            ...baseStyles,
            ...dynamicVars,
            ...themeStyles,
        };

        return (
            <div style={combinedStyles} className={props.className}>
                {props.children}
            </div>
        );
    };
};

export default TimeVaultThemeProvider;
