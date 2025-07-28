/**
 * Security Configuration Manager
 * Centralized security settings and validation
 */

interface SecurityConfig {
    csp: {
        nonce: string;
        allowedDomains: string[];
        scriptSrc: string[];
        styleSrc: string[];
    };
    rateLimit: {
        api: number;
        user: number;
        burst: number;
    };
    headers: {
        hsts: boolean;
        hstsMaxAge: number;
        noSniff: boolean;
        frameOptions: string;
        xssProtection: boolean;
    };
    encryption: {
        algorithm: string;
        keyLength: number;
        ivLength: number;
    };
    validation: {
        maxRequestSize: number;
        allowedOrigins: string[];
        trustedDomains: string[];
    };
}

class SecurityManager {
    private static instance: SecurityManager;
    private config: SecurityConfig;

    private constructor() {
        this.config = this.loadSecurityConfig();
        this.validateEnvironment();
    }

    public static getInstance(): SecurityManager {
        if (!SecurityManager.instance) {
            SecurityManager.instance = new SecurityManager();
        }
        return SecurityManager.instance;
    }

    private loadSecurityConfig(): SecurityConfig {
        const isProduction = import.meta.env.PROD;

        return {
            csp: {
                nonce: this.generateNonce(),
                allowedDomains: this.parseAllowedDomains(),
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'", // Required for React
                    "https://www.googletagmanager.com",
                    "https://fonts.googleapis.com"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // Required for styled-components
                    "https://fonts.googleapis.com"
                ]
            },
            rateLimit: {
                api: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
                user: parseInt(import.meta.env.VITE_USER_RATE_LIMIT || '50'),
                burst: 20
            },
            headers: {
                hsts: isProduction,
                hstsMaxAge: parseInt(import.meta.env.VITE_HSTS_MAX_AGE || '31536000'),
                noSniff: true,
                frameOptions: 'DENY',
                xssProtection: true
            },
            encryption: {
                algorithm: 'AES-256-GCM',
                keyLength: 32,
                ivLength: 16
            },
            validation: {
                maxRequestSize: parseInt(import.meta.env.VITE_MAX_REQUEST_SIZE || '1048576'),
                allowedOrigins: this.parseAllowedOrigins(),
                trustedDomains: [
                    'timevaultai.com',
                    'timevault.com',
                    'api.coingecko.com',
                    'api.metals.live',
                    'thirdweb.com'
                ]
            }
        };
    }

    private validateEnvironment(): void {
        const requiredVars = [
            'VITE_THIRDWEB_CLIENT_ID',
            'VITE_COINGECKO_API_URL',
            'VITE_METALS_API_URL'
        ];

        const missing = requiredVars.filter(
            varName => !import.meta.env[varName]
        );

        if (missing.length > 0) {
            console.warn('⚠️ Missing environment variables:', missing);

            if (import.meta.env.PROD) {
                throw new Error(`Production deployment missing required environment variables: ${missing.join(', ')}`);
            }
        }
    }

    private generateNonce(): string {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    private parseAllowedDomains(): string[] {
        const domains = import.meta.env.VITE_ALLOWED_DOMAINS || 'localhost:3000,localhost:5173';
        return domains.split(',').map((domain: string) => domain.trim());
    }

    private parseAllowedOrigins(): string[] {
        if (import.meta.env.PROD) {
            return [
                'https://timevaultai.com',
                'https://www.timevaultai.com',
                'https://timevault.com',
                'https://www.timevault.com'
            ];
        }

        return [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173'
        ];
    }

    // Public API methods
    public getCSPHeader(): string {
        const { csp } = this.config;

        return [
            `default-src 'self'`,
            `script-src ${csp.scriptSrc.join(' ')}`,
            `style-src ${csp.styleSrc.join(' ')}`,
            `img-src 'self' data: https:`,
            `connect-src 'self' https://api.coingecko.com https://api.metals.live https://*.thirdweb.com`,
            `font-src 'self' https://fonts.gstatic.com`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `frame-ancestors 'none'`
        ].join('; ');
    }

    public getSecurityHeaders(): Record<string, string> {
        const { headers } = this.config;

        const securityHeaders: Record<string, string> = {
            'Content-Security-Policy': this.getCSPHeader(),
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': headers.frameOptions,
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        };

        if (headers.hsts) {
            securityHeaders['Strict-Transport-Security'] =
                `max-age=${headers.hstsMaxAge}; includeSubDomains; preload`;
        }

        return securityHeaders;
    }

    public validateOrigin(origin: string): boolean {
        return this.config.validation.allowedOrigins.includes(origin);
    }

    public validateDomain(domain: string): boolean {
        return this.config.validation.trustedDomains.some(
            trusted => domain === trusted || domain.endsWith(`.${trusted}`)
        );
    }

    public getRateLimits(): { api: number; user: number; burst: number } {
        return this.config.rateLimit;
    }

    public getMaxRequestSize(): number {
        return this.config.validation.maxRequestSize;
    }

    public sanitizeError(error: any): any {
        // Remove sensitive information from error objects
        const sanitized = {
            message: error.message || 'An error occurred',
            code: error.code || 'UNKNOWN_ERROR',
            timestamp: new Date().toISOString()
        };

        // Remove potentially sensitive fields
        const sensitiveFields = [
            'stack', 'config', 'request', 'response',
            'apiKey', 'token', 'secret', 'password',
            'authorization', 'cookie', 'session'
        ];

        return Object.fromEntries(
            Object.entries(sanitized).filter(
                ([key]) => !sensitiveFields.includes(key.toLowerCase())
            )
        );
    }

    public maskSensitiveData(data: any): any {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const masked = { ...data };
        const sensitivePatterns = [
            /api[_-]?key/i,
            /secret/i,
            /token/i,
            /password/i,
            /private[_-]?key/i,
            /authorization/i,
            /x-api-key/i
        ];

        Object.keys(masked).forEach(key => {
            if (sensitivePatterns.some(pattern => pattern.test(key))) {
                masked[key] = '***MASKED***';
            } else if (typeof masked[key] === 'object') {
                masked[key] = this.maskSensitiveData(masked[key]);
            }
        });

        return masked;
    }
}

export const securityManager = SecurityManager.getInstance();
export default SecurityManager;
