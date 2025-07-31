import React from 'react';

interface StaticFallbackProps {
    children: React.ReactNode;
    staticContent?: any;
}

export const StaticFallback: React.FC<StaticFallbackProps> = ({
    children,
    staticContent
}) => {
    // For production builds, use static content if available
    if (typeof window === 'undefined' && staticContent) {
        return (
            <div className="static-fallback">
                {staticContent}
            </div>
        );
    }

    // For client-side, render children normally
    return <>{children}</>;
};
