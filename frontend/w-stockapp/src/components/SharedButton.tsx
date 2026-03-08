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

    // Color/Visual variants with premium aesthetic
    const variantStyles = {
        primary: `
            bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900
            text-white border-0
            shadow-[0_4px_14px_0_rgb(15,23,42,0.39)] 
            hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:from-slate-800 hover:via-slate-700 hover:to-slate-800
            hover:-translate-y-[1px]
            focus-visible:ring-slate-900 focus-visible:ring-offset-2
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-white/10 before:translate-y-[100%] hover:before:translate-y-0 before:transition-transform before:duration-300 before:pointer-events-none before:ease-out
        `,
        secondary: `
            bg-white text-slate-700 border border-slate-200/80 
            shadow-[0_1px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)]
            hover:bg-slate-50 hover:text-slate-900 shadow-sm
            hover:-translate-y-[1px]
            focus-visible:ring-slate-200 focus-visible:ring-offset-2
        `,
        success: `
            bg-gradient-to-tr from-emerald-600 to-emerald-500
            text-white border-0
            shadow-[0_4px_14px_0_rgb(5,150,105,0.39)] 
            hover:shadow-[0_6px_20px_rgba(5,150,105,0.23)] hover:from-emerald-500 hover:to-emerald-400
            hover:-translate-y-[1px]
            focus-visible:ring-emerald-600 focus-visible:ring-offset-2
            relative overflow-hidden
            before:absolute before:inset-0 before:bg-white/10 before:translate-y-[100%] hover:before:translate-y-0 before:transition-transform before:duration-300 before:pointer-events-none before:ease-out
        `,
        danger: `
            bg-rose-50/80 text-rose-600 border border-rose-200/50
            hover:bg-rose-100/80 hover:border-rose-300/50 hover:text-rose-700
            focus-visible:ring-rose-500 focus-visible:ring-offset-2
            hover:-translate-y-[1px] transition-transform
        `,
        outline: `
            bg-transparent border-2 border-slate-200 text-slate-600
            hover:border-slate-800 hover:bg-slate-50 hover:text-slate-900
            focus-visible:ring-slate-300 focus-visible:ring-offset-2
            hover:-translate-y-[1px] transition-all
        `,
        ghost: `
            bg-transparent text-slate-500 border border-transparent
            hover:bg-slate-100 hover:text-slate-900
            focus-visible:ring-slate-200 focus-visible:ring-offset-2
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
