# TimeVault - Development & Troubleshooting Guide

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production  
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # TypeScript checking

# Troubleshooting
npm run clean           # Clean node_modules and reinstall
npm run reset           # Reset git and clean everything
```

## 🔧 Project Structure & Organization

### Core Architecture
```
src/
├── components/          # React components
│   ├── Calculator/      # Main conversion tool
│   ├── Dashboard/       # Educational content
│   ├── Premium/         # Wallet-gated features
│   └── UI/             # Shared components
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── services/          # API and business logic
│   ├── api.ts         # External API calls
│   └── education.ts   # Educational content
├── types/             # TypeScript definitions
├── hooks/             # Custom React hooks
└── utils/             # Utility functions
```

### File Naming Conventions
- Components: `PascalCase.tsx` + `PascalCase.css`
- Services: `camelCase.ts`
- Types: `index.ts` (barrel exports)
- Hooks: `useCamelCase.ts`

## 🐛 Common Issues & Solutions

### 1. TypeScript Compilation Errors

**Issue**: `Cannot find module` or type errors
```bash
# Solution: Check import paths and run type checking
npx tsc --noEmit
npm run type-check
```

**Issue**: `'X' is declared but its value is never read`
```typescript
// Solution: Use underscore prefix for unused parameters
const Component = ({ _unusedProp, usedProp }: Props) => {
  return <div>{usedProp}</div>;
};
```

### 2. Hot Module Replacement (HMR) Issues

**Issue**: `Could not Fast Refresh` errors
```typescript
// Problem: Non-consistent exports
export const useHook = () => { /* inconsistent return */ };

// Solution: Consistent exports with React.memo/useMemo
export const useHook = () => {
  return React.useMemo(() => ({
    // consistent object shape
  }), [deps]);
};
```

### 3. API Integration Issues

**Issue**: CORS or API connection failures
```typescript
// Check API service configuration
// Verify environment variables in .env
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_METALS_API_URL=https://api.metals.live/v1
```

**Issue**: Mock data not loading
```typescript
// Ensure fallback data is available in services/api.ts
const fallbackData = [/* mock data */];
```

### 4. CSS Styling Issues

**Issue**: Styles not applying
```css
/* Check CSS custom properties are defined in index.css */
:root {
  --primary-blue: #001F3F;
  --accent-gold: #D4AF37;
  /* ... */
}
```

**Issue**: Dark mode not working
```typescript
// Verify ThemeContext is properly wrapped around App
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 5. Build & Deploy Issues

**Issue**: Build failures
```bash
# Clean install and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue**: Vercel deployment problems
```json
// Check vercel.json configuration
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🔍 Debugging Tools & Techniques

### VS Code Configuration
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Browser DevTools
1. **React DevTools**: Install extension for component debugging
2. **Console Errors**: Check for runtime errors
3. **Network Tab**: Monitor API calls and responses
4. **Application Tab**: Check localStorage for theme preferences

### Performance Monitoring
```typescript
// Add performance logging
console.time('Component Render');
// component logic
console.timeEnd('Component Render');

// Monitor bundle size
npm run build -- --analyze
```

## 📊 State Management Debugging

### Theme Context Issues
```typescript
// Debug theme state
const { theme, isDarkMode } = useTheme();
console.log('Current theme:', { theme, isDarkMode });
```

### Component State Issues
```typescript
// Add state logging in useEffect
useEffect(() => {
  console.log('State changed:', { cryptoAssets, selectedAsset });
}, [cryptoAssets, selectedAsset]);
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// Test component rendering
import { render, screen } from '@testing-library/react';
import Calculator from './Calculator';

test('renders calculator component', () => {
  render(<Calculator />);
  expect(screen.getByText('TimeVault Calculator')).toBeInTheDocument();
});
```

### API Testing
```typescript
// Test API services
import { CryptoPriceService } from '../services/api';

test('fetches crypto prices', async () => {
  const prices = await CryptoPriceService.getCryptoPrices();
  expect(prices).toHaveLength(3);
});
```

## 🚀 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Code Splitting
```typescript
// Lazy load components
const Premium = React.lazy(() => import('./components/Premium/Premium'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Premium />
</Suspense>
```

### Memory Leaks Prevention
```typescript
// Clean up effects
useEffect(() => {
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, []);

// Abort fetch requests
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, []);
```

## 🔐 Security Best Practices

### Environment Variables
```bash
# Never commit .env files
# Use .env.example for templates
# Prefix with VITE_ for client-side access
VITE_API_KEY=your_key_here
```

### API Security
```typescript
// Validate API responses
const validateResponse = (data: unknown): CryptoAsset[] => {
  if (!Array.isArray(data)) throw new Error('Invalid response');
  return data.filter(item => isValidCryptoAsset(item));
};
```

## 📱 Mobile Debugging

### Responsive Design Issues
```css
/* Use consistent breakpoints */
@media (max-width: 768px) { /* mobile */ }
@media (min-width: 769px) and (max-width: 1024px) { /* tablet */ }
@media (min-width: 1025px) { /* desktop */ }
```

### Touch Events
```typescript
// Handle touch events properly
const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault(); // Prevent scroll
};
```

## 🔄 Git Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Hotfixes
git checkout -b hotfix/urgent-fix
git commit -m "fix: resolve critical issue"
```

### Commit Messages
```
feat: add new calculator feature
fix: resolve API connection issue
style: update button styling
refactor: optimize component structure
test: add calculator component tests
docs: update troubleshooting guide
```

## 📞 Support & Resources

### Documentation
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

### Community
- [Discord Community](https://discord.gg/timevault)
- [GitHub Issues](https://github.com/timevault/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/timevault)

### Error Reporting
When reporting bugs, include:
1. Error message and stack trace
2. Browser and OS version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console logs and network requests

---

*Last updated: July 26, 2025*
