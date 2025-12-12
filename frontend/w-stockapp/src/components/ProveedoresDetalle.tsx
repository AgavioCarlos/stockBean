import React, { useEffect, useState } from 'react';
import { Proveedor } from "../services/Proveedores";
import { IoIosSave } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";

interface ProveedoresDetalleProps {
    proveedorSeleccionado: Proveedor | null;
    nombre: string;
    setNombre: (value: string) => void;
    direccion: string;
    setDireccion: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    status: boolean;
    setStatus: (value: boolean) => void;
    manejarEnvio: (e: React.FormEvent) => void;
    nuevoDesdeDetalle: () => void;
    onDelete?: (id: number) => void;
}

const ProveedoresDetalle: React.FC<ProveedoresDetalleProps> = ({
    proveedorSeleccionado,
    nombre,
    setNombre,
    direccion,
    setDireccion,
    email,
    setEmail,
    status,
    setStatus,
    manejarEnvio,
    nuevoDesdeDetalle,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (proveedorSeleccionado) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [proveedorSeleccionado]);

    return (
        <div className="w-full h-full flex flex-col">
            <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {proveedorSeleccionado ? "Detalle de Proveedor" : "Nuevo Proveedor"}
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

                        {!isEditing && proveedorSeleccionado && (
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

                        {proveedorSeleccionado && isEditing && onDelete && (
                            <button
                                type="button"
                                onClick={() => {
                                    Swal.fire({
                                        title: "¿Estás seguro?",
                                        text: `¿Estás seguro de que quieres eliminar "${proveedorSeleccionado.nombre}"?`,
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#d33",
                                        cancelButtonColor: "#3085d6",
                                        confirmButtonText: "Sí, eliminar",
                                        cancelButtonText: "Cancelar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            onDelete(proveedorSeleccionado.idProveedor);
                                            nuevoDesdeDetalle();
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
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="Ej: Distribuidora S.A."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="contacto@empresa.com"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dirección</label>
                                    <textarea
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="Calle 123, Colonia..."
                                        rows={3}
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

export default ProveedoresDetalle;
