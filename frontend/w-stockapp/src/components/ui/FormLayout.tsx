import React, { ReactNode } from 'react';

interface FormGridProps {
    /** Número de columnas en desktop (1 a 12). Default: 1 */
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
    /** Espaciado entre elementos. Default: 4 (1rem) */
    gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
    /** Clase CSS adicional para el grid */
    className?: string;
    children: ReactNode;
}

interface FormColProps {
    /** Cuántas columnas ocupa el elemento. Default: 1 */
    span?: number;
    /** Clase CSS adicional para la columna */
    className?: string;
    children: ReactNode;
}

/**
 * Grid layout para formularios. Por defecto es 1 columna en móvil
 * y el número de columnas especificado en desktop.
 */
export const FormGrid: React.FC<FormGridProps> = ({
    cols = 1,
    gap = 4,
    className = '',
    children,
}) => {
    const gridCols: Record<number, string> = {
        1: 'lg:grid-cols-1',
        2: 'lg:grid-cols-2',
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4',
        5: 'lg:grid-cols-5',
        6: 'lg:grid-cols-6',
        8: 'lg:grid-cols-8',
        10: 'lg:grid-cols-10',
        12: 'lg:grid-cols-12',
    };

    const gaps: Record<number, string> = {
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
    };

    return (
        <div className={`grid grid-cols-1 ${gridCols[cols]} ${gaps[gap]} ${className}`}>
            {children}
        </div>
    );
};

/**
 * Columna dentro de un FormGrid. Permite especificar cuántas columnas ocupa.
 */
export const FormCol: React.FC<FormColProps> = ({
    span = 1,
    className = '',
    children,
}) => {
    const colSpans: Record<number, string> = {
        1: 'lg:col-span-1',
        2: 'lg:col-span-2',
        3: 'lg:col-span-3',
        4: 'lg:col-span-4',
        5: 'lg:col-span-5',
        6: 'lg:col-span-6',
        7: 'lg:col-span-7',
        8: 'lg:col-span-8',
        9: 'lg:col-span-9',
        10: 'lg:col-span-10',
        11: 'lg:col-span-11',
        12: 'lg:col-span-12',
    };

    return (
        <div className={`${colSpans[span] || 'lg:col-span-1'} ${className}`}>
            {children}
        </div>
    );
};
