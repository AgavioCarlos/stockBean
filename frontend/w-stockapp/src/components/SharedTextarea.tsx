import React, { TextareaHTMLAttributes } from 'react';

interface SharedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Etiqueta visible sobre el textarea */
    label: string;
    /** Si false, el textarea queda deshabilitado y con estilo de solo lectura */
    isEditing: boolean;
    /** Texto de error que reemplaza a `description` y cambia el borde a rojo */
    error?: string;
    /** Texto de ayuda debajo del textarea (se oculta si hay `error`) */
    description?: string;
}

/**
 * Textarea compartido, equivalente a `SharedInput` para campos de texto largo.
 * Aplica los colores y estilos de empresa de forma consistente.
 *
 * @example
 * <SharedTextarea
 *   id="descripcion"
 *   label="Descripción"
 *   isEditing={editando}
 *   value={values.descripcion}
 *   onChange={handleChange}
 *   rows={4}
 *   placeholder="Describe el producto..."
 * />
 */
export const SharedTextarea: React.FC<SharedTextareaProps> = ({
    label,
    isEditing,
    error,
    description,
    id,
    className,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full group">
            {/* Label */}
            <label
                htmlFor={id}
                className={`
                    text-[11px] font-black uppercase tracking-widest
                    transition-colors duration-200
                    ${isEditing
                        ? 'text-slate-600 group-focus-within:text-empresa-primario cursor-pointer'
                        : 'text-slate-400'
                    }
                `}
            >
                {label}
            </label>

            {/* Textarea */}
            <textarea
                id={id}
                disabled={!isEditing}
                {...props}
                className={`
                    w-full px-4 py-3 border-2 rounded-empresa
                    transition-all duration-300
                    font-medium text-slate-800
                    focus:outline-none focus:ring-4
                    focus:ring-empresa-primario/10
                    focus:border-empresa-primario
                    resize-none
                    min-h-[100px]
                    ${!isEditing
                        ? 'bg-slate-50/80 border-slate-100 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    }
                    ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
                    ${className || ''}
                `}
            />

            {/* Descripción / Error */}
            {(description || error) && (
                <p
                    className={`text-xs ${error ? 'text-red-500 font-bold' : 'text-slate-500 font-medium'}`}
                    aria-live={error ? 'polite' : 'off'}
                >
                    {error || description}
                </p>
            )}
        </div>
    );
};
