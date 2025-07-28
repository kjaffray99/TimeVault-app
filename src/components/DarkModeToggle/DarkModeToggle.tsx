import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import './DarkModeToggle.css';

interface DarkModeToggleProps {
    className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { track } = useAnalytics();

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('timevault-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDarkMode(shouldUseDark);
        updateTheme(shouldUseDark);
    }, []);

    const updateTheme = (dark: boolean) => {
        if (dark) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        updateTheme(newDarkMode);
        localStorage.setItem('timevault-theme', newDarkMode ? 'dark' : 'light');

        // Track theme toggle for advanced metrics
        if (import.meta.env.VITE_ADVANCED_METRICS === 'true') {
            track('theme_toggle', {
                theme: newDarkMode ? 'dark' : 'light',
                timestamp: new Date().toISOString()
            });
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`dark-mode-toggle ${className}`}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
            <div className="toggle-icon-container">
                {isDarkMode ? (
                    <Sun className="toggle-icon sun-icon" />
                ) : (
                    <Moon className="toggle-icon moon-icon" />
                )}
            </div>
            <span className="toggle-text">
                {isDarkMode ? 'Light' : 'Dark'}
            </span>
        </button>
    );
};

export default DarkModeToggle;
