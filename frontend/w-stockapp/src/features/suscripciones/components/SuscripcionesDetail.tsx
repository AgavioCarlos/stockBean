import React, { useState, useEffect } from "react";
import { SuscripcionAdmin, Sucursal } from "../suscripciones.interface";
import { consultarSucursalesEmpresa, cambiarStatusSuscripcion, extenderFechaSuscripcion } from "../../../services/Suscripciones";
import { StatusBadge } from "../../../components/StatusBadge";
import { MdStorefront, MdExtension, MdPowerSettingsNew, MdAccountBalance } from "react-icons/md";

interface SuscripcionesDetailProps {
    suscripcion: SuscripcionAdmin | null;
    onUpdate: () => void;
}

export const SuscripcionesDetail: React.FC<SuscripcionesDetailProps> = ({ suscripcion, onUpdate }) => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(false);
    const [nuevaFecha, setNuevaFecha] = useState("");

    useEffect(() => {
        if (suscripcion?.idEmpresa) {
            setLoading(true);
            consultarSucursalesEmpresa(suscripcion.idEmpresa)
                .then(data => setSucursales(data || []))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));

            // Set input to current date + 1 year roughly, or existing date
            if (suscripcion.fechaFin) {
                const limit = new Date(suscripcion.fechaFin).toISOString().split("T")[0];
                setNuevaFecha(limit);
            }
        }
    }, [suscripcion]);

    if (!suscripcion) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <MdAccountBalance size={48} className="mb-4 text-slate-300" />
                <p>Selecciona una empresa para ver sus detalles</p>
            </div>
        );
    }

    const handleStatusToggle = async () => {
        try {
            await cambiarStatusSuscripcion(suscripcion.idSuscripcion, !suscripcion.statusSuscripcion);
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Error al cambiar estado");
        }
    };

    const handleExtender = async () => {
        if (!nuevaFecha) return;
        try {
            // we need datetime format roughly
            const dt = `${nuevaFecha}T23:59:59`;
            await extenderFechaSuscripcion(suscripcion.idSuscripcion, dt);
            alert("Fecha extendida correctamente");
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Error al extender fecha");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{suscripcion.nombreComercial}</h2>
                    <p className="text-gray-500">{suscripcion.razonSocial}</p>
                </div>
                <StatusBadge
                    status={suscripcion.statusSuscripcion}
                    trueText="Suscripción Activa"
                    falseText="Suscripción Vencida/Inactiva"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-b border-gray-100 py-6">
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Información de Sistema</p>
                    <div className="space-y-2">
                        <p className="flex justify-between"><span className="text-gray-400">ID Empresa:</span> <span className="font-medium text-gray-700">{suscripcion.idEmpresa}</span></p>
                        <p className="flex justify-between"><span className="text-gray-400">Plan actual:</span> <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">{suscripcion.planNombre}</span></p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-2">Vigencia</p>
                    <div className="space-y-2">
                        <p className="flex justify-between"><span className="text-gray-400">Inicio:</span> <span className="text-gray-700">{new Date(suscripcion.fechaInicio).toLocaleDateString()}</span></p>
                        <p className="flex justify-between"><span className="text-gray-400">Vencimiento:</span> <span className="text-rose-600 font-medium">{new Date(suscripcion.fechaFin).toLocaleDateString()}</span></p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MdStorefront className="text-gray-400" /> Sucursales Activas ({sucursales.length})
                </h3>
                {loading ? (
                    <p className="text-sm text-gray-400">Cargando sucursales...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sucursales.map(s => (
                            <div key={s.id_sucursal} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col">
                                <span className="font-semibold text-gray-700">{s.nombre}</span>
                                <span className="text-xs text-gray-500 mt-1 truncate">{s.direccion}</span>
                            </div>
                        ))}
                        {sucursales.length === 0 && <p className="text-sm text-gray-400 col-span-2">No hay sucursales registradas.</p>}
                    </div>
                )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <MdPowerSettingsNew /> Acciones Administrativas
                </h3>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleStatusToggle}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-white shadow-sm transition-colors ${suscripcion.statusSuscripcion ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                    >
                        {suscripcion.statusSuscripcion ? "Inactivar Suscripción" : "Activar Suscripción"}
                    </button>

                    <div className="flex-1 flex gap-2">
                        <input
                            type="date"
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={nuevaFecha}
                            onChange={(e) => setNuevaFecha(e.target.value)}
                        />
                        <button
                            onClick={handleExtender}
                            title="Extender fecha"
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 font-medium"
                        >
                            <MdExtension /> Extender
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
