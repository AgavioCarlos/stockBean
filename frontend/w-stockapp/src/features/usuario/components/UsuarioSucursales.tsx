import React, { useState, useEffect, useCallback } from 'react';
import { MdStore, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { consultarSucursales } from '../../../services/SucursalService';
import { obtenerPorIdUsuario, asignarUsuarioSucursal, actualizarUsuarioSucursal, UsuarioSucursalResponse } from '../../../services/UsuarioSucursalService';
import Swal from 'sweetalert2';

interface UsuarioSucursalesProps {
    idUsuario: number;
}

export const UsuarioSucursales: React.FC<UsuarioSucursalesProps> = ({ idUsuario }) => {
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [asignaciones, setAsignaciones] = useState<UsuarioSucursalResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarDatos = useCallback(async () => {
        if (!idUsuario) return;
        setLoading(true);
        try {
            const [todas, misAsignaciones] = await Promise.all([
                consultarSucursales(),
                obtenerPorIdUsuario(idUsuario)
            ]);
            setSucursales(todas);
            setAsignaciones(misAsignaciones);
        } catch (error) {
            console.error("Error al cargar sucursales:", error);
        } finally {
            setLoading(false);
        }
    }, [idUsuario]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleToggle = async (idSucursal: number) => {
        const asignacion = asignaciones.find(a => a.idSucursal === idSucursal);

        try {
            if (asignacion) {
                // Ya existe, toggle status
                // La API de PUT espera un objeto tipo UsuarioSucursalEntity
                // Pero como ya existe, podemos enviar los IDs
                await actualizarUsuarioSucursal({
                    idUsuarioSucursal: asignacion.idUsuarioSucursal,
                    usuario: { id_usuario: idUsuario } as any,
                    sucursal: { id_sucursal: idSucursal } as any,
                    status: !asignacion.status
                } as any);
            } else {
                // No existe, crear nueva asignación
                await asignarUsuarioSucursal({
                    usuario: { id_usuario: idUsuario } as any,
                    sucursal: { id_sucursal: idSucursal } as any,
                    status: true
                } as any);
            }
            // Recargar para ver cambios
            await cargarDatos();
            Swal.fire({
                icon: 'success',
                title: '¡Cambio guardado!',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } catch (error) {
            console.error("Error al cambiar asignación:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la sucursal.'
            });
        }
    };

    if (!idUsuario) return null;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-3xl"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <MdStore size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-800">Sucursales Asociadas</h4>
                        <p className="text-xs text-slate-400 font-medium">Asigna las sucursales a las que este usuario tiene acceso</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : sucursales.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-4">No hay sucursales registradas.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sucursales.map(sucursal => {
                            const id_sucursal = sucursal.id_sucursal || sucursal.idSucursal;
                            const asignacion = asignaciones.find(a => a.idSucursal === id_sucursal);
                            const isActive = asignacion?.status ?? false;

                            return (
                                <button
                                    key={id_sucursal}
                                    type="button"
                                    onClick={() => handleToggle(id_sucursal)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group ${isActive
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                        : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className={`text-sm font-bold ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>
                                            {sucursal.nombre}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                                            {sucursal.direccion}
                                        </span>
                                    </div>
                                    <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-emerald-600' : 'text-slate-300'}`}>
                                        {isActive ? <MdCheckBox size={26} /> : <MdCheckBoxOutlineBlank size={26} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
