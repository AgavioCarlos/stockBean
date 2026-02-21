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
    const isPositive = typeof status === 'boolean' ? status : !status.toLowerCase().includes('bajo');
    const text = typeof status === 'boolean' ? (status ? trueText : falseText) : status;

    const baseStyles = "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300";
    const colors = isPositive
        ? "bg-green-100 text-green-700 border-green-200 shadow-sm shadow-green-100/50"
        : "bg-red-100 text-red-700 border-red-200 shadow-sm shadow-red-100/50";

    return (
        <span className={`${baseStyles} ${colors} ${className}`}>
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
