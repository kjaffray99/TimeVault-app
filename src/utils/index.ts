/**
 * TimeVault Utility Functions
 * Pure helper functions for common operations
 */

// ========================================
// FORMATTING UTILITIES
// ========================================

/**
 * Formats currency values with proper locale and precision
 */
export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US',
  minimumFractionDigits = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

/**
 * Formats large numbers with appropriate suffixes (K, M, B, T)
 */
export const formatLargeNumber = (value: number, precision = 1): string => {
  if (value < 1000) {
    return value.toFixed(precision);
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3);
  const scaledValue = value / Math.pow(1000, magnitude);
  
  return `${scaledValue.toFixed(precision)}${suffixes[magnitude] || ''}`;
};

/**
 * Formats metal amounts with appropriate precision
 */
export const formatMetal = (amount: number, unit = 'oz'): string => {
  if (amount < 0.001) {
    return `${amount.toExponential(2)} ${unit}`;
  }
  if (amount < 0.01) {
    return `${amount.toFixed(4)} ${unit}`;
  }
  if (amount < 1) {
    return `${amount.toFixed(3)} ${unit}`;
  }
  return `${amount.toFixed(2)} ${unit}`;
};

/**
 * Formats percentage changes with appropriate styling
 */
export const formatPercentage = (value: number, precision = 2): string => {
  const formatted = Math.abs(value).toFixed(precision);
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatted}%`;
};

/**
 * Formats time duration in human-readable format
 */
export const formatTimeDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  }
  if (hours < 168) { // 24 * 7
    const days = (hours / 24).toFixed(1);
    return `${days} days`;
  }
  const weeks = (hours / 168).toFixed(1);
  return `${weeks} weeks`;
};

// ========================================
// CALCULATION UTILITIES
// ========================================

/**
 * Calculates percentage change between two values
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Converts crypto amount to USD value
 */
export const convertToUSD = (amount: number, price: number): number => {
  return amount * price;
};

/**
 * Converts USD value to metal amount
 */
export const convertToMetal = (usdValue: number, metalPrice: number): number => {
  return usdValue / metalPrice;
};

/**
 * Converts USD value to time equivalent
 */
export const convertToTime = (usdValue: number, hourlyWage: number) => {
  const hours = usdValue / hourlyWage;
  return {
    hours,
    days: hours / 8, // 8-hour work days
    weeks: hours / 40, // 40-hour work weeks
    months: hours / 160, // ~160 hours per month
  };
};

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Rounds to specified number of decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validates if a string is a valid number
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== '';
};

/**
 * Validates if a number is positive
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0 && !isNaN(value) && isFinite(value);
};

/**
 * Validates if an email address is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes user input for safe display
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"&]/g, '');
};

// ========================================
// DATE & TIME UTILITIES
// ========================================

/**
 * Formats date in user-friendly format
 */
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats time in user-friendly format
 */
export const formatTime = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Gets relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj);
};

// ========================================
// URL & ROUTING UTILITIES
// ========================================

/**
 * Generates a URL-friendly slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Parses URL parameters into an object
 */
export const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Safe localStorage operations with error handling
 */
export const storage = {
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  },

  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  },
};

// ========================================
// ERROR HANDLING UTILITIES
// ========================================

/**
 * Creates a user-friendly error message
 */
export const createErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

/**
 * Logs error with context information
 */
export const logError = (error: unknown, context?: string): void => {
  console.error(`[TimeVault Error]${context ? ` [${context}]` : ''}:`, error);
  
  // In production, you might want to send errors to a logging service
  if (import.meta.env.PROD) {
    // Send to error tracking service (e.g., Sentry, LogRocket)
  }
};
