import React, { useState, useEffect } from "react";
import { IoIosSave } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";

// Define types locally for now, should be shared
interface Persona {
    id_persona: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    status: boolean;
}

type Props = {
    personaSeleccionada: Persona | null;
    nombre: string;
    setNombre: (v: string) => void;
    apellidoPaterno: string;
    setApellidoPaterno: (v: string) => void;
    apellidoMaterno: string;
    setApellidoMaterno: (v: string) => void;
    email: string;
    setEmail: (v: string) => void;
    status: boolean;
    setStatus: (v: boolean) => void;
    manejarEnvio: (e: React.FormEvent) => void;
    onDelete?: (id: number, newStatus?: boolean) => void;
    nuevoDesdeDetalle: () => void;
};

export default function PersonaDetalle({
    personaSeleccionada,
    nombre,
    setNombre,
    apellidoPaterno,
    setApellidoPaterno,
    apellidoMaterno,
    setApellidoMaterno,
    email,
    setEmail,
    status,
    setStatus,
    manejarEnvio,
    onDelete,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (personaSeleccionada) {
            setIsEditing(false); // View mode for existing items
        } else {
            setIsEditing(true); // Edit mode for new items
        }
    }, [personaSeleccionada]);

    return (
        <div className="w-full h-full flex flex-col">
            <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {personaSeleccionada ? "Detalle de Persona" : "Nueva Persona"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && personaSeleccionada && (
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

                                {personaSeleccionada && status && (
                                    <button
                                        type="button"
                                        title="Desactivar"
                                        onClick={async () => {
                                            if (!personaSeleccionada) return;
                                            const res = await Swal.fire({
                                                title: '¿Desactivar persona?',
                                                text: `¿Deseas desactivar a "${personaSeleccionada.nombre}"? Esto marcará a la persona como inactiva.`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#d33',
                                                cancelButtonColor: '#3085d6',
                                                confirmButtonText: 'Sí, desactivar',
                                            });
                                            if (res.isConfirmed && typeof onDelete === 'function') {
                                                onDelete(personaSeleccionada.id_persona, false);
                                            }
                                        }}
                                        className="px-4 py-1.5 text-yellow-600 text-sm font-medium rounded-md border border-yellow-600 bg-white hover:bg-yellow-600 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <MdBlock size={18} />
                                        <span>Desactivar</span>
                                    </button>
                                )}

                                {personaSeleccionada && !status && (
                                    <button
                                        type="button"
                                        title="Activar"
                                        onClick={async () => {
                                            if (!personaSeleccionada) return;
                                            const res = await Swal.fire({
                                                title: '¿Activar persona?',
                                                text: `¿Deseas activar a "${personaSeleccionada.nombre}"?`,
                                                icon: 'question',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, activar',
                                            });
                                            if (res.isConfirmed && typeof onDelete === 'function') {
                                                onDelete(personaSeleccionada.id_persona, true);
                                            }
                                        }}
                                        className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm5 8.59L10.7 16.9a1 1 0 0 1-1.4 0l-3.3-3.3a1 1 0 0 1 1.4-1.4l2.6 2.6L15.6 9.2A1 1 0 0 1 17 9.59z" /></svg>
                                        <span>Activar</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                                <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                    placeholder="Nombre de la persona"
                                    required
                                />
                            </div>

                            {/* Apellido Paterno */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Apellido Paterno</label>
                                <input
                                    value={apellidoPaterno}
                                    onChange={(e) => setApellidoPaterno(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                    placeholder="Apellido Paterno"
                                    required
                                />
                            </div>

                            {/* Apellido Materno */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Apellido Materno</label>
                                <input
                                    value={apellidoMaterno}
                                    onChange={(e) => setApellidoMaterno(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                    placeholder="Apellido Materno"
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                    {isEditing
                        ? "Edita los campos y guarda los cambios."
                        : "Modo visualización. Click en Editar para modificar."
                    }
                </div>
            </form>
        </div>
    );
}
