# TimeVault API Troubleshooting & Upgrade Guide v3.0

## 🚀 Quick Diagnostics

### Instant System Check
```typescript
import { ApiOrchestrator, ApiHealthMonitor } from './src/api';

// Get immediate health status
const health = await ApiHealthMonitor.checkHealth();
console.log('System Status:', health.status);

// Run comprehensive diagnostics
const diagnostics = await ApiOrchestrator.runDiagnostics();
console.log('Full Diagnostics:', diagnostics);
```

### Performance Optimization
```typescript
// Get optimization recommendations
const recommendations = await ApiOrchestrator.getOptimizationRecommendations();
recommendations.forEach(rec => console.log('💡', rec));

// Monitor active requests
const activeRequests = ApiOrchestrator.getActiveRequests();
console.log('Active Requests:', activeRequests.length);
```

## 🔧 Common Issues & Solutions

### 1. Slow API Responses

**Symptoms:**
- Market data takes > 3 seconds to load
- User interface feels sluggish
- High response times in diagnostics

**Diagnosis:**
```typescript
const metrics = ApiOrchestrator.getMetrics();
const marketDataMetrics = metrics.get('market_data');
console.log('Average Response Time:', marketDataMetrics?.averageResponseTime);
console.log('Cache Hit Rate:', marketDataMetrics?.cacheHitRate);
```

**Solutions:**
1. **Increase Cache TTL:**
   ```typescript
   ApiOrchestrator.updateConfiguration({
     limits: { cacheTtl: 600000 } // 10 minutes
   });
   ```

2. **Enable Request Batching:**
   ```typescript
   ApiOrchestrator.updateConfiguration({
     features: { realTimeMetrics: false } // Reduce background requests
   });
   ```

3. **Check Network Connectivity:**
   ```typescript
   const health = await ApiHealthMonitor.checkHealth();
   console.log('Service Dependencies:', health.services);
   ```

### 2. Customer Experience Issues

**Symptoms:**
- High friction levels reported
- Users requesting help frequently
- Poor satisfaction scores

**Diagnosis:**
```typescript
import { CustomerExperienceService } from './src/api';

const metrics = CustomerExperienceService.getCustomerServiceDashboard();
console.log('Friction Points:', metrics.topFrictionPoints);
console.log('Support Tickets:', metrics.activeTickets.length);
```

**Solutions:**
1. **Enable Proactive Support:**
   ```typescript
   import { useCustomerService } from './src/api';
   
   const { frictionLevel, triggerSupportEvent } = useCustomerService({
     enableProactiveSupport: true,
     feedbackTriggers: {
       frictionThreshold: 2 // Lower threshold for earlier intervention
     }
   });
   ```

2. **Add Context-Aware Help:**
   ```tsx
   import { HelpWidget } from './src/api';
   
   <HelpWidget 
     context="calculator" 
     autoShow={true}
     position="bottom-right"
   />
   ```

### 3. Wallet Connection Problems

**Symptoms:**
- Wallet not connecting
- User identification failing
- Anonymous sessions only

**Diagnosis:**
```typescript
// Check wallet availability
console.log('Ethereum:', window.ethereum ? 'Available' : 'Not found');
console.log('Solana:', window.solana ? 'Available' : 'Not found');

// Check customer service hook status
const { userId, frictionLevel } = useCustomerService();
console.log('User ID:', userId);
console.log('Friction Level:', frictionLevel);
```

**Solutions:**
1. **Graceful Fallback:**
   ```typescript
   // The customer service hook already handles this:
   // - Tries wallet connection first
   // - Falls back to anonymous user ID
   // - Maintains all functionality
   ```

2. **User Guidance:**
   ```tsx
   {!window.ethereum && (
     <div className="wallet-prompt">
       <p>Install MetaMask for enhanced features</p>
       <button onClick={() => window.open('https://metamask.io')}>
         Install MetaMask
       </button>
     </div>
   )}
   ```

## 📈 System Upgrades

### Pre-Upgrade Checklist

1. **Compatibility Check:**
   ```typescript
   import { ApiMigrationManager } from './src/api';
   
   const compatibility = await ApiMigrationManager.checkCompatibility('3.1.0');
   console.log('Compatible:', compatibility.compatible);
   console.log('Issues:', compatibility.issues);
   ```

2. **Backup Current State:**
   ```typescript
   const report = ApiMigrationManager.exportMigrationReport();
   console.log('Pre-upgrade state saved');
   ```

### Performing Upgrades

1. **Automatic Migration:**
   ```typescript
   // Check if upgrade needed
   const needsUpgrade = await ApiMigrationManager.needsUpgrade();
   
   if (needsUpgrade) {
     // Perform automatic upgrade
     await ApiMigrationManager.autoUpgrade();
   }
   ```

2. **Manual Migration:**
   ```typescript
   // Migrate to specific version
   const migration = await ApiMigrationManager.migrateToVersion('3.1.0', {
     features: {
       advancedAnalytics: true,
       realTimeMetrics: true
     }
   });
   
   console.log('Migration Status:', migration.status);
   ```

## 🔒 Security & Compliance

### Audit Logging
```typescript
import { SecurityMetrics } from './src/api';

// Enable comprehensive logging
ApiOrchestrator.updateConfiguration({
  security: {
    enableAuditLogging: true,
    enableEncryption: true,
    enableRateLimit: true
  }
});

// Review security metrics
const securityReport = SecurityMetrics.generateReport();
console.log('Security Status:', securityReport);
```

### Legal Compliance Check
```typescript
const health = await ApiHealthMonitor.checkHealth();
console.log('FDBR Compliant:', health.compliance.fdbr);
console.log('CS/HB 273 Compliant:', health.compliance.cshb273);
```

## 🆘 Emergency Procedures

### Complete System Recovery
```typescript
// Clear all data and reinitialize
localStorage.clear();
sessionStorage.clear();

// Reinitialize with default config
await ApiOrchestrator.initialize();
```

### Generate Support Report
```typescript
const supportReport = {
  timestamp: new Date().toISOString(),
  diagnostics: await ApiOrchestrator.runDiagnostics(),
  health: await ApiHealthMonitor.checkHealth(),
  migrationHistory: ApiMigrationManager.getMigrationHistory()
};

console.log('📋 Support Report:', supportReport);
```

## ⚡ Performance Optimization

### Best Practices
- **Cache Strategy**: Short TTL for real-time data (1-2 min), long TTL for static (30+ min)
- **Request Optimization**: Batch related requests, use background for non-critical data
- **User Experience**: Enable proactive support with lower friction thresholds
- **Monitoring**: Set up automated alerts for degraded performance

### Configuration Tuning
```typescript
// Optimized configuration for production
await ApiOrchestrator.initialize({
  environment: 'production',
  features: {
    customerExperience: true,
    proactiveSupport: true,
    advancedAnalytics: true,
    realTimeMetrics: true
  },
  limits: {
    requestsPerMinute: 60,
    cacheTtl: 300000, // 5 minutes
    maxRetries: 3,
    timeoutMs: 10000
  },
  security: {
    enableAuditLogging: true,
    enableEncryption: true,
    enableRateLimit: true,
    enableCors: true
  }
});
```

This troubleshooting guide provides comprehensive solutions for maintaining optimal TimeVault API performance and resolving common issues efficiently.
