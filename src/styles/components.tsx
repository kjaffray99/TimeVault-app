/**
 * TimeVault Component Style Utilities
 * 
 * Higher-order component and hooks for automatic styling application
 */

import React from 'react';
import './design-system.css';

// ========================================
// STYLING UTILITIES
// ========================================

/**
 * Applies TimeVault design system classes automatically
 */
export const withTimeVaultStyles = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    defaultClassName?: string
) => {
    const StyledComponent = React.forwardRef<any, P & { className?: string }>((props, ref) => {
        const { className = '', ...rest } = props;
        const combinedClassName = `${defaultClassName || ''} ${className}`.trim();

        return <WrappedComponent ref={ref} {...rest as P} className={combinedClassName} />;
    });

    StyledComponent.displayName = `withTimeVaultStyles(${WrappedComponent.displayName || WrappedComponent.name})`;
    return StyledComponent;
};

/**
 * Hook to generate consistent TimeVault classes
 */
export const useTimeVaultStyles = () => {
    const tv = {
        // Layout
        container: 'tv-container',
        card: 'tv-card',
        cardPremium: 'tv-card tv-card--premium',
        stack: (size: 'sm' | 'md' | 'lg' | 'xl' = 'md') => `tv-stack tv-stack--${size}`,
        grid: (cols: 2 | 3 | 4) => `tv-grid tv-grid--${cols}`,
        flex: (variant?: 'between' | 'center' | 'end' | 'wrap') =>
            `tv-flex${variant ? ` tv-flex--${variant}` : ''}`,

        // Typography
        h1: 'tv-heading-1',
        h2: 'tv-heading-2',
        h3: 'tv-heading-3',
        body: 'tv-text-body',
        small: 'tv-text-small',
        accent: 'tv-text-accent',

        // Buttons
        button: (variant: 'primary' | 'secondary' | 'ghost' | 'premium' = 'primary') =>
            `tv-button tv-button--${variant}`,

        // Inputs
        input: 'tv-input',
        select: 'tv-input tv-select',

        // Status
        status: (type: 'success' | 'warning' | 'error' | 'premium') =>
            `tv-status tv-status--${type}`,

        // Utilities
        loading: 'tv-loading',
        hidden: 'tv-hidden',
        textCenter: 'tv-text-center',
        p: (size: 0 | 1 | 2 | 3 | 4 | 6 | 8) => `tv-p-${size}`,
        m: (size: 0 | 1 | 2 | 3 | 4 | 6 | 8) => `tv-m-${size}`,
    };

    return { tv };
};

// ========================================
// STYLED COMPONENTS
// ========================================

interface TimeVaultCardProps {
    children: React.ReactNode;
    variant?: 'default' | 'premium';
    className?: string;
    onClick?: () => void;
}

export const TimeVaultCard: React.FC<TimeVaultCardProps> = ({
    children,
    variant = 'default',
    className = '',
    onClick
}) => {
    const baseClass = variant === 'premium' ? 'tv-card tv-card--premium' : 'tv-card';
    const combinedClass = `${baseClass} ${className}`.trim();

    return (
        <div className={combinedClass} onClick={onClick}>
            {children}
        </div>
    );
};

interface TimeVaultButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'premium';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const TimeVaultButton: React.FC<TimeVaultButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button'
}) => {
    const baseClass = `tv-button tv-button--${variant}`;
    const sizeClass = size !== 'md' ? `tv-button--${size}` : '';
    const combinedClass = `${baseClass} ${sizeClass} ${className}`.trim();

    return (
        <button
            type={type}
            className={combinedClass}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading && <span className="tv-loading" />}
            {children}
        </button>
    );
};

interface TimeVaultInputProps {
    label?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    type?: 'text' | 'number' | 'email' | 'password';
    className?: string;
    error?: string;
    required?: boolean;
}

export const TimeVaultInput: React.FC<TimeVaultInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    className = '',
    error,
    required = false
}) => {
    const { tv } = useTimeVaultStyles();

    return (
        <div className={tv.stack('sm')}>
            {label && (
                <label className={tv.small}>
                    {label}
                    {required && <span className={tv.accent}> *</span>}
                </label>
            )}
            <input
                type={type}
                className={`${tv.input} ${className}`.trim()}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
            />
            {error && (
                <span className={`${tv.small} ${tv.status('error')}`}>
                    {error}
                </span>
            )}
        </div>
    );
};

interface TimeVaultSelectProps {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

export const TimeVaultSelect: React.FC<TimeVaultSelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    className = '',
    error,
    required = false
}) => {
    const { tv } = useTimeVaultStyles();

    return (
        <div className={tv.stack('sm')}>
            {label && (
                <label className={tv.small}>
                    {label}
                    {required && <span className={tv.accent}> *</span>}
                </label>
            )}
            <select
                className={`${tv.select} ${className}`.trim()}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className={`${tv.small} ${tv.status('error')}`}>
                    {error}
                </span>
            )}
        </div>
    );
};

// ========================================
// LAYOUT COMPONENTS
// ========================================

interface TimeVaultContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const TimeVaultContainer: React.FC<TimeVaultContainerProps> = ({
    children,
    className = ''
}) => {
    const { tv } = useTimeVaultStyles();
    return (
        <div className={`${tv.container} ${className}`.trim()}>
            {children}
        </div>
    );
};

interface TimeVaultStackProps {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const TimeVaultStack: React.FC<TimeVaultStackProps> = ({
    children,
    size = 'md',
    className = ''
}) => {
    const { tv } = useTimeVaultStyles();
    return (
        <div className={`${tv.stack(size)} ${className}`.trim()}>
            {children}
        </div>
    );
};

interface TimeVaultGridProps {
    children: React.ReactNode;
    cols: 2 | 3 | 4;
    className?: string;
}

export const TimeVaultGrid: React.FC<TimeVaultGridProps> = ({
    children,
    cols,
    className = ''
}) => {
    const { tv } = useTimeVaultStyles();
    return (
        <div className={`${tv.grid(cols)} ${className}`.trim()}>
            {children}
        </div>
    );
};

// ========================================
// TYPOGRAPHY COMPONENTS
// ========================================

interface TimeVaultHeadingProps {
    children: React.ReactNode;
    level: 1 | 2 | 3;
    className?: string;
}

export const TimeVaultHeading: React.FC<TimeVaultHeadingProps> = ({
    children,
    level,
    className = ''
}) => {
    const { tv } = useTimeVaultStyles();
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const headingClass = level === 1 ? tv.h1 : level === 2 ? tv.h2 : tv.h3;

    return (
        <Tag className={`${headingClass} ${className}`.trim()}>
            {children}
        </Tag>
    );
};

// ========================================
// COMPONENT STYLING MIXINS
// ========================================

export const timeVaultMixins = {
    /**
     * Applies standard card styling
     */
    card: (isPremium = false) => ({
        background: 'var(--tv-surface-primary)',
        border: '1px solid var(--tv-border-primary)',
        borderRadius: 'var(--tv-radius-lg)',
        padding: 'var(--tv-space-6)',
        backdropFilter: 'blur(10px)',
        transition: 'all var(--tv-transition-normal)',
        ...(isPremium && {
            borderColor: 'var(--tv-accent-gold)',
            background: 'linear-gradient(135deg, var(--tv-surface-primary), rgba(212, 175, 55, 0.1))'
        })
    }),

    /**
     * Applies button styling
     */
    button: (variant: 'primary' | 'secondary' | 'ghost' | 'premium' = 'primary') => {
        const base = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--tv-space-2)',
            padding: 'var(--tv-space-3) var(--tv-space-6)',
            borderRadius: 'var(--tv-radius-md)',
            fontSize: 'var(--tv-font-size-base)',
            fontWeight: 'var(--tv-font-weight-medium)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all var(--tv-transition-fast)',
            textDecoration: 'none',
        };

        const variants = {
            primary: {
                background: 'var(--tv-accent-gold)',
                color: 'var(--tv-primary-navy)',
            },
            secondary: {
                background: 'var(--tv-surface-primary)',
                color: 'var(--tv-white)',
                border: '1px solid var(--tv-border-primary)',
            },
            ghost: {
                background: 'transparent',
                color: 'var(--tv-white)',
                border: '1px solid transparent',
            },
            premium: {
                background: 'linear-gradient(135deg, var(--tv-accent-gold), var(--tv-accent-gold-light))',
                color: 'var(--tv-primary-navy)',
                fontWeight: 'var(--tv-font-weight-semibold)',
            }
        };

        return { ...base, ...variants[variant] };
    },

    /**
     * Applies input styling
     */
    input: () => ({
        width: '100%',
        padding: 'var(--tv-space-3) var(--tv-space-4)',
        background: 'var(--tv-surface-primary)',
        border: '1px solid var(--tv-border-primary)',
        borderRadius: 'var(--tv-radius-md)',
        color: 'var(--tv-white)',
        fontSize: 'var(--tv-font-size-base)',
        transition: 'all var(--tv-transition-fast)',
    })
};

export default useTimeVaultStyles;
