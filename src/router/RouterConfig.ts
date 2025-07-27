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
    DASHBOARD: '/dashboard',
    PREMIUM: '/premium',
    CALCULATOR: '/calculator',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
    SETTINGS: '/settings',
    PROFILE: '/profile',
    NOT_FOUND: '*'
} as const;

// ========================================
// LAZY LOADED COMPONENTS (Working Components Only)
// ========================================

// Core Application Components
export const Calculator = lazy(() => import('../components/Calculator/Calculator-MVP'));
export const Dashboard = lazy(() => import('../components/Dashboard/Dashboard'));
export const Premium = lazy(() => import('../components/Premium/Premium'));

// User Management Components
export const Profile = lazy(() => import('../components/Profile/Profile'));

// ========================================
// ROUTER COMPONENT EXPORT
// ========================================

export { AppRouter } from './AppRouter';

// ========================================
// ROUTE CONFIGURATION TYPE
// ========================================

export interface RouteConfig {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    title: string;
    description?: string;
    requiresAuth?: boolean;
    requiresPremium?: boolean;
    showInNav?: boolean;
    icon?: string;
}

// ========================================
// BASIC ROUTE CONFIGURATION (Working Routes Only)
// ========================================

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
        description: 'Digital asset calculator and converter',
        showInNav: true,
        icon: 'Calculator',
    },
    {
        path: ROUTES.DASHBOARD,
        component: Dashboard,
        title: 'Dashboard',
        description: 'Educational content and insights',
        showInNav: true,
        icon: 'BarChart3',
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
        path: ROUTES.PROFILE,
        component: Profile,
        title: 'Profile',
        description: 'User profile and achievements',
        requiresAuth: true,
        showInNav: true,
        icon: 'User',
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
// ROUTE TYPE HELPERS
// ========================================

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
