import React, { useEffect, useState } from 'react';
import { Unidad } from "../interfaces/producto.interface";
import { IoIosSave } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";

interface UnidadesDetalleProps {
    unidadSeleccionada: Unidad | null;
    nombre: string;
    setNombre: (value: string) => void;
    abreviatura: string;
    setAbreviatura: (value: string) => void;
    manejarEnvio: (e: React.FormEvent) => void;
    nuevoDesdeDetalle: () => void;
    onDelete?: (id: number) => void;
}

const UnidadesDetalle: React.FC<UnidadesDetalleProps> = ({
    unidadSeleccionada,
    nombre,
    setNombre,
    abreviatura,
    setAbreviatura,
    manejarEnvio,
    nuevoDesdeDetalle,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (unidadSeleccionada) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [unidadSeleccionada]);

    return (
        <div className="w-full h-full flex flex-col">
            <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {unidadSeleccionada ? "Detalle de Unidad" : "Nueva Unidad"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={nuevoDesdeDetalle}
                            className="px-4 py-1.5 text-gray-600 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <IoMdArrowBack />
                            <span>Volver</span>
                        </button>

                        {!isEditing && unidadSeleccionada && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-1.5 text-blue-600 text-sm font-medium rounded-md border border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                <span>Editar</span>
                            </button>
                        )}

                        {isEditing && (
                            <>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <IoIosSave size={18} />
                                    <span>Guardar</span>
                                </button>
                            </>
                        )}

                        {/* Optional Delete Button if needed in Detalle like Productos */}
                        {unidadSeleccionada && isEditing && onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    Swal.fire({
                                        title: "¿Estás seguro?",
                                        text: `¿Estás seguro de que quieres eliminar "${unidadSeleccionada.nombre}"?`,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#d33",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, eliminar",
                                        cancelButtonText: "Cancelar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            onDelete(unidadSeleccionada.idUnidad);
                                            nuevoDesdeDetalle(); // Go back to list
                                        }
                                    });
                                }}
                                className="px-4 py-1.5 text-red-600 text-sm font-medium rounded-md border border-red-600 bg-white hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <MdBlock size={18} />
                                <span>Eliminar</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Form */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="Ej: Kilogramo"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Abreviatura</label>
                                    <input
                                        type="text"
                                        value={abreviatura}
                                        onChange={(e) => setAbreviatura(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="Ej: kg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-2 text-center text-xs text-gray-400">
                                {isEditing
                                    ? "Edita los campos y guarda los cambios."
                                    : "Modo visualización. Click en Editar para modificar."
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UnidadesDetalle;
