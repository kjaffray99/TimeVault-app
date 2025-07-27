# TimeVault Styling System v2.0

A comprehensive, automated styling system for consistent UI/UX across the TimeVault application.

## 🚀 Quick Start

```tsx
import { setupTimeVault, TimeVaultThemeProvider, useTimeVaultStyles } from './styles';

// Initialize in your App component
function App() {
  useEffect(() => {
    const cleanup = setupTimeVault({
      automation: true,
      observerOptions: {
        autoApply: true,
        selector: '[data-tv-auto], .calculator, .tv-card',
      }
    });
    return cleanup;
  }, []);

  return (
    <TimeVaultThemeProvider>
      {/* Your app content */}
    </TimeVaultThemeProvider>
  );
}
```

## 📁 System Architecture

```
src/styles/
├── design-system.css      # Core CSS variables and base styles
├── components.tsx         # React components and utilities
├── ThemeProvider.tsx      # Theme management system
├── automation.ts          # Automatic styling capabilities
└── index.ts              # Main exports and setup
```

## 🎨 Design System

### CSS Variables

All TimeVault styles use CSS custom properties with the `--tv-` prefix:

```css
:root {
  /* Brand Colors */
  --tv-primary-navy: #001F3F;
  --tv-accent-gold: #D4AF37;
  --tv-white: #FFFFFF;
  --tv-silver: #C0C0C0;
  
  /* Spacing (4px base) */
  --tv-space-1: 0.25rem;    /* 4px */
  --tv-space-4: 1rem;       /* 16px */
  --tv-space-6: 1.5rem;     /* 24px */
  
  /* Typography */
  --tv-font-size-base: 1rem;
  --tv-font-size-lg: 1.125rem;
  --tv-font-weight-medium: 500;
  
  /* Radius & Shadows */
  --tv-radius-md: 0.5rem;
  --tv-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Component Classes

Pre-built classes for consistent styling:

```css
.tv-card           /* Standard card styling */
.tv-card--premium  /* Premium variant with gold accent */
.tv-button         /* Base button styling */
.tv-button--primary    /* Gold background button */
.tv-button--secondary  /* Transparent with border */
.tv-input          /* Form input styling */
.tv-container      /* Max-width content container */
```

## 🧩 React Components

### Basic Components

```tsx
import { TimeVaultCard, TimeVaultButton, TimeVaultInput } from './styles';

function MyComponent() {
  return (
    <TimeVaultCard variant="premium">
      <TimeVaultInput 
        label="Amount" 
        placeholder="Enter amount" 
        onChange={(value) => console.log(value)} 
      />
      <TimeVaultButton variant="primary" onClick={handleClick}>
        Calculate
      </TimeVaultButton>
    </TimeVaultCard>
  );
}
```

### Layout Components

```tsx
import { TimeVaultContainer, TimeVaultStack, TimeVaultGrid } from './styles';

function Layout() {
  return (
    <TimeVaultContainer>
      <TimeVaultStack size="lg">
        <h1>Title</h1>
        <TimeVaultGrid cols={3}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </TimeVaultGrid>
      </TimeVaultStack>
    </TimeVaultContainer>
  );
}
```

## 🎯 Styling Hooks

### useTimeVaultStyles

Get access to all styling utilities:

```tsx
import { useTimeVaultStyles } from './styles';

function Component() {
  const { tv } = useTimeVaultStyles();
  
  return (
    <div className={tv.card}>
      <h2 className={tv.h2}>Title</h2>
      <button className={tv.button('premium')}>
        Action
      </button>
    </div>
  );
}
```

### useAutoStyles

Automatically apply styles based on component type:

```tsx
import { useAutoStyles } from './styles';

function AutoCard({ variant, children }) {
  const className = useAutoStyles('card', variant, 'custom-class');
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}
```

## 🤖 Automatic Styling

### Data Attributes

Use data attributes for automatic styling:

```tsx
// These will automatically get TimeVault styling
<div data-tv-auto="card" data-tv-variant="premium">
  Content
</div>

<button data-tv-auto="button" data-tv-variant="primary">
  Click me
</button>

<input data-tv-auto="input" placeholder="Auto-styled input" />
```

### Observer System

The system can automatically detect and style elements:

```tsx
// This will be automatically styled as a button
<button className="calculator-submit">Submit</button>

// This will be automatically styled as a card
<div className="result-card">Results</div>
```

## 🎨 Theme System

### Theme Provider

Wrap your app with the theme provider:

```tsx
import { TimeVaultThemeProvider } from './styles';

function App() {
  return (
    <TimeVaultThemeProvider
      config={{
        autoDetectMode: true,
        persistMode: true,
        customColors: {
          accentColor: '#FFD700' // Custom gold
        }
      }}
    >
      <YourApp />
    </TimeVaultThemeProvider>
  );
}
```

### Using Themes

```tsx
import { useTimeVaultTheme } from './styles';

function ThemeToggle() {
  const { theme, toggleMode } = useTimeVaultTheme();
  
  return (
    <button onClick={toggleMode}>
      Switch to {theme.mode === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
}
```

## 🔧 Customization

### Extending Components

```tsx
import { withTimeVaultStyles } from './styles';

const CustomCard = withTimeVaultStyles(
  ({ children, className }) => (
    <div className={className}>
      {children}
    </div>
  ),
  'tv-card custom-card'
);
```

### CSS Mixins

Use mixins for custom styled components:

```tsx
import { timeVaultMixins } from './styles';

const StyledDiv = styled.div`
  ${timeVaultMixins.card(true)} /* Premium card */
  ${timeVaultMixins.button('secondary')}
`;
```

## 📱 Responsive Design

All components are responsive by default:

```css
/* Automatic responsive behavior */
.tv-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .tv-grid--3 {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
}
```

## ♿ Accessibility

Built-in accessibility features:

- High contrast mode support
- Reduced motion preferences
- Proper focus states
- ARIA-friendly markup

```css
@media (prefers-contrast: high) {
  :root {
    --tv-surface-primary: rgba(255, 255, 255, 0.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🔄 Migration Guide

### From Old System

1. **Replace manual CSS classes:**
```tsx
// Old
<div className="calculator-card premium-variant">

// New
<TimeVaultCard variant="premium">
```

2. **Update imports:**
```tsx
// Old
import './Calculator.css';

// New
import { useTimeVaultStyles } from '../styles';
```

3. **Use design tokens:**
```tsx
// Old
<div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)' }}>

// New
<div className={tv.card}>
```

## 🚀 Performance

- **Tree-shakeable:** Only import what you use
- **CSS Variables:** Dynamic theming without JS
- **Minimal Runtime:** Most styling is pure CSS
- **Automatic Optimization:** Unused styles are detected and removed

## 🔍 Debugging

Enable debug mode:

```tsx
setupTimeVault({
  automation: true,
  observerOptions: {
    debug: true, // Logs styling operations
  }
});
```

Use browser dev tools to inspect CSS variables:

```css
/* In browser console */
getComputedStyle(document.documentElement).getPropertyValue('--tv-accent-gold')
```

## 📋 Best Practices

1. **Use semantic class names:**
```tsx
// Good
<TimeVaultCard variant="premium">

// Avoid
<div className="gold-border-card">
```

2. **Leverage the design system:**
```tsx
// Good
const { tv } = useTimeVaultStyles();
<div className={tv.stack('lg')}>

// Avoid
<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
```

3. **Prefer components over classes:**
```tsx
// Good
<TimeVaultButton variant="primary">Submit</TimeVaultButton>

// Less ideal
<button className="tv-button tv-button--primary">Submit</button>
```

4. **Use automatic styling for consistency:**
```tsx
// Let the system handle styling
<div data-tv-auto="card" data-tv-variant="premium">
```

---

This styling system ensures consistent, maintainable, and accessible design across TimeVault while making it easy to implement new features and handle future upgrades.
