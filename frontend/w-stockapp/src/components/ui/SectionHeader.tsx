import React, { ReactNode } from 'react';

interface SectionHeaderProps {
    /** Título principal de la sección */
    title: string;
    /** Subtítulo o descripción corta opcional */
    subtitle?: string;
    /** Elementos de acción a la derecha (botones, filtros, etc.) */
    actions?: ReactNode;
    /** Clase CSS adicional para el contenedor */
    className?: string;
}

/**
 * Encabezado de sección estandarizado para tablas y formularios.
 * Incluye título, subtítulo opcional y área de acciones a la derecha.
 *
 * @example
 * <SectionHeader
 *   title="Productos"
 *   subtitle="Gestiona el catálogo de productos de tu empresa."
 *   actions={<SharedButton icon={<IoMdAddCircle />}>Nuevo</SharedButton>}
 * />
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    actions,
    className = '',
}) => {
    return (
        <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-empresa pb-5 mb-6 ${className}`}>
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-3 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
};
