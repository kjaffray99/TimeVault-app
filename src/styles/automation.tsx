/**
 * TimeVault Automatic Styling System
 * 
 * Automatically applies TimeVault styling to components based on conventions
 */

import React, { useEffect } from 'react';
import { useTimeVaultStyles } from './components';

// ========================================
// STYLING AUTOMATION HOOKS
// ========================================

/**
 * Automatically applies TimeVault styling based on component type and props
 */
export const useAutoStyles = (
    componentType: 'card' | 'button' | 'input' | 'container' | 'stack' | 'grid',
    variant?: string,
    additionalClasses?: string
) => {
    const { tv } = useTimeVaultStyles();

    const getAutoClass = () => {
        switch (componentType) {
            case 'card':
                return variant === 'premium' ? tv.cardPremium : tv.card;
            case 'button':
                return tv.button(variant as any || 'primary');
            case 'input':
                return variant === 'select' ? tv.select : tv.input;
            case 'container':
                return tv.container;
            case 'stack':
                return tv.stack(variant as any || 'md');
            case 'grid':
                const cols = parseInt(variant || '2') as 2 | 3 | 4;
                return tv.grid(cols);
            default:
                return '';
        }
    };

    const autoClass = getAutoClass();
    return `${autoClass} ${additionalClasses || ''}`.trim();
};

/**
 * Automatically detects component type and applies styling
 */
export const useSmartStyles = (
    element: React.RefObject<HTMLElement>,
    overrides?: Record<string, string>
) => {
    const { tv } = useTimeVaultStyles();

    useEffect(() => {
        if (!element.current) return;

        const el = element.current;
        const tagName = el.tagName.toLowerCase();
        const role = el.getAttribute('role');
        const type = el.getAttribute('type');

        // Auto-detect and apply styles
        let autoClass = '';

        if (tagName === 'button' || role === 'button') {
            autoClass = tv.button();
        } else if (tagName === 'input') {
            autoClass = type === 'select' ? tv.select : tv.input;
        } else if (tagName === 'select') {
            autoClass = tv.select;
        } else if (el.classList.contains('card') || el.dataset.component === 'card') {
            autoClass = tv.card;
        }

        // Apply overrides
        if (overrides) {
            Object.entries(overrides).forEach(([condition, className]) => {
                if (el.matches(condition) || el.classList.contains(condition)) {
                    autoClass += ` ${className}`;
                }
            });
        }

        if (autoClass) {
            el.className = `${el.className} ${autoClass}`.trim();
        }
    }, [element, overrides, tv]);
};

// ========================================
// COMPONENT AUTO-STYLING
// ========================================

/**
 * Automatically styled wrapper component
 */
interface AutoStyledProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
    variant?: string;
    className?: string;
    autoDetect?: boolean;
    [key: string]: any;
}

export const AutoStyled: React.FC<AutoStyledProps> = ({
    children,
    as: Component = 'div',
    variant,
    className = '',
    autoDetect = true,
    ...props
}) => {
    const elementRef = React.useRef<HTMLElement>(null);

    // Auto-detect component type from props or children
    const getComponentType = (): string => {
        if (props.role === 'button' || Component === 'button') return 'button';
        if (Component === 'input' || Component === 'select') return 'input';
        if (props['data-component']) return props['data-component'];
        if (className.includes('card')) return 'card';
        if (className.includes('container')) return 'container';
        return 'div';
    };

    const componentType = getComponentType();
    const autoClass = useAutoStyles(componentType as any, variant, className);

    // Apply smart styling if auto-detect is enabled
    useSmartStyles(elementRef, autoDetect ? {
        '[data-premium]': 'tv-card--premium',
        '.loading': 'tv-loading',
        '.error': 'tv-status--error',
        '.success': 'tv-status--success',
    } : undefined);

    return (
        <Component
            ref={elementRef}
            className={autoClass}
            {...props}
        >
            {children}
        </Component>
    );
};

// ========================================
// STYLE INJECTION SYSTEM
// ========================================

/**
 * Injects TimeVault styles into the document
 */
export const injectTimeVaultStyles = () => {
    const styleId = 'timevault-auto-styles';

    // Check if styles are already injected
    if (document.getElementById(styleId)) {
        return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
    /* TimeVault Auto-Applied Styles */
    .tv-auto-card {
      background: var(--tv-surface-primary);
      border: 1px solid var(--tv-border-primary);
      border-radius: var(--tv-radius-lg);
      padding: var(--tv-space-6);
      backdrop-filter: blur(10px);
      transition: all var(--tv-transition-normal);
    }
    
    .tv-auto-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--tv-space-2);
      padding: var(--tv-space-3) var(--tv-space-6);
      border-radius: var(--tv-radius-md);
      font-size: var(--tv-font-size-base);
      font-weight: var(--tv-font-weight-medium);
      border: none;
      cursor: pointer;
      transition: all var(--tv-transition-fast);
      background: var(--tv-accent-gold);
      color: var(--tv-primary-navy);
    }
    
    .tv-auto-input {
      width: 100%;
      padding: var(--tv-space-3) var(--tv-space-4);
      background: var(--tv-surface-primary);
      border: 1px solid var(--tv-border-primary);
      border-radius: var(--tv-radius-md);
      color: var(--tv-white);
      font-size: var(--tv-font-size-base);
      transition: all var(--tv-transition-fast);
    }
    
    /* Hover states */
    .tv-auto-card:hover {
      background: var(--tv-surface-hover);
      border-color: var(--tv-border-gold);
      transform: translateY(-2px);
    }
    
    .tv-auto-button:hover {
      background: var(--tv-accent-gold-light);
      transform: translateY(-1px);
    }
    
    .tv-auto-input:focus {
      outline: none;
      border-color: var(--tv-accent-gold);
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }
  `;

    document.head.appendChild(style);
};

// ========================================
// GLOBAL STYLE OBSERVER
// ========================================

/**
 * Observes DOM changes and automatically applies TimeVault styles
 */
export const createStyleObserver = (options: {
    autoApply?: boolean;
    selector?: string;
    attributeFilter?: string[];
} = {}) => {
    const { autoApply = true, selector = '[data-tv-auto]', attributeFilter = ['class', 'data-tv-auto'] } = options;

    if (!autoApply) return null;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;

                        // Check if element should be auto-styled
                        if (element.matches(selector)) {
                            applyAutoStyles(element);
                        }

                        // Check children
                        element.querySelectorAll(selector).forEach(applyAutoStyles);
                    }
                });
            } else if (mutation.type === 'attributes') {
                const element = mutation.target as Element;
                if (element.matches(selector)) {
                    applyAutoStyles(element);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter,
    });

    return observer;
};

/**
 * Applies automatic styles to an element
 */
const applyAutoStyles = (element: Element) => {
    const autoType = element.getAttribute('data-tv-auto');
    const variant = element.getAttribute('data-tv-variant');

    if (!autoType) return;

    const { tv } = useTimeVaultStyles();
    let styleClass = '';

    switch (autoType) {
        case 'card':
            styleClass = variant === 'premium' ? tv.cardPremium : tv.card;
            break;
        case 'button':
            styleClass = tv.button(variant as any || 'primary');
            break;
        case 'input':
            styleClass = variant === 'select' ? tv.select : tv.input;
            break;
        default:
            styleClass = `tv-auto-${autoType}`;
    }

    if (styleClass && !element.classList.contains(styleClass.split(' ')[0])) {
        element.className = `${element.className} ${styleClass}`.trim();
    }
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initializes the TimeVault styling system
 */
export const initializeTimeVaultStyling = (options: {
    injectStyles?: boolean;
    autoObserver?: boolean;
    observerOptions?: Parameters<typeof createStyleObserver>[0];
} = {}) => {
    const {
        injectStyles = true,
        autoObserver = true,
        observerOptions = {}
    } = options;

    // Inject base styles
    if (injectStyles) {
        injectTimeVaultStyles();
    }

    // Start auto-styling observer
    if (autoObserver) {
        const observer = createStyleObserver(observerOptions);

        // Return cleanup function
        return () => {
            observer?.disconnect();
        };
    }

    return () => { };
};

export default {
    useAutoStyles,
    useSmartStyles,
    AutoStyled,
    injectTimeVaultStyles,
    createStyleObserver,
    initializeTimeVaultStyling,
};
