/**
 * TimeVault Routing Configuration
 * Centralized routing setup with lazy loading for performance
 */

import { lazy } from 'react';

// ========================================
// ROUTE CONSTANTS
// ========================================

export const ROUTES = {
  HOME: '/',
  CALCULATOR: '/calculator',
  DASHBOARD: '/dashboard',
  PREMIUM: '/premium',
  MINTING: '/minting',
  PROFILE: '/profile',
  SUPPORT: '/support',
  
  // Dashboard sub-routes
  DASHBOARD_QUIZZES: '/dashboard/quizzes',
  DASHBOARD_TIPS: '/dashboard/tips',
  DASHBOARD_TUTORIALS: '/dashboard/tutorials',
  DASHBOARD_INSTRUCTIONS: '/dashboard/instructions',
  
  // Premium sub-routes
  PREMIUM_CHARTS: '/premium/charts',
  PREMIUM_INSIGHTS: '/premium/insights',
  PREMIUM_PORTFOLIO: '/premium/portfolio',
  PREMIUM_ALERTS: '/premium/alerts',
  
  // Legal routes
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COMPLIANCE: '/compliance',
} as const;

// ========================================
// LAZY LOADED COMPONENTS
// ========================================

// Main pages
export const Calculator = lazy(() => import('../components/Calculator/Calculator-MVP'));
export const Dashboard = lazy(() => import('../components/Dashboard/Dashboard'));
export const Premium = lazy(() => import('../components/Premium/Premium'));
export const Minting = lazy(() => import('../components/Minting/Minting'));
export const Profile = lazy(() => import('../components/Profile/Profile'));
export const Support = lazy(() => import('../components/Support/Support'));

// Dashboard components
export const Quizzes = lazy(() => import('../components/Dashboard/Quizzes/Quizzes'));
export const Tips = lazy(() => import('../components/Dashboard/Tips/Tips'));
export const Tutorials = lazy(() => import('../components/Dashboard/Tutorials/Tutorials'));
export const Instructions = lazy(() => import('../components/Dashboard/Instructions/Instructions'));

// Premium components
export const Charts = lazy(() => import('../components/Premium/Charts/Charts'));
export const Insights = lazy(() => import('../components/Premium/Insights/Insights'));
export const Portfolio = lazy(() => import('../components/Premium/Portfolio/Portfolio'));
export const Alerts = lazy(() => import('../components/Premium/Alerts/Alerts'));

// Legal components
export const Privacy = lazy(() => import('../components/Legal/Privacy'));
export const Terms = lazy(() => import('../components/Legal/Terms'));

// ========================================
// ROUTE CONFIGURATION
// ========================================

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  title: string;
  description: string;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
  showInNav?: boolean;
  icon?: string;
}

export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    component: Calculator,
    title: 'TimeVault Calculator',
    description: 'Convert digital assets to precious metals and time',
    showInNav: true,
    icon: 'Calculator',
  },
  {
    path: ROUTES.CALCULATOR,
    component: Calculator,
    title: 'Calculator',
    description: 'Digital asset conversion calculator',
    showInNav: true,
    icon: 'Calculator',
  },
  {
    path: ROUTES.DASHBOARD,
    component: Dashboard,
    title: 'Dashboard',
    description: 'Educational content and learning center',
    showInNav: true,
    icon: 'BookOpen',
  },
  {
    path: ROUTES.PREMIUM,
    component: Premium,
    title: 'Premium Features',
    description: 'Advanced analytics and insights',
    requiresPremium: true,
    showInNav: true,
    icon: 'Crown',
  },
  {
    path: ROUTES.MINTING,
    component: Minting,
    title: 'NFT Minting',
    description: 'Mint educational NFTs and achievement badges',
    showInNav: true,
    icon: 'Coins',
  },
  {
    path: ROUTES.PROFILE,
    component: Profile,
    title: 'Profile',
    description: 'User profile and achievements',
    requiresAuth: true,
    showInNav: true,
    icon: 'User',
  },
  {
    path: ROUTES.SUPPORT,
    component: Support,
    title: 'Support',
    description: 'Help and customer support',
    showInNav: true,
    icon: 'HelpCircle',
  },
  
  // Dashboard sub-routes
  {
    path: ROUTES.DASHBOARD_QUIZZES,
    component: Quizzes,
    title: 'Educational Quizzes',
    description: 'Test your knowledge and earn rewards',
    showInNav: false,
  },
  {
    path: ROUTES.DASHBOARD_TIPS,
    component: Tips,
    title: 'Investment Tips',
    description: 'Educational tips and insights',
    showInNav: false,
  },
  {
    path: ROUTES.DASHBOARD_TUTORIALS,
    component: Tutorials,
    title: 'Video Tutorials',
    description: 'Learn with step-by-step tutorials',
    showInNav: false,
  },
  {
    path: ROUTES.DASHBOARD_INSTRUCTIONS,
    component: Instructions,
    title: 'Instructions',
    description: 'How to use TimeVault features',
    showInNav: false,
  },
  
  // Premium sub-routes
  {
    path: ROUTES.PREMIUM_CHARTS,
    component: Charts,
    title: 'Historical Charts',
    description: 'Advanced price charts and analysis',
    requiresPremium: true,
    showInNav: false,
  },
  {
    path: ROUTES.PREMIUM_INSIGHTS,
    component: Insights,
    title: 'AI Insights',
    description: 'AI-powered market analysis',
    requiresPremium: true,
    showInNav: false,
  },
  {
    path: ROUTES.PREMIUM_PORTFOLIO,
    component: Portfolio,
    title: 'Portfolio Tracking',
    description: 'Advanced portfolio analytics',
    requiresPremium: true,
    showInNav: false,
  },
  {
    path: ROUTES.PREMIUM_ALERTS,
    component: Alerts,
    title: 'Real-time Alerts',
    description: 'Price alerts and notifications',
    requiresPremium: true,
    showInNav: false,
  },
  
  // Legal routes
  {
    path: ROUTES.PRIVACY,
    component: Privacy,
    title: 'Privacy Policy',
    description: 'Our privacy policy and data practices',
    showInNav: false,
  },
  {
    path: ROUTES.TERMS,
    component: Terms,
    title: 'Terms of Service',
    description: 'Terms and conditions of use',
    showInNav: false,
  },
];

// ========================================
// NAVIGATION HELPERS
// ========================================

export const getNavRoutes = (): RouteConfig[] => {
  return routeConfig.filter(route => route.showInNav);
};

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routeConfig.find(route => route.path === path);
};

export const isPremiumRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresPremium || false;
};

export const isAuthRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAuth || false;
};

// ========================================
// BREADCRUMB HELPERS
// ========================================

export const generateBreadcrumbs = (pathname: string): Array<{ title: string; path: string }> => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ title: string; path: string }> = [];
  
  let currentPath = '';
  
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    const route = getRouteByPath(currentPath);
    
    if (route) {
      breadcrumbs.push({
        title: route.title,
        path: currentPath,
      });
    }
  });
  
  return breadcrumbs;
};

// Type exports
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
