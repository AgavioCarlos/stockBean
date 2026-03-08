import React, { InputHTMLAttributes } from 'react';

interface SharedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    isEditing: boolean;
    error?: string;
    icon?: React.ReactNode;
}

export const SharedInput: React.FC<SharedInputProps> = ({
    label,
    description,
    isEditing,
    error,
    icon,
    id,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full group">
            <label
                htmlFor={id}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-200 ${isEditing ? 'text-slate-600 group-focus-within:text-blue-600 cursor-pointer' : 'text-slate-400'}`}
            >
                {label}
            </label>

            <div className="relative group/input">
                {icon && (
                    <div className={`
                        absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200
                        ${isEditing ? 'text-slate-400 group-focus-within/input:text-blue-500' : 'text-slate-300'}
                    `}>
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    disabled={!isEditing}
                    {...props}
                    className={`
                        w-full ${icon ? 'pl-11' : 'px-4'} py-3 border-2 rounded-xl transition-all duration-300 font-medium text-slate-800
                        focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
                        ${!isEditing
                            ? 'bg-slate-50/80 border-slate-100 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}
                        ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
                        ${props.className || ''}
                    `}
                />
            </div>

            {(description || error) && (
                <p className={`text-xs ${error ? 'text-red-500 font-bold' : 'text-slate-500 font-medium'}`} aria-live={error ? "polite" : "off"}>
                    {error || description}
                </p>
            )}
        </div>
    );
};
