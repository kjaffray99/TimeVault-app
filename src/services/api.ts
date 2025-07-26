/**
 * TimeVault Unified API System v3.0
 * 
 * Optimized for maintainability, troubleshooting, and future upgrades
 * 
 * Key Features:
 * - Centralized orchestration with intelligent routing
 * - Real-time health monitoring and diagnostics
 * - Performance optimization recommendations
 * - Comprehensive error tracking and recovery
 * - Future-proof modular architecture
 * - Customer experience optimization
 * 
 * For troubleshooting:
 * import { ApiOrchestrator } from './core/orchestrator';
 * ApiOrchestrator.runDiagnostics();
 */

// Core Orchestration System
export { ApiOrchestrator, apiOrchestrator } from './core/orchestrator';

// Health Monitoring and Configuration
export { ApiHealthMonitor, DEFAULT_CONFIG } from './config/health';
export type { ApiConfiguration, ApiHealthStatus, ServiceHealth } from './config/health';

// Legacy Bridge for Backward Compatibility
export { LegacyApiBridge } from './legacy/bridge';

// Enhanced Core Services
export { ApiService, CryptoPriceService, MetalsPriceService } from './legacy/services';

// Secure Client Interfaces
export { coinGeckoClient, metalsClient } from './legacy/clients';

// Security and Compliance
export { SecurityMetrics } from './legacy/metrics';

// Customer Experience Optimization
export { CustomerExperienceService } from './customerExperience';

// Educational Content Management
export { educationalService } from './education';

// Type Definitions
export type {
  ApiResult, ComplianceReport, LegacyClientConfig, SecurityAudit
} from './legacy/types';

// Core Application Types
export type { CryptoAsset, PreciousMetalPrice } from '../types';

