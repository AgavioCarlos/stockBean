import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Layouts/MainLayout';
import Breadcrumb from '../../components/Breadcrumb';
import { FaHome, FaSave, FaUserShield, FaCheckDouble } from 'react-icons/fa';
import { consultarRoles } from '../../services/Roles';
import { apiFetch } from '../../services/Api';
import { useAuth } from '../../hooks/useAuth';

interface AccesoPantalla {
    idPantalla: number;
    nombrePantalla: string;
    ver: boolean;
}

export default function Permisos() {
    const navigate = useNavigate();
    const { isSistem } = useAuth();
    
    const [roles, setRoles] = useState<any[]>([]);
    const [rolSeleccionado, setRolSeleccionado] = useState<number | null>(null);
    const [pantallas, setPantallas] = useState<AccesoPantalla[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        consultarRoles().then(data => {
            if (data) setRoles(data);
        }).catch(err => console.error("Error cargando roles", err));
    }, []);

    const cargarAccesos = async (idRol: number) => {
        setRolSeleccionado(idRol);
        setLoading(true);
        try {
            const data = await apiFetch(`/admin/roles-permisos/accesos/${idRol}`);
            if (data) setPantallas(data);
        } catch (error) {
            console.error("Error cargando accesos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = (idPantalla: number, valor: boolean) => {
        setPantallas(prev => prev.map(p => {
            if (p.idPantalla === idPantalla) {
                return { 
                    ...p, 
                    ver: valor
                };
            }
            return p;
        }));
    };

    const guardarAccesos = async () => {
        if (!rolSeleccionado) return;
        setSaving(true);
        try {
            await apiFetch(`/admin/roles-permisos/accesos/${rolSeleccionado}`, {
                method: "PUT",
                body: JSON.stringify(pantallas),
            });
            alert("Permisos actualizados correctamente");
        } catch (error) {
            console.error("Error guardando permisos", error);
            alert("Ocurrió un error al guardar los permisos.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="px-6 py-4">
                    <Breadcrumb
                        items={[
                            { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                            { label: "Administrador", onClick: () => navigate("/administrador") },
                            { label: "Permisos" }
                        ]}
                        onBack={() => navigate(-1)}
                    />

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center bg-white gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <FaUserShield size={20} />
                                    </div>
                                    Gestión de Permisos
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Selecciona un rol para ver y configurar sus accesos a cada pantalla del sistema.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="text-sm font-semibold text-gray-600">Rol a configurar:</span>
                                <select 
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[200px] shadow-sm"
                                    onChange={(e) => cargarAccesos(Number(e.target.value))}
                                    defaultValue=""
                                >
                                    <option value="" disabled>-- Seleccione Rol --</option>
                                    {roles.map(r => (
                                        <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={guardarAccesos}
                                    disabled={!rolSeleccionado || saving || !isSistem}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 flex items-center gap-2 text-sm focus:outline-none"
                                >
                                    <FaSave /> {saving ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-x-auto bg-gray-50/30 flex-1">
                            {!rolSeleccionado ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm max-w-2xl mx-auto">
                                    <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaUserShield size={32} className="text-indigo-400"/>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-700 mb-2">Sin rol seleccionado</h4>
                                    <p className="text-sm text-gray-500 px-4">Por favor, selecciona un rol de la lista superior para gestionar de manera detallada sus permisos dentro del sistema.</p>
                                </div>
                            ) : loading ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-4 text-sm font-medium">Cargando pantallas y permisos...</p>
                                </div>
                            ) : pantallas.length > 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-700">Listado de Pantallas</h4>
                                    </div>
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                                <th className="px-6 py-4 font-bold w-1/2 text-gray-600">Pantalla / Módulo</th>
                                                <th className="p-4 font-bold text-center w-1/2 text-indigo-600">
                                                    Permitir Acceso Global
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pantallas.map((p) => {
                                                const parts = p.nombrePantalla.split('(');
                                                const nombre = parts[0].trim();
                                                const modulo = parts.length > 1 ? parts[1].replace(')','').trim() : '';
                                                
                                                return (
                                                <tr key={p.idPantalla} className="hover:bg-indigo-50/20 transition-colors group">
                                                    <td className="px-6 py-4 border-r border-gray-50">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-800">{nombre}</span>
                                                            {modulo && <span className="text-xs text-indigo-600/70 font-semibold">{modulo}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="inline-flex items-center justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="w-6 h-6 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-offset-1 cursor-pointer transition-all shadow-sm"
                                                                checked={p.ver || false} 
                                                                onChange={(e) => handleCheck(p.idPantalla, e.target.checked)}
                                                                disabled={!isSistem}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500 font-medium text-lg">No se encontraron pantallas para asignar accesos.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
