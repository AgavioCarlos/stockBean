import React from 'react';

interface StatusBadgeProps {
    status: boolean | string;
    trueText?: string;
    falseText?: string;
    className?: string;
}

/**
 * A reusable badge component to display status with colors.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    trueText = "Activo",
    falseText = "Inactivo",
    className = ""
}) => {
    // If status is boolean, use trueText/falseText. If string, just use the string.
    const isPositive = typeof status === 'boolean' ? status : (status ? !String(status).toLowerCase().includes('bajo') : false);
    const text = typeof status === 'boolean' ? (status ? trueText : falseText) : String(status || '');

    const baseStyles = "px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 backdrop-blur-sm select-none inline-flex items-center gap-1.5 shadow-sm";
    const colors = isPositive
        ? "bg-emerald-50/80 text-emerald-700 border-emerald-200 shadow-emerald-100/50"
        : "bg-rose-50/80 text-rose-700 border-rose-200 shadow-rose-100/50";

    return (
        <span className={`${baseStyles} ${colors} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}></span>
            {text}
        </span>
    );
};

interface StockBadgeProps {
    current: number;
    min: number;
    showText?: boolean;
}

/**
 * Specifically designed for inventory stock levels.
 */
export const StockBadge: React.FC<StockBadgeProps> = ({ current, min, showText = true }) => {
    const isLow = current <= min;

    return (
        <div className="flex flex-col gap-1 items-start">
            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tabular-nums ${isLow ? 'text-red-600' : 'text-slate-700'}`}>
                    {current}
                </span>
                {isLow && (
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                )}
            </div>
            {showText && (
                <StatusBadge
                    status={!isLow}
                    trueText="Stock Suficiente"
                    falseText="Bajo Stock"
                />
            )}
        </div>
    );
};
