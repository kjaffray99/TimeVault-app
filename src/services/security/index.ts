/**
 * TimeVault Security Module
 * Enterprise-grade security for API services
 */

export {
    DEFAULT_SECURITY_CONFIG,
    PRODUCTION_SECURITY_CONFIG, SANITIZATION_PATTERNS,
    SECURITY_ERROR_MESSAGES, SECURITY_HEADERS, SecurityEventType,
    SecurityFlag, getSecurityConfig
} from './config';
export { SecurityMiddleware, SecurityUtils } from './utils';

export type { SecurityConfig } from './config';
