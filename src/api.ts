/**
 * TimeVault Unified API System v3.0
 * 
 * Main entry point for all TimeVault application modules
 * Optimized for maintainability, troubleshooting, and future upgrades
 * 
 * Quick Start:
 * ```typescript
 * import { ApiOrchestrator } from './src/api';
 * 
 * // Initialize with health monitoring
 * await ApiOrchestrator.initialize();
 * 
 * // Fetch market data with intelligent caching
 * const result = await ApiOrchestrator.getMarketData();
 * ```
 * 
 * Troubleshooting:
 * ```typescript
 * import { ApiOrchestrator, ApiDebugger } from './src/api';
 * 
 * // Run comprehensive diagnostics
 * const diagnostics = await ApiOrchestrator.runDiagnostics();
 * 
 * // Get optimization recommendations
 * const recommendations = await ApiOrchestrator.getOptimizationRecommendations();
 * ```
 */

// === CORE ORCHESTRATION SYSTEM ===
export { ApiOrchestrator, apiOrchestrator } from './services/core/orchestrator';

// === HEALTH MONITORING & CONFIGURATION ===
export { ApiDebugger, ApiHealthMonitor, DEFAULT_CONFIG } from './services/config/health';
export { ApiMigrationManager } from './services/config/migration';

// === CUSTOMER EXPERIENCE OPTIMIZATION ===
export { useCustomerService } from './hooks/useCustomerService';
export { CustomerExperienceService } from './services/customerExperience';

// === CUSTOMER EXPERIENCE COMPONENTS ===
export { CustomerServiceDashboard } from './components/Dashboard/CustomerServiceDashboard';
export { FeedbackModal } from './components/Feedback/FeedbackModal';
export { HelpWidget } from './components/Support/HelpWidget';

// === LEGACY SERVICES (Backward Compatibility) ===
export { ApiService, CryptoPriceService, MetalsPriceService } from './services';
export { LegacyApiBridge } from './services/legacy/bridge';
export { coinGeckoClient, metalsClient } from './services/legacy/clients';
export { SecurityMetrics } from './services/legacy/metrics';

// === EDUCATIONAL CONTENT ===
export { educationalService } from './services/education';

// === TYPE DEFINITIONS ===
export type {
    ApiConfiguration,
    // Health & Configuration Types
    ApiHealthStatus,
    ServiceHealth
} from './services/config/health';

export type {
    // Legacy Types (Backward Compatibility)
    ApiResult,
    ComplianceReport,
    LegacyClientConfig,
    SecurityAudit
} from './services/legacy/types';

export type {

    // Core Application Types
    CryptoAsset,
    // Customer Experience Types
    CustomerExperienceMetrics,
    FrictionPoint, PreciousMetalPrice, SupportTicket,
    UserJourney
} from './types';

// === CONVENIENCE RE-EXPORTS ===
export * from './types';

