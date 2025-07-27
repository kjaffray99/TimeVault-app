/**
 * Application Context Providers
 * Centralized state management for core application data
 */

import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '../constants';

// ========================================
// USER CONTEXT
// ========================================

interface UserState {
  isAuthenticated: boolean;
  isPremium: boolean;
  walletAddress: string | null;
  streak: number;
  calculationCount: number;
  achievements: string[];
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: boolean;
  autoRefresh: boolean;
}

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  updateStreak: (streak: number) => void;
  incrementCalculations: () => void;
  unlockAchievement: (achievementId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

type UserAction =
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PREMIUM'; payload: boolean }
  | { type: 'SET_WALLET'; payload: string | null }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'INCREMENT_CALCULATIONS' }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'LOAD_USER_DATA'; payload: Partial<UserState> };

const initialUserState: UserState = {
  isAuthenticated: false,
  isPremium: false,
  walletAddress: null,
  streak: 0,
  calculationCount: 0,
  achievements: [],
  preferences: {
    theme: 'light',
    currency: 'USD',
    notifications: true,
    autoRefresh: true,
  },
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'SET_WALLET':
      return { ...state, walletAddress: action.payload };
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload };
    case 'INCREMENT_CALCULATIONS':
      return { ...state, calculationCount: state.calculationCount + 1 };
    case 'UNLOCK_ACHIEVEMENT':
      if (!state.achievements.includes(action.payload)) {
        return { ...state, achievements: [...state.achievements, action.payload] };
      }
      return state;
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case 'LOAD_USER_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Load user data from localStorage on mount
  React.useEffect(() => {
    const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
    const savedCount = localStorage.getItem(STORAGE_KEYS.CALCULATION_COUNT);
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_HISTORY);
    const savedPremium = localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);

    const userData: Partial<UserState> = {};

    if (savedStreak) userData.streak = parseInt(savedStreak);
    if (savedCount) userData.calculationCount = parseInt(savedCount);
    if (savedPreferences) userData.preferences = { ...state.preferences, ...JSON.parse(savedPreferences) };
    if (savedAchievements) userData.achievements = JSON.parse(savedAchievements);
    if (savedPremium) userData.isPremium = JSON.parse(savedPremium);

    if (Object.keys(userData).length > 0) {
      dispatch({ type: 'LOAD_USER_DATA', payload: userData });
    }
  }, []);

  const updateStreak = (streak: number) => {
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
    dispatch({ type: 'UPDATE_STREAK', payload: streak });
  };

  const incrementCalculations = () => {
    const newCount = state.calculationCount + 1;
    localStorage.setItem(STORAGE_KEYS.CALCULATION_COUNT, newCount.toString());
    dispatch({ type: 'INCREMENT_CALCULATIONS' });
  };

  const unlockAchievement = (achievementId: string) => {
    const newAchievements = [...state.achievements, achievementId];
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_HISTORY, JSON.stringify(newAchievements));
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId });
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    const newPreferences = { ...state.preferences, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(newPreferences));
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  return (
    <UserContext.Provider value={{
      state,
      dispatch,
      updateStreak,
      incrementCalculations,
      unlockAchievement,
      updatePreferences,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// ========================================
// THEME CONTEXT
// ========================================

interface ThemeState {
  theme: 'light' | 'dark';
  colors: Record<string, string>;
}

interface ThemeContextType {
  state: ThemeState;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const lightTheme = {
  primary: '#001F3F',
  accent: '#D4AF37',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
};

const darkTheme = {
  primary: '#1A365D',
  accent: '#D4AF37',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B3B8',
};

const initialThemeState: ThemeState = {
  theme: 'light',
  colors: lightTheme,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<ThemeState>(initialThemeState);

  const setTheme = (theme: 'light' | 'dark') => {
    setState({
      theme,
      colors: theme === 'light' ? lightTheme : darkTheme,
    });
  };

  const toggleTheme = () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ state, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
