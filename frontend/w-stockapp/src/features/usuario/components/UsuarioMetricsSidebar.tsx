import React from 'react';
import { MdOutlineAdminPanelSettings, MdPeopleOutline, MdCheckCircleOutline } from "react-icons/md";

// Note: Ensure metrics display user activity appropriately
export const UsuarioMetricsSidebar = () => {
    return (
        <div className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col items-center justify-start text-white p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
                <MdOutlineAdminPanelSettings className="text-indigo-400" size={24} />
                Métricas de Usuario
            </h2>

            <div className="w-full space-y-4">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <MdPeopleOutline className="text-blue-400" size={20} />
                        <h3 className="text-sm font-semibold text-slate-300">Total Usuarios</h3>
                    </div>
                    <p className="text-3xl font-black text-white">--</p>
                    <p className="text-xs text-slate-400 mt-2">Usuarios registrados</p>
                </div>

                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <MdCheckCircleOutline className="text-emerald-400" size={20} />
                        <h3 className="text-sm font-semibold text-slate-300">Usuarios Activos</h3>
                    </div>
                    <p className="text-3xl font-black text-white">--</p>
                    <p className="text-xs text-slate-400 mt-2">Con acceso permitido</p>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                Estas métricas en vivo reflejarán los niveles de actividad y distribución de roles.
            </div>
        </div>
    );
};
