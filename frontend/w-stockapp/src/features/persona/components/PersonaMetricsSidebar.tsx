import React, { useMemo } from 'react';
import { MdTrendingUp, MdStore, MdAttachMoney } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";

export const PersonaMetricsSidebar: React.FC = () => {
    // Datos simulados de ejemplo
    const sucursales = useMemo(() => [
        { id: 1, name: "Sucursal Central", sales: 45200.50, trend: "+12.5%", isUp: true },
        { id: 2, name: "Sucursal Norte", sales: 32100.00, trend: "+5.2%", isUp: true },
        { id: 3, name: "Sucursal Sur", sales: 18500.25, trend: "-2.4%", isUp: false },
        { id: 4, name: "Sucursal Oriente", sales: 28450.75, trend: "+8.1%", isUp: true },
    ], []);

    const totalSales = sucursales.reduce((acc, curr) => acc + curr.sales, 0);

    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Tarjeta Global Resumen */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdAttachMoney size={120} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-blue-100 font-medium text-sm mb-1 uppercase tracking-wider">Ventas Globales (Hoy)</h3>
                    <div className="text-3xl font-black tracking-tight mb-4">
                        ${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                        <MdTrendingUp size={18} />
                        <span>+8.4% vs Ayer</span>
                    </div>
                </div>
            </div>

            {/* Listado de Sucursales */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-slate-800 font-bold flex items-center gap-2 text-lg tracking-tight">
                        <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <MdStore size={20} />
                        </span>
                        Rendimiento por Sucursal
                    </h3>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {sucursales.map((sucursal) => (
                        <div key={sucursal.id} className="group p-4 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                                    {sucursal.name}
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${sucursal.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {sucursal.isUp ? <MdTrendingUp /> : <AiOutlineStock className="rotate-180" />}
                                    {sucursal.trend}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-slate-800">
                                ${sucursal.sales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>

                            {/* Barra de progreso simulada */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${sucursal.isUp ? 'bg-emerald-500' : 'bg-red-400'}`}
                                    style={{ width: `${Math.random() * 40 + 40}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actividad Reciente Simulado */}
            <div className="bg-slate-800 rounded-3xl p-6 shadow-lg text-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <h4 className="font-semibold mb-4 text-slate-300 relative z-10 uppercase tracking-widest text-xs">Insight Rápido</h4>
                <p className="text-sm leading-relaxed text-slate-400 relative z-10">
                    <span className="text-white font-medium block mb-1">Pico de Actividad detectado.</span>
                    Considera asignar más personal a la <strong className="text-blue-400 font-semibold">Sucursal Central</strong> en el horario de 14:00 a 16:00 hrs para optimizar tiempos.
                </p>
            </div>
        </div>
    );
};
