/**
 * Enhanced validation system focused on customer experience and data reliability
 * Ensures users always receive clean, validated data
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedData?: any;
    customerMessage?: string;
}

/**
 * Comprehensive API response validation with customer-friendly error handling
 */
export class ApiValidator {
    /**
     * Validate cryptocurrency data with customer experience focus
     */
    static validateCryptoData(data: unknown): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };

        if (!Array.isArray(data)) {
            result.errors.push('Invalid data format received');
            result.customerMessage = 'Unable to load cryptocurrency prices. Using cached data.';
            return result;
        }

        const validatedData = data
            .filter(item => item && typeof item === 'object')
            .map(coin => this.sanitizeCryptoAsset(coin))
            .filter(coin => coin.price > 0 && coin.id && coin.name);

        if (validatedData.length === 0) {
            result.errors.push('No valid cryptocurrency data found');
            result.customerMessage = 'Cryptocurrency data temporarily unavailable. Please try again.';
            return result;
        }

        result.isValid = true;
        result.sanitizedData = validatedData;
        return result;
    }

    /**
     * Validate metals price data for reliable customer experience
     */
    static validateMetalsData(data: unknown, metalType: string): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };

        if (!data || typeof data !== 'object') {
            result.errors.push(`Invalid ${metalType} data format`);
            result.customerMessage = `${metalType} prices temporarily unavailable. Using last known prices.`;
            return result;
        }

        const metalData = data as any;
        const price = Number(metalData.price);

        if (isNaN(price) || price <= 0) {
            result.errors.push(`Invalid ${metalType} price value`);
            result.customerMessage = `${metalType} price data issue detected. Using reliable fallback.`;
            return result;
        }

        // Sanity check for reasonable price ranges
        const priceRanges = {
            gold: { min: 1000, max: 5000 },
            silver: { min: 10, max: 100 },
            platinum: { min: 500, max: 2000 },
            palladium: { min: 1000, max: 4000 }
        };

        const range = priceRanges[metalType as keyof typeof priceRanges];
        if (range && (price < range.min || price > range.max)) {
            result.errors.push(`${metalType} price outside expected range: $${price}`);
            result.customerMessage = `${metalType} price appears unusual. Verifying data quality.`;
            return result;
        }

        result.isValid = true;
        result.sanitizedData = {
            metal: metalType,
            price: Math.round(price * 100) / 100, // Round to 2 decimal places
            unit: 'oz',
            lastUpdated: metalData.timestamp || new Date().toISOString(),
            change24h: Number(metalData.change24h) || 0
        };

        return result;
    }

    /**
     * Sanitize cryptocurrency asset data for consistent customer experience
     */
    private static sanitizeCryptoAsset(coin: any): any {
        return {
            id: String(coin.id || '').toLowerCase().slice(0, 50),
            name: String(coin.name || '').slice(0, 100),
            symbol: String(coin.symbol || '').toUpperCase().slice(0, 10),
            price: Math.max(0, Number(coin.current_price) || 0),
            priceChange24h: Number(coin.price_change_percentage_24h) || 0,
            marketCap: Math.max(0, Number(coin.market_cap) || 0),
            volume24h: Math.max(0, Number(coin.total_volume) || 0),
            icon: coin.image && typeof coin.image === 'string' ? coin.image : undefined,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Validate user input with customer-friendly feedback
     */
    static validateUserInput(input: any, type: 'amount' | 'hourlyWage' | 'search'): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };

        switch (type) {
            case 'amount':
                return this.validateAmount(input);
            case 'hourlyWage':
                return this.validateHourlyWage(input);
            case 'search':
                return this.validateSearchQuery(input);
            default:
                result.errors.push('Unknown validation type');
                result.customerMessage = 'Input validation error. Please try again.';
                return result;
        }
    }

    private static validateAmount(amount: any): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };
        const num = Number(amount);

        if (isNaN(num)) {
            result.errors.push('Amount must be a number');
            result.customerMessage = 'Please enter a valid number.';
            return result;
        }

        if (num < 0) {
            result.errors.push('Amount cannot be negative');
            result.customerMessage = 'Amount must be positive.';
            return result;
        }

        if (num > 1000000000) {
            result.errors.push('Amount too large');
            result.customerMessage = 'Please enter a smaller amount.';
            return result;
        }

        result.isValid = true;
        result.sanitizedData = Math.round(num * 100000000) / 100000000; // 8 decimal precision
        return result;
    }

    private static validateHourlyWage(wage: any): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };
        const num = Number(wage);

        if (isNaN(num)) {
            result.errors.push('Hourly wage must be a number');
            result.customerMessage = 'Please enter a valid hourly wage.';
            return result;
        }

        if (num <= 0) {
            result.errors.push('Hourly wage must be positive');
            result.customerMessage = 'Hourly wage must be greater than $0.';
            return result;
        }

        if (num > 10000) {
            result.errors.push('Hourly wage seems unusually high');
            result.customerMessage = 'Please verify your hourly wage amount.';
            return result;
        }

        result.isValid = true;
        result.sanitizedData = Math.round(num * 100) / 100; // 2 decimal precision
        return result;
    }

    private static validateSearchQuery(query: any): ValidationResult {
        const result: ValidationResult = { isValid: false, errors: [] };

        if (typeof query !== 'string') {
            result.errors.push('Search query must be text');
            result.customerMessage = 'Please enter a search term.';
            return result;
        }

        const trimmed = query.trim();
        if (trimmed.length < 1) {
            result.errors.push('Search query too short');
            result.customerMessage = 'Please enter at least one character.';
            return result;
        }

        if (trimmed.length > 100) {
            result.errors.push('Search query too long');
            result.customerMessage = 'Search term is too long. Please shorten it.';
            return result;
        }

        // Basic sanitization
        const sanitized = trimmed.replace(/[<>\"'&]/g, '');

        result.isValid = true;
        result.sanitizedData = sanitized;
        return result;
    }
}
