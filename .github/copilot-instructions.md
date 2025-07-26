# TimeVault - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TimeVault is a React-based web application that converts digital assets (BTC, ETH, NFTs, XRPL tokens) into precious metals and personal time equivalents. The app focuses on user engagement, retention, and monetization through educational content, gamification, and premium features.

## Key Features & Architecture

### Core Components
- **Calculator**: Digital asset to precious metals/time converter with high-contrast UI
- **Dashboard**: Educational content with tabs (quizzes, tips, tutorials, instructions)
- **Premium Section**: Wallet-gated upsell features for AI insights and charts

### Technology Stack
- **Frontend**: React 19 with TypeScript and Vite
- **Styling**: CSS with gold/blue theme, dark mode support, WCAG accessibility
- **APIs**: Axios for CoinGecko (crypto prices) and Metals.live (precious metals)
- **Blockchain**: Thirdweb SDK for XRPL integration, wallet connect, NFT/token minting
- **Charts**: Recharts for price trends and conversion visualizations
- **Routing**: React Router for navigation

### Design System
- **Colors**: 
  - Primary Navy: #001F3F (trust, backgrounds)
  - Accent Gold: #D4AF37 (luxury, CTAs, highlights)
  - Neutral White: #FFFFFF
  - Neutral Silver: #C0C0C0
- **Accessibility**: 4.5:1 contrast ratios minimum
- **Dark Mode**: Blue-dominant with adjusted gold accents

### Business Logic
- **Engagement**: High-contrast elements, streak incentives, quiz rewards
- **Monetization**: Premium gating, NFT sales, subscription upsells
- **Retention**: Educational gamification, token rewards (TVLT), badge system
- **Performance**: Modular code, optimized for extended viewing sessions

## Development Guidelines

### Code Structure
- Use functional components with hooks
- Implement proper TypeScript types
- Create reusable UI components
- Follow React best practices for performance
- Add placeholder comments for future features

### API Integration
- Implement error handling and loading states
- Use environment variables for API keys
- Cache responses appropriately
- Handle rate limiting gracefully

### Accessibility
- Maintain WCAG compliance
- Use semantic HTML
- Implement keyboard navigation
- Provide screen reader support
- Test contrast ratios

### Performance Optimization
- Implement code splitting
- Optimize images and assets
- Use React.memo for expensive components
- Minimize bundle size
- Implement proper loading states

### Future Features (Add Placeholders)
- A/B testing for theme variants
- Advanced quiz mechanics with TVLT rewards
- Edu NFT badge minting system
- Stripe integration for subscriptions
- Enhanced analytics and metrics
