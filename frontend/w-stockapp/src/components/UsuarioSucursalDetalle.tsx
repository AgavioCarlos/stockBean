import React, { useState, useEffect } from "react";
import { UsuarioSucursal } from "../services/UsuarioSucursalService";
import { Usuario } from "../services/UsuarioSucursalService";
import { Sucursal } from "../services/UsuarioSucursalService";
import { consultarSucursales } from "../services/SucursalService";
import { apiFetch } from "../services/Api";
import { FaEdit, FaCheck } from "react-icons/fa";

interface UsuarioSucursalDetalleProps {
    detalle: UsuarioSucursal | null;
    onSave: (data: Partial<UsuarioSucursal>) => void;
    onCancel: () => void;
}

const UsuarioSucursalDetalle: React.FC<UsuarioSucursalDetalleProps> = ({ detalle, onSave, onCancel }) => {
    const [idUsuario, setIdUsuario] = useState<number | "">("");
    const [idSucursal, setIdSucursal] = useState<number | "">("");
    const [status, setStatus] = useState(true);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    useEffect(() => {
        const loadCatalogs = async () => {
            const sucursalesData = await consultarSucursales();
            setSucursales(sucursalesData);

            const usuariosData = await apiFetch<Usuario[]>("/usuarios");
            if (usuariosData) setUsuarios(usuariosData);
        };
        loadCatalogs();
    }, []);

    useEffect(() => {
        if (detalle) {
            setIdUsuario(detalle.usuario.id_usuario);
            setIdSucursal(detalle.sucursal.idSucursal);
            setStatus(detalle.status);
        } else {
            setIdUsuario("");
            setIdSucursal("");
            setStatus(true);
        }
    }, [detalle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idUsuario === "" || idSucursal === "") return;

        const data: any = {
            usuario: { id_usuario: Number(idUsuario) },
            sucursal: { idSucursal: Number(idSucursal) },
            status
        };
        if (detalle) {
            data.idUsuarioSucursal = detalle.idUsuarioSucursal;
        }

        onSave(data);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                {detalle ? "Editar Asignación" : "Nueva Asignación"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Usuario */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                    <select
                        value={idUsuario}
                        onChange={(e) => {
                            const val = e.target.value;
                            setIdUsuario(val === "" ? "" : Number(val));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        required
                        disabled={!!detalle}
                    >
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map(u => (
                            <option key={u.id_usuario} value={u.id_usuario}>
                                {u.persona.nombre} {u.persona.apellidoPaterno} ({u.cuenta})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sucursal */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sucursal</label>
                    <select
                        value={idSucursal}
                        onChange={(e) => {
                            const val = e.target.value;
                            setIdSucursal(val === "" ? "" : Number(val));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        required
                        disabled={!!detalle}
                    >
                        <option value="">Seleccione una sucursal</option>
                        {sucursales.map(s => (
                            <option key={s.idSucursal} value={s.idSucursal}>
                                {s.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">Estado:</span>
                    <button
                        type="button"
                        onClick={() => setStatus(!status)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${status ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className={`text-sm font-medium ${status ? 'text-green-600' : 'text-gray-500'}`}>
                        {status ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                {/* Botones */}
                <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                    >
                        <span className="flex items-center gap-2">
                            {detalle ? <FaEdit /> : <FaCheck />}
                            {detalle ? "Actualizar" : "Guardar"}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioSucursalDetalle;
