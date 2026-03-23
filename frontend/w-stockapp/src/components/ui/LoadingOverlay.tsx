import React, { ReactNode } from 'react';

interface LoadingOverlayProps {
    /** Texto que aparece bajo el spinner */
    message?: string;
    /** Si true, cubre toda la pantalla. Default: cubre el contenedor padre (position: relative) */
    fullScreen?: boolean;
}

/**
 * Overlay de carga reutilizable. Usar dentro de un contenedor con `position: relative`.
 *
 * @example
 * // Overlay de sección
 * <div className="relative">
 *   {loading && <LoadingOverlay message="Cargando productos..." />}
 *   <DataTable ... />
 * </div>
 *
 * @example
 * // Overlay de pantalla completa
 * {loading && <LoadingOverlay fullScreen message="Iniciando sesión..." />}
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    message = 'Cargando...',
    fullScreen = false,
}) => {
    const baseClasses = 'z-20 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur-[2px] transition-all duration-300';
    const positionClasses = fullScreen
        ? 'fixed inset-0'
        : 'absolute inset-0 rounded-inherit';

    return (
        <div
            className={`${baseClasses} ${positionClasses}`}
            role="status"
            aria-label={message}
        >
            {/* Spinner */}
            <div
                className="w-9 h-9 rounded-full border-[3px] border-empresa-primario/20 border-t-empresa-primario animate-spin"
                aria-hidden="true"
            />

            {/* Mensaje */}
            <span
                className="text-xs font-semibold text-slate-500 tracking-wide"
                aria-live="polite"
            >
                {message}
            </span>
        </div>
    );
};
