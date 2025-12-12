import React, { ChangeEvent, useEffect, useState } from "react";
import type { Inventario } from "../services/Inventario";
import { IoIosSave } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";

type Props = {
    inventarioSeleccionado: Inventario | null;
    idProducto: number | "";
    setIdProducto: (v: number | "") => void;
    idSucursal: number | "";
    setIdSucursal: (v: number | "") => void;
    stockActual: number | "";
    setStockActual: (v: number | "") => void;
    stockMinimo: number | "";
    setStockMinimo: (v: number | "") => void;

    manejarEnvio: (e: React.FormEvent) => void;
    onDelete?: (id: number) => void;
    nuevoDesdeDetalle: () => void;
    setVista: (v: string) => void;

    productosList: any[];
    sucursalesList: any[];
};

export default function InventarioDetalle({
    inventarioSeleccionado,
    idProducto,
    setIdProducto,
    idSucursal,
    setIdSucursal,
    stockActual,
    setStockActual,
    stockMinimo,
    setStockMinimo,
    manejarEnvio,
    nuevoDesdeDetalle,
    setVista,
    onDelete,
    productosList,
    sucursalesList,
}: Props) {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (inventarioSeleccionado) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [inventarioSeleccionado]);

    return (
        <div className="w-full h-full flex flex-col">
            <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {inventarioSeleccionado ? "Detalle de Inventario" : "Nuevo Inventario"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && inventarioSeleccionado && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-1.5 text-blue-600 text-sm font-medium rounded-md border border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span>Editar</span>
                            </button>
                        )}

                        {isEditing && (
                            <button
                                type="submit"
                                className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <IoIosSave size={18} />
                                <span>Guardar</span>
                            </button>
                        )}

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={nuevoDesdeDetalle}
                                className="px-4 py-1.5 text-gray-600 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                            >
                                Nuevo
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Form */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="flex gap-8 h-full">
                        {/* Single Column for Simplicity */}
                        <div className="w-full max-w-2xl flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Producto</label>
                                    <select
                                        value={idProducto}
                                        onChange={(e) => setIdProducto(e.target.value === "" ? "" : Number(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                                    >
                                        <option value="">Seleccionar Producto...</option>
                                        {productosList.map((p: any) => (
                                            <option key={p.id_producto} value={p.id_producto}>
                                                {p.nombre} ({p.codigoBarras})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sucursal</label>
                                    <select
                                        value={idSucursal}
                                        onChange={(e) => setIdSucursal(e.target.value === "" ? "" : Number(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                                    >
                                        <option value="">Seleccionar Sucursal...</option>
                                        {sucursalesList.map((s: any) => (
                                            <option key={s.idSucursal} value={s.idSucursal}>
                                                {s.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Actual</label>
                                    <input
                                        type="number"
                                        value={stockActual}
                                        onChange={(e) => setStockActual(e.target.value === "" ? "" : Number(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Mínimo</label>
                                    <input
                                        type="number"
                                        value={stockMinimo}
                                        onChange={(e) => setStockMinimo(e.target.value === "" ? "" : Number(e.target.value))}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="0"
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
}
