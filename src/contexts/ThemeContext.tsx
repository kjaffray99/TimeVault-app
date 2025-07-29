import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Partial<AppTheme>) => void;
}

const defaultLightTheme: AppTheme = {
  mode: 'light',
  primary: '#001F3F',
  accent: '#D4AF37',
  background: '#001F3F',
  surface: 'rgba(255, 255, 255, 0.05)',
  text: '#FFFFFF',
};

const defaultDarkTheme: AppTheme = {
  mode: 'dark',
  primary: '#0A1929',
  accent: '#FFD700',
  background: '#0A1929',
  surface: '#1A2332',
  text: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check for saved theme preference or default to system preference
    if (typeof window === 'undefined') return false; // SSR default

    const savedTheme = localStorage.getItem('timevault-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [theme, setThemeState] = useState<AppTheme>(
    isDarkMode ? defaultDarkTheme : defaultLightTheme
  );

  // Update theme when dark mode changes
  useEffect(() => {
    const newTheme = isDarkMode ? defaultDarkTheme : defaultLightTheme;
    setThemeState(newTheme);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', newTheme.primary);
    root.style.setProperty('--accent-color', newTheme.accent);
    root.style.setProperty('--background-color', newTheme.background);
    root.style.setProperty('--surface-color', newTheme.surface);
    root.style.setProperty('--text-color', newTheme.text);

    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('timevault-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('timevault-theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (newTheme: Partial<AppTheme>) => {
    setThemeState(prev => ({ ...prev, ...newTheme }));
  };

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for responsive design
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Predefined breakpoints hook
export const useBreakpoint = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLarge = useMediaQuery('(min-width: 1440px)');

  return React.useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    screenSize: isMobile ? 'mobile' as const :
      isTablet ? 'tablet' as const :
        isDesktop ? 'desktop' as const :
          'large' as const,
  }), [isMobile, isTablet, isDesktop, isLarge]);
};
