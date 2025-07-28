/**
 * Input Sanitization and Validation for TimeVault
 * Prevents XSS, injection attacks, and data corruption
 */

interface SanitizationOptions {
    allowHtml?: boolean;
    maxLength?: number;
    allowedChars?: RegExp;
    trimWhitespace?: boolean;
    convertToNumber?: boolean;
}

interface ValidationResult {
    isValid: boolean;
    sanitizedValue: any;
    errors: string[];
    warnings: string[];
}

class InputSanitizer {
    private static readonly DEFAULT_MAX_LENGTH = 1000;
    private static readonly DANGEROUS_HTML_PATTERN = /<script|<iframe|<object|<embed|<link|<meta|<style|javascript:|vbscript:|data:/gi;
    private static readonly SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b|['"`;])/gi;

    /**
     * Sanitize and validate user input
     */
    public static sanitizeInput(
        input: any,
        type: 'text' | 'number' | 'email' | 'url' | 'crypto' | 'amount',
        options: SanitizationOptions = {}
    ): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            sanitizedValue: input,
            errors: [],
            warnings: []
        };

        // Handle null/undefined
        if (input === null || input === undefined) {
            result.sanitizedValue = '';
            return result;
        }

        // Convert to string for processing
        let value = String(input);

        // Trim whitespace if enabled (default: true)
        if (options.trimWhitespace !== false) {
            value = value.trim();
        }

        // Check length limits
        const maxLength = options.maxLength || this.DEFAULT_MAX_LENGTH;
        if (value.length > maxLength) {
            result.errors.push(`Input exceeds maximum length of ${maxLength} characters`);
            result.isValid = false;
            value = value.substring(0, maxLength);
            result.warnings.push('Input was truncated to maximum length');
        }

        // Type-specific validation and sanitization
        switch (type) {
            case 'text':
                result.sanitizedValue = this.sanitizeText(value, options);
                break;

            case 'number':
            case 'amount':
                result.sanitizedValue = this.sanitizeNumber(value, type === 'amount');
                break;

            case 'email':
                result.sanitizedValue = this.sanitizeEmail(value);
                break;

            case 'url':
                result.sanitizedValue = this.sanitizeUrl(value);
                break;

            case 'crypto':
                result.sanitizedValue = this.sanitizeCryptoInput(value);
                break;

            default:
                result.sanitizedValue = this.sanitizeText(value, options);
        }

        // Final validation checks
        this.performSecurityChecks(result.sanitizedValue, result);

        return result;
    }

    /**
     * Sanitize text input
     */
    private static sanitizeText(value: string, options: SanitizationOptions): string {
        let sanitized = value;

        // Remove dangerous HTML if not explicitly allowed
        if (!options.allowHtml) {
            sanitized = sanitized.replace(this.DANGEROUS_HTML_PATTERN, '');

            // Escape HTML entities
            sanitized = sanitized
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        }

        // Apply character restrictions
        if (options.allowedChars) {
            sanitized = sanitized.replace(options.allowedChars, '');
        }

        return sanitized;
    }

    /**
     * Sanitize and validate numeric input
     */
    private static sanitizeNumber(value: string, isAmount: boolean = false): number | null {
        // Remove non-numeric characters except decimal point and minus
        const cleaned = value.replace(/[^0-9.-]/g, '');

        if (cleaned === '' || cleaned === '-' || cleaned === '.') {
            return null;
        }

        const num = parseFloat(cleaned);

        if (isNaN(num)) {
            return null;
        }

        // For amounts, ensure positive values and reasonable limits
        if (isAmount) {
            if (num < 0) return 0;
            if (num > 1000000000) return 1000000000; // 1 billion max

            // Round to 8 decimal places (crypto precision)
            return Math.round(num * 100000000) / 100000000;
        }

        return num;
    }

    /**
     * Sanitize email input
     */
    private static sanitizeEmail(value: string): string {
        // Basic email sanitization
        const cleaned = value.toLowerCase().trim();

        // Remove dangerous characters
        return cleaned.replace(/[<>'"()[\]{}\\]/g, '');
    }

    /**
     * Sanitize URL input
     */
    private static sanitizeUrl(value: string): string {
        const cleaned = value.trim();

        // Only allow http/https URLs
        if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
            return '';
        }

        try {
            const url = new URL(cleaned);

            // Validate allowed domains
            const allowedDomains = [
                'coingecko.com',
                'metals.live',
                'thirdweb.com',
                'timevaultai.com',
                'timevault.com'
            ];

            const isAllowed = allowedDomains.some(domain =>
                url.hostname === domain || url.hostname.endsWith(`.${domain}`)
            );

            return isAllowed ? url.toString() : '';
        } catch {
            return '';
        }
    }

    /**
     * Sanitize cryptocurrency-related input
     */
    private static sanitizeCryptoInput(value: string): string {
        const cleaned = value.toUpperCase().trim();

        // Allow only alphanumeric characters, spaces, and common crypto symbols
        return cleaned.replace(/[^A-Z0-9\s.-]/g, '');
    }

    /**
     * Perform additional security checks
     */
    private static performSecurityChecks(value: any, result: ValidationResult): void {
        const stringValue = String(value);

        // Check for SQL injection patterns
        if (this.SQL_INJECTION_PATTERN.test(stringValue)) {
            result.errors.push('Invalid characters detected');
            result.isValid = false;
        }

        // Check for script injection
        if (this.DANGEROUS_HTML_PATTERN.test(stringValue)) {
            result.errors.push('Potentially dangerous content detected');
            result.isValid = false;
        }

        // Check for excessive special characters (potential encoding attack)
        const specialCharCount = (stringValue.match(/[^a-zA-Z0-9\s]/g) || []).length;
        if (specialCharCount > stringValue.length * 0.3) {
            result.warnings.push('High number of special characters detected');
        }
    }

    /**
     * Sanitize object properties recursively
     */
    public static sanitizeObject(obj: any, typeMap: Record<string, string> = {}): any {
        if (obj === null || obj === undefined) {
            return obj;
        }

        if (typeof obj !== 'object') {
            return this.sanitizeInput(obj, 'text').sanitizedValue;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item, typeMap));
        }

        const sanitized: any = {};

        for (const [key, value] of Object.entries(obj)) {
            const type = typeMap[key] || 'text';

            if (typeof value === 'object') {
                sanitized[key] = this.sanitizeObject(value, typeMap);
            } else {
                const result = this.sanitizeInput(value, type as any);
                if (result.isValid) {
                    sanitized[key] = result.sanitizedValue;
                }
            }
        }

        return sanitized;
    }

    /**
     * Create a secure hash of sensitive data
     */
    public static async createSecureHash(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Generate secure random token
     */
    public static generateSecureToken(length: number = 32): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}

// Export sanitization helpers for components
export const sanitizeCalculatorInput = (input: any) =>
    InputSanitizer.sanitizeInput(input, 'amount');

export const sanitizeCryptoSymbol = (symbol: any) =>
    InputSanitizer.sanitizeInput(symbol, 'crypto');

export const sanitizeUserInput = (input: any) =>
    InputSanitizer.sanitizeInput(input, 'text');

export const sanitizeFormData = (data: any) =>
    InputSanitizer.sanitizeObject(data, {
        amount: 'amount',
        cryptocurrency: 'crypto',
        email: 'email',
        url: 'url'
    });

export { InputSanitizer };
export default InputSanitizer;
