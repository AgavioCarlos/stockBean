import React from "react";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";

interface SucursalesDetalleProps {
    sucursalSeleccionada: any;
    nombre: string;
    setNombre: (value: string) => void;
    direccion: string;
    setDireccion: (value: string) => void;
    telefono: string;
    setTelefono: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    status: boolean;
    setStatus: (value: boolean) => void;
    manejarEnvio: (e: React.FormEvent) => void;
    onDelete: (id: number) => void;
    limpiarFormulario: () => void;
    setVista: (vista: string) => void;
}

const SucursalesDetalle: React.FC<SucursalesDetalleProps> = ({
    sucursalSeleccionada,
    nombre,
    setNombre,
    direccion,
    setDireccion,
    telefono,
    setTelefono,
    email,
    setEmail,
    status,
    setStatus,
    manejarEnvio,
    onDelete,
    limpiarFormulario,
    setVista,
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    type="button"
                    onClick={() => {
                        limpiarFormulario();
                        setVista("lista");
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Volver a la lista
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                    {sucursalSeleccionada ? "Editar Sucursal" : "Nueva Sucursal"}
                </h2>
            </div>

            <form onSubmit={manejarEnvio} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sucursal</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={100}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                                {status ? "Activo" : "Inactivo"}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
                    {sucursalSeleccionada && (
                        <button
                            type="button"
                            onClick={() => onDelete(sucursalSeleccionada.idSucursal)}
                            className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                            <FaTrash className="mr-2" />
                            Eliminar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <FaSave className="mr-2" />
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SucursalesDetalle;
