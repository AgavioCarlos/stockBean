import React, { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface SharedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const SharedButton: React.FC<SharedButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    // Base styles
    const baseStyles = `
        inline-flex items-center justify-center font-medium tracking-tight 
        transition-all duration-200 ease-out outline-none whitespace-nowrap
        focus-visible:ring-2 focus-visible:ring-offset-1
        active:scale-[0.98] disabled:active:scale-100
        disabled:opacity-50 disabled:cursor-not-allowed
    `.replace(/\s+/g, ' ').trim();

    // Sizing variants - explicit heights help consistency (Touch-target minimums applied)
    const sizeStyles = {
        sm: 'h-9 px-4 text-xs rounded-lg gap-1.5',
        md: 'h-11 px-6 text-sm rounded-xl gap-2',
        lg: 'h-14 px-8 text-base rounded-2xl gap-3',
        icon: 'h-11 w-11 !p-0 rounded-xl shrink-0 flex items-center justify-center'
    };

    // Color/Visual variants
    const variantStyles = {
        primary: `
            bg-slate-900 text-white shadow-sm border border-transparent
            hover:bg-slate-800 hover:shadow-md
            focus-visible:ring-slate-900
        `,
        secondary: `
            bg-white text-slate-700 border border-slate-200 shadow-sm
            hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300
            focus-visible:ring-slate-200
        `,
        success: `
            bg-emerald-600 text-white shadow-sm border border-transparent
            hover:bg-emerald-700 hover:shadow-md
            focus-visible:ring-emerald-600
        `,
        danger: `
            bg-red-50 text-red-600 border border-red-100
            hover:bg-red-100 hover:border-red-200
            focus-visible:ring-red-500
        `,
        outline: `
            bg-transparent border border-slate-200 text-slate-600
            hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900
            focus-visible:ring-slate-300
        `,
        ghost: `
            bg-transparent text-slate-500 border border-transparent
            hover:bg-slate-100 hover:text-slate-900
            focus-visible:ring-slate-200
        `
    };

    const combinedStyles = `
        ${baseStyles} 
        ${sizeStyles[size]} 
        ${variantStyles[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
        <button
            className={combinedStyles}
            disabled={disabled}
            {...props}
        >
            {icon && (
                <span className={`flex-shrink-0 flex items-center justify-center ${size === 'icon' ? '' : '-ml-0.5'}`}>
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
};
