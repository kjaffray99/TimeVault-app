/**
 * TimeVault API Migration & Upgrade Utility
 * 
 * Handles version migrations, feature upgrades, and compatibility checks
 * Ensures smooth transitions between API versions
 */

import { ApiHealthMonitor, type ApiConfiguration } from './health';

// Migration Status
interface MigrationStatus {
    fromVersion: string;
    toVersion: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
    steps: MigrationStep[];
    rollbackAvailable: boolean;
}

interface MigrationStep {
    id: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: number;
    endTime?: number;
    error?: string;
    rollbackAction?: () => Promise<void>;
}

// Compatibility Check Results
interface CompatibilityCheck {
    version: string;
    compatible: boolean;
    issues: CompatibilityIssue[];
    recommendations: string[];
    upgradeRequired: boolean;
}

interface CompatibilityIssue {
    severity: 'low' | 'medium' | 'high' | 'critical';
    component: string;
    description: string;
    impact: string;
    solution: string;
}

export class ApiMigrationManager {
    private static currentVersion = '3.0.0';
    private static migrationHistory: MigrationStatus[] = [];
    private static isUpgrading = false;

    // Check compatibility with current system
    static async checkCompatibility(targetVersion?: string): Promise<CompatibilityCheck> {
        const version = targetVersion || this.currentVersion;
        console.log(`🔍 Checking compatibility for version ${version}...`);

        const issues: CompatibilityIssue[] = [];
        const recommendations: string[] = [];

        try {
            // Check browser compatibility
            await this.checkBrowserCompatibility(issues, recommendations);

            // Check storage availability
            await this.checkStorageCompatibility(issues, recommendations);

            // Check API endpoints
            await this.checkApiCompatibility(issues, recommendations);

            // Check feature dependencies
            await this.checkFeatureCompatibility(issues, recommendations);

            const compatible = !issues.some(issue => issue.severity === 'critical');
            const upgradeRequired = issues.some(issue => issue.severity === 'high' || issue.severity === 'critical');

            console.log(`✅ Compatibility check complete: ${compatible ? 'Compatible' : 'Issues found'}`);

            return {
                version,
                compatible,
                issues,
                recommendations,
                upgradeRequired
            };
        } catch (error) {
            console.error('❌ Compatibility check failed:', error);

            return {
                version,
                compatible: false,
                issues: [{
                    severity: 'critical',
                    component: 'compatibility_checker',
                    description: 'Failed to run compatibility check',
                    impact: 'Cannot determine system compatibility',
                    solution: 'Check browser console for detailed error information'
                }],
                recommendations: ['Refresh the page and try again', 'Contact support if the issue persists'],
                upgradeRequired: true
            };
        }
    }

    // Perform automatic migration
    static async migrateToVersion(targetVersion: string, config?: Partial<ApiConfiguration>): Promise<MigrationStatus> {
        if (this.isUpgrading) {
            throw new Error('Migration already in progress');
        }

        this.isUpgrading = true;
        console.log(`🚀 Starting migration to version ${targetVersion}...`);

        const migration: MigrationStatus = {
            fromVersion: this.getCurrentVersion(),
            toVersion: targetVersion,
            status: 'in-progress',
            startTime: Date.now(),
            steps: [],
            rollbackAvailable: true
        };

        try {
            // Plan migration steps
            const steps = await this.planMigrationSteps(migration.fromVersion, targetVersion);
            migration.steps = steps;

            console.log(`📋 Migration plan: ${steps.length} steps`);

            // Execute migration steps
            for (const step of steps) {
                await this.executeStep(step);
                if (step.status === 'failed') {
                    migration.status = 'failed';
                    throw new Error(`Migration step failed: ${step.description}`);
                }
            }

            // Update configuration if provided
            if (config) {
                await this.updateConfiguration(config);
            }

            // Verify migration success
            const health = await ApiHealthMonitor.checkHealth();
            if (health.status === 'unhealthy') {
                throw new Error('System unhealthy after migration');
            }

            migration.status = 'completed';
            migration.endTime = Date.now();

            console.log(`✅ Migration to version ${targetVersion} completed successfully`);
            console.log(`⏱️ Migration time: ${migration.endTime - migration.startTime}ms`);

        } catch (error) {
            console.error(`❌ Migration to version ${targetVersion} failed:`, error);

            migration.status = 'failed';
            migration.endTime = Date.now();

            // Attempt rollback if possible
            if (migration.rollbackAvailable) {
                console.log('🔄 Attempting rollback...');
                await this.rollbackMigration(migration);
            }

            throw error;
        } finally {
            this.migrationHistory.push(migration);
            this.isUpgrading = false;
        }

        return migration;
    }

    // Get migration history
    static getMigrationHistory(): MigrationStatus[] {
        return [...this.migrationHistory];
    }

    // Get current version
    static getCurrentVersion(): string {
        try {
            // Try to get version from stored configuration
            const stored = localStorage.getItem('timevault_api_version');
            return stored || this.currentVersion;
        } catch {
            return this.currentVersion;
        }
    }

    // Check if system needs upgrade
    static async needsUpgrade(): Promise<boolean> {
        const compatibility = await this.checkCompatibility();
        return compatibility.upgradeRequired;
    }

    // Auto-upgrade system
    static async autoUpgrade(): Promise<void> {
        const needsUpgrade = await this.needsUpgrade();

        if (needsUpgrade) {
            console.log('🔧 Auto-upgrade triggered');
            await this.migrateToVersion(this.currentVersion);
        } else {
            console.log('✅ System is up to date');
        }
    }

    // Development and testing utilities
    static async simulateMigration(targetVersion: string): Promise<MigrationStatus> {
        console.log(`🧪 Simulating migration to version ${targetVersion}...`);

        const steps = await this.planMigrationSteps(this.getCurrentVersion(), targetVersion);

        return {
            fromVersion: this.getCurrentVersion(),
            toVersion: targetVersion,
            status: 'completed',
            startTime: Date.now(),
            endTime: Date.now() + 5000, // Simulate 5 second migration
            steps: steps.map(step => ({ ...step, status: 'completed' as const })),
            rollbackAvailable: true
        };
    }

    static exportMigrationReport(): object {
        return {
            currentVersion: this.getCurrentVersion(),
            migrationHistory: this.getMigrationHistory(),
            isUpgrading: this.isUpgrading,
            timestamp: new Date().toISOString()
        };
    }

    // Private helper methods
    private static async checkBrowserCompatibility(issues: CompatibilityIssue[], recommendations: string[]): Promise<void> {
        // Check for required browser features
        const requiredFeatures = [
            { name: 'localStorage', test: () => typeof Storage !== 'undefined' },
            { name: 'fetch', test: () => typeof fetch !== 'undefined' },
            { name: 'Promise', test: () => typeof Promise !== 'undefined' },
            { name: 'async/await', test: () => true }, // Assume supported if we got this far
            { name: 'modules', test: () => typeof window !== 'undefined' && 'import' in window }
        ];

        for (const feature of requiredFeatures) {
            if (!feature.test()) {
                issues.push({
                    severity: 'critical',
                    component: 'browser',
                    description: `Browser does not support ${feature.name}`,
                    impact: 'Application will not function properly',
                    solution: 'Update to a modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)'
                });
            }
        }

        // Check user agent for known issues
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('internet explorer')) {
            issues.push({
                severity: 'critical',
                component: 'browser',
                description: 'Internet Explorer is not supported',
                impact: 'Application will not function',
                solution: 'Switch to a modern browser like Chrome, Firefox, Safari, or Edge'
            });
        }
    }

    private static async checkStorageCompatibility(issues: CompatibilityIssue[], recommendations: string[]): Promise<void> {
        try {
            // Test localStorage
            const testKey = 'timevault_storage_test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
        } catch (error) {
            issues.push({
                severity: 'high',
                component: 'storage',
                description: 'localStorage is not available or full',
                impact: 'Cannot save user preferences and cache data',
                solution: 'Clear browser storage or enable localStorage in browser settings'
            });
        }

        try {
            // Test sessionStorage
            const testKey = 'timevault_session_test';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
        } catch (error) {
            issues.push({
                severity: 'medium',
                component: 'storage',
                description: 'sessionStorage is not available',
                impact: 'Cannot maintain session state',
                solution: 'Enable sessionStorage in browser settings'
            });
        }
    }

    private static async checkApiCompatibility(issues: CompatibilityIssue[], recommendations: string[]): Promise<void> {
        // Check if running on HTTPS (required for some APIs)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            issues.push({
                severity: 'high',
                component: 'security',
                description: 'Application not served over HTTPS',
                impact: 'Some features may not work properly',
                solution: 'Serve application over HTTPS'
            });
        }

        // Check for CORS restrictions
        try {
            // This is a simple test - in production you'd test actual API endpoints
            await fetch('data:text/plain,test', { method: 'HEAD' });
        } catch (error) {
            recommendations.push('Check network connectivity and CORS configuration');
        }
    }

    private static async checkFeatureCompatibility(issues: CompatibilityIssue[], recommendations: string[]): Promise<void> {
        // Check Web3 compatibility for wallet features
        if (typeof window !== 'undefined' && !window.ethereum && !window.solana) {
            recommendations.push('Install a Web3 wallet browser extension for full functionality');
        }

        // Check for required permissions
        if ('permissions' in navigator) {
            try {
                const permission = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName });
                if (permission.state === 'denied') {
                    recommendations.push('Grant persistent storage permission for better performance');
                }
            } catch (error) {
                // Permission API not fully supported, that's okay
            }
        }
    }

    private static async planMigrationSteps(fromVersion: string, toVersion: string): Promise<MigrationStep[]> {
        const steps: MigrationStep[] = [];

        // Version-specific migration steps
        if (fromVersion < '3.0.0' && toVersion >= '3.0.0') {
            steps.push({
                id: 'backup_data',
                description: 'Backup existing data',
                status: 'pending'
            });

            steps.push({
                id: 'update_storage_schema',
                description: 'Update storage schema to v3.0',
                status: 'pending'
            });

            steps.push({
                id: 'migrate_customer_data',
                description: 'Migrate customer experience data',
                status: 'pending'
            });

            steps.push({
                id: 'initialize_orchestrator',
                description: 'Initialize API orchestrator',
                status: 'pending'
            });

            steps.push({
                id: 'verify_health',
                description: 'Verify system health',
                status: 'pending'
            });
        }

        return steps;
    }

    private static async executeStep(step: MigrationStep): Promise<void> {
        console.log(`🔄 Executing step: ${step.description}`);
        step.status = 'running';
        step.startTime = Date.now();

        try {
            switch (step.id) {
                case 'backup_data':
                    await this.backupData();
                    break;

                case 'update_storage_schema':
                    await this.updateStorageSchema();
                    break;

                case 'migrate_customer_data':
                    await this.migrateCustomerData();
                    break;

                case 'initialize_orchestrator':
                    await this.initializeOrchestrator();
                    break;

                case 'verify_health':
                    await this.verifySystemHealth();
                    break;

                default:
                    console.warn(`⚠️ Unknown migration step: ${step.id}`);
                    step.status = 'skipped';
                    return;
            }

            step.status = 'completed';
            step.endTime = Date.now();
            console.log(`✅ Step completed: ${step.description}`);

        } catch (error) {
            step.status = 'failed';
            step.endTime = Date.now();
            step.error = error.message;
            console.error(`❌ Step failed: ${step.description}`, error);
            throw error;
        }
    }

    private static async backupData(): Promise<void> {
        const backup = {
            timestamp: Date.now(),
            localStorage: { ...localStorage },
            sessionStorage: { ...sessionStorage }
        };

        localStorage.setItem('timevault_backup', JSON.stringify(backup));
    }

    private static async updateStorageSchema(): Promise<void> {
        // Update storage keys to new format
        const oldKeys = Object.keys(localStorage).filter(key => key.startsWith('timevault_'));

        for (const key of oldKeys) {
            if (!key.includes('v3_')) {
                const value = localStorage.getItem(key);
                const newKey = key.replace('timevault_', 'timevault_v3_');
                localStorage.setItem(newKey, value);
            }
        }
    }

    private static async migrateCustomerData(): Promise<void> {
        // Migrate customer experience data to new format
        const oldData = localStorage.getItem('customer_experience_data');
        if (oldData) {
            try {
                const parsed = JSON.parse(oldData);
                const migrated = {
                    version: '3.0.0',
                    ...parsed,
                    migratedAt: Date.now()
                };
                localStorage.setItem('timevault_v3_customer_experience', JSON.stringify(migrated));
            } catch (error) {
                console.warn('⚠️ Failed to migrate customer data:', error);
            }
        }
    }

    private static async initializeOrchestrator(): Promise<void> {
        const { ApiOrchestrator } = await import('../core/orchestrator');
        await ApiOrchestrator.initialize();
    }

    private static async verifySystemHealth(): Promise<void> {
        const health = await ApiHealthMonitor.checkHealth();
        if (health.status === 'unhealthy') {
            throw new Error('System health check failed after migration');
        }
    }

    private static async rollbackMigration(migration: MigrationStatus): Promise<void> {
        console.log('🔄 Rolling back migration...');

        try {
            // Restore from backup
            const backup = localStorage.getItem('timevault_backup');
            if (backup) {
                const parsed = JSON.parse(backup);

                // Clear current state
                localStorage.clear();
                sessionStorage.clear();

                // Restore backup
                Object.entries(parsed.localStorage).forEach(([key, value]) => {
                    localStorage.setItem(key, value as string);
                });

                Object.entries(parsed.sessionStorage).forEach(([key, value]) => {
                    sessionStorage.setItem(key, value as string);
                });

                console.log('✅ Rollback completed successfully');
            } else {
                console.warn('⚠️ No backup found for rollback');
            }
        } catch (error) {
            console.error('❌ Rollback failed:', error);
            throw error;
        }
    }

    private static async updateConfiguration(config: Partial<ApiConfiguration>): Promise<void> {
        const configString = JSON.stringify(config);
        localStorage.setItem('timevault_v3_config', configString);
    }
}
