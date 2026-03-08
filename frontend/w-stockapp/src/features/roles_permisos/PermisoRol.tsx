import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { FaHome, FaSave, FaListOl, FaPlus } from "react-icons/fa";
import { MdSecurity, MdBlock } from "react-icons/md";
import { consultarTodosPermisos, consultarRolesPorPermiso, actualizarRolesPorPermiso, crearPermisoG } from "../../services/RolesPermisos";
import { PermisoSistema, RolAsignacion } from "./roles_permisos.interface";
import { useAuth } from "../../hooks/useAuth";

export default function PermisoRol() {
    const { isSistem, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [permisos, setPermisos] = useState<PermisoSistema[]>([]);
    const [selectedPermiso, setSelectedPermiso] = useState<PermisoSistema | null>(null);
    const [roles, setRoles] = useState<RolAsignacion[]>([]);

    const [rolesActivos, setRolesActivos] = useState<Record<number, boolean>>({});

    const [loadingPermisos, setLoadingPermisos] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [nuevoPermiso, setNuevoPermiso] = useState({ nombre: "", descripcion: "" });

    const fetchPermisos = () => {
        setLoadingPermisos(true);
        consultarTodosPermisos()
            .then(data => { if (data) setPermisos(data); })
            .catch(err => console.error(err))
            .finally(() => setLoadingPermisos(false));
    };

    useEffect(() => {
        if (isSistem) fetchPermisos();
    }, [isSistem]);

    const handleSelectPermiso = async (permiso: PermisoSistema) => {
        setSelectedPermiso(permiso);
        setLoadingData(true);
        try {
            const rolesData = await consultarRolesPorPermiso(permiso.idPermiso);
            if (rolesData) {
                setRoles(rolesData);
                const mapaR: Record<number, boolean> = {};
                rolesData.forEach((r: RolAsignacion) => { mapaR[r.idRol] = r.asignado; });
                setRolesActivos(mapaR);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleToggleRol = (id: number, val: boolean) => setRolesActivos(prev => ({ ...prev, [id]: val }));
    const handleToggleAllRoles = (val: boolean) => {
        const mapaR: Record<number, boolean> = {};
        roles.forEach(r => { mapaR[r.idRol] = val; });
        setRolesActivos(mapaR);
    };

    const handleSave = async () => {
        if (!selectedPermiso) return;
        setSaving(true);
        try {
            const rIds = Object.entries(rolesActivos).filter(([_, a]) => a).map(([id]) => Number(id));
            await actualizarRolesPorPermiso(selectedPermiso.idPermiso, rIds);
            alert("Roles configurados correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        } finally {
            setSaving(false);
        }
    };

    const handleCrearPermiso = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crearPermisoG(nuevoPermiso);
            setNuevoPermiso({ nombre: "", descripcion: "" });
            setShowModal(false);
            fetchPermisos();
            alert("Permiso creado exitosamente");
        } catch (error) {
            console.error(error);
            alert("Error al crear permiso");
        }
    };

    if (authLoading) return <MainLayout><div className="flex justify-center items-center h-full">Cargando...</div></MainLayout>;

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <Breadcrumb
                    showBackButton={true}
                    items={[
                        { label: "Home", icon: <FaHome aria-hidden="true" />, onClick: () => navigate("/dashboard") },
                        { label: "Asignar Permiso a Rol", icon: <MdSecurity aria-hidden="true" /> },
                    ]}
                />

                {!isSistem ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex flex-col items-center gap-4 text-center px-6 py-16">
                            <div className="p-4 bg-rose-50 rounded-2xl">
                                <MdBlock size={48} className="text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Acceso denegado</h3>
                            <p className="text-sm text-slate-400 max-w-sm">Solo SISTEM puede editar.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 h-full min-h-0">
                        {/* Sidebar */}
                        <div className="w-full lg:w-1/4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-shrink-0 min-h-[400px]">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <FaListOl className="text-blue-600" /> Permisos Globales
                                </h3>
                                <button onClick={() => setShowModal(true)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Crear Permiso">
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="p-2 overflow-y-auto flex-1 h-0 lg:h-auto">
                                {loadingPermisos ? <p className="text-sm text-gray-400 p-2">Cargando...</p> : (
                                    <ul className="space-y-1">
                                        {permisos.map(p => (
                                            <li key={p.idPermiso}>
                                                <button
                                                    onClick={() => handleSelectPermiso(p)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg flex flex-col transition-colors ${selectedPermiso?.idPermiso === p.idPermiso ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                                                >
                                                    <span className={`font-semibold text-sm ${selectedPermiso?.idPermiso === p.idPermiso ? 'text-blue-700' : 'text-gray-700'}`}>{p.nombre}</span>
                                                    <span className="text-xs text-gray-400 truncate">{p.descripcion}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Central */}
                        <div className="w-full lg:w-3/4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                                <div>
                                    <h3 className="font-bold text-gray-700">Asignar Permiso a Roles</h3>
                                    <p className="text-xs text-gray-500">{selectedPermiso ? `Roles para: ${selectedPermiso.nombre}` : 'Seleccione un permiso'}</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedPermiso || saving}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-sm"
                                >
                                    <FaSave /> {saving ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                                {!selectedPermiso ? (
                                    <div className="flex h-full min-h-[300px] items-center justify-center text-gray-400">
                                        Selecciona un permiso de la lista para configurarlo
                                    </div>
                                ) : loadingData ? (
                                    <div className="flex h-full min-h-[300px] items-center justify-center text-gray-400">Cargando...</div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                            <h4 className="font-bold text-gray-700">Roles Disponibles</h4>
                                            <label className="flex items-center gap-2 text-xs font-semibold text-blue-600 cursor-pointer hover:text-blue-800">
                                                <input type="checkbox" onChange={(e) => handleToggleAllRoles(e.target.checked)} className="rounded text-blue-600" />
                                                Seleccionar Todos
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {roles.map(rol => (
                                                <label key={rol.idRol} className={`flex items-center justify-between p-3 cursor-pointer rounded-lg border transition-all ${rolesActivos[rol.idRol] ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                                                    <span className={`text-sm font-semibold ${rolesActivos[rol.idRol] ? 'text-indigo-900' : 'text-gray-700'}`}>{rol.nombre}</span>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                                        checked={rolesActivos[rol.idRol] || false}
                                                        onChange={(e) => handleToggleRol(rol.idRol, e.target.checked)}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Permiso</h2>
                            <form onSubmit={handleCrearPermiso} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (e.g. create, update_stock)</label>
                                    <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={nuevoPermiso.nombre} onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, nombre: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={nuevoPermiso.descripcion} onChange={(e) => setNuevoPermiso({ ...nuevoPermiso, descripcion: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">Crear Permiso</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
