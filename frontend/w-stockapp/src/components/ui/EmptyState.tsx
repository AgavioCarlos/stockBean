import React, { ReactNode } from 'react';

interface EmptyStateProps {
    /** Ícono o ilustración a mostrar (ej. <FaBox />) */
    icon: ReactNode;
    /** Título principal del estado vacío */
    title: string;
    /** Descripción opcional con más contexto */
    description?: string;
    /** Botón de acción opcional (ej. "Crear primer registro") */
    action?: ReactNode;
}

/**
 * Componente de estado vacío reutilizable para tablas, listas y contenedores.
 *
 * @example
 * <EmptyState
 *   icon={<FaBox size={28} />}
 *   title="Sin productos"
 *   description="Aún no has registrado ningún producto en el catálogo."
 *   action={<SharedButton variant="primary" onClick={handleNew}>Crear producto</SharedButton>}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
            {/* Ícono en círculo */}
            <div className="w-18 h-18 rounded-full bg-empresa-primario/8 text-empresa-primario flex items-center justify-center p-5 mb-1">
                {icon}
            </div>

            {/* Texto */}
            <div className="flex flex-col gap-1.5 max-w-xs">
                <h3 className="text-base font-bold text-slate-700">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* Acción opcional */}
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
