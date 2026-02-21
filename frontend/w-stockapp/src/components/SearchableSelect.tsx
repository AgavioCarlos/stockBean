import React, { useState, useRef, useEffect, useMemo } from 'react';
import { IoIosSearch, IoIosArrowDown, IoIosCloseCircle } from 'react-icons/io';

interface Option {
    value: string | number;
    label: string;
    description?: string;
    [key: string]: any;
}

interface SearchableSelectProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    id?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    error?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Seleccionar…",
    label,
    id,
    disabled = false,
    loading = false,
    className = "",
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync search term with current selection label initially or when value changes
    const selectedOption = useMemo(() =>
        options.find(opt => opt.value === value),
        [options, value]);

    // Filtered options based on search
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const lowerSearch = searchTerm.toLowerCase();
        return options.filter(opt =>
            opt.label.toLowerCase().includes(lowerSearch) ||
            (opt.description && opt.description.toLowerCase().includes(lowerSearch))
        );
    }, [options, searchTerm]);

    // Handle clicks outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    };

    return (
        <div className={`relative flex flex-col gap-1 ${className}`} ref={containerRef}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
                >
                    {label}
                </label>
            )}

            <div
                className={`
                    group relative flex items-center justify-between w-full border rounded-lg px-3 py-2.5 transition-all duration-300 cursor-pointer
                    ${disabled ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-400' : 'bg-white border-gray-300 hover:border-blue-400 shadow-sm'}
                    ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-md' : ''}
                    ${error ? 'border-red-500 ring-red-500/10' : ''}
                `}
                onClick={handleToggle}
            >
                <span className={`text-sm truncate ${!selectedOption ? 'text-gray-400 font-normal' : 'text-gray-900 font-medium'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className="flex items-center gap-2">
                    {loading && (
                        <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    )}
                    <IoIosArrowDown
                        className={`transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div
                    className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200 origin-top overflow-hidden backdrop-blur-sm bg-white/95"
                    style={{ minWidth: '100%' }}
                >
                    {/* Search Input */}
                    <div className="relative mb-2">
                        <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full pl-9 pr-8 py-2 text-sm border-0 border-b border-gray-100 focus:ring-0 focus:border-blue-500 placeholder-gray-400 transition-all font-medium"
                            placeholder="Buscar…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsOpen(false);
                                if (e.key === 'Enter' && filteredOptions.length > 0) {
                                    handleSelect(filteredOptions[0].value);
                                }
                            }}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                                onClick={() => setSearchTerm("")}
                            >
                                <IoIosCloseCircle />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`
                                        flex flex-col px-4 py-2.5 rounded-lg cursor-pointer transition-colors group/opt mb-1 last:mb-0
                                        ${value === option.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'}
                                    `}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className="text-sm">{option.label}</span>
                                    {option.description && (
                                        <span className={`text-[11px] mt-0.5 ${value === option.value ? 'text-blue-400' : 'text-gray-400 group-hover/opt:text-gray-500'}`}>
                                            {option.description}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <span className="text-sm text-gray-400 italic">No se encontraron resultados</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <span className="text-[10px] text-red-500 font-medium px-1 mt-0.5">{error}</span>}
        </div>
    );
};
