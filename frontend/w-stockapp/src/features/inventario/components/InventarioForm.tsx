import React from 'react';
import { IoIosSave } from "react-icons/io";
import { BranchFilter } from '../../../components/BranchFilter';
import { IInventario } from '../inventario.interface';
import { SearchableSelect } from '../../../components/SearchableSelect';

interface InventarioFormProps {
    values: any;
    handleChange: (e: any) => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (e: React.FormEvent) => void;
    onNew: () => void;
    selection: IInventario | null;
    productosList: any[];
    tipoPreciosList: any[];
    loadingLovs?: boolean;
    idSucursal: number | "";
    onBranchChange: (id: number | "") => void;
}

export const InventarioForm: React.FC<InventarioFormProps> = ({
    values,
    handleChange,
    isEditing,
    setIsEditing,
    onSave,
    onNew,
    selection,
    productosList,
    tipoPreciosList,
    loadingLovs,
    idSucursal,
    onBranchChange
}) => {
    const productOptions = React.useMemo(() =>
        productosList.map(p => ({
            value: p.id_producto,
            label: p.nombre,
            description: p.codigoBarras ? `Cód: ${p.codigoBarras}` : undefined
        })), [productosList]);

    const tipoPrecioOptions = React.useMemo(() =>
        tipoPreciosList.map(tp => ({
            value: tp.idTipoPrecio,
            label: tp.nombre,
            description: tp.descripcion
        })), [tipoPreciosList]);

    return (
        <div className="w-full h-full flex flex-col">
            <form onSubmit={onSave} className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {selection ? "Detalle de Inventario" : "Nuevo Inventario"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && selection && (
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
                                <span>Guardar Inventario</span>
                            </button>
                        )}

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={onNew}
                                className="px-4 py-1.5 text-gray-600 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                            >
                                Nuevo
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Form */}
                <div className="flex-1 p-6 overflow-visible">
                    <div className="flex gap-8 h-full">
                        <div className="w-full max-w-2xl flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="z-30">
                                    <SearchableSelect
                                        id="idProducto"
                                        label="Producto"
                                        placeholder="Buscar producto…"
                                        options={productOptions}
                                        value={values.idProducto}
                                        onChange={(val) => handleChange({ target: { name: 'idProducto', value: val } } as any)}
                                        disabled={!isEditing || loadingLovs || !!selection}
                                        loading={loadingLovs}
                                    />
                                </div>
                                <div className="z-20">
                                    <BranchFilter
                                        onBranchChange={onBranchChange}
                                        value={idSucursal}
                                        className="w-full"
                                        disabled={!!selection}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="stockActual" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Actual</label>
                                    <input
                                        id="stockActual"
                                        type="number"
                                        name="stockActual"
                                        value={values.stockActual}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        autoComplete="off"
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="stockMinimo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Mínimo</label>
                                    <input
                                        id="stockMinimo"
                                        type="number"
                                        name="stockMinimo"
                                        value={values.stockMinimo}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        autoComplete="off"
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="precioNuevo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Precio Asignado</label>
                                    <input
                                        id="precioNuevo"
                                        type="number"
                                        step="0.01"
                                        name="precioNuevo"
                                        value={values.precioNuevo || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        autoComplete="off"
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-span-2 z-10">
                                    <SearchableSelect
                                        id="idTipoPrecio"
                                        label="Tipo de Precio"
                                        placeholder="Seleccionar tipo de precio..."
                                        options={tipoPrecioOptions}
                                        value={values.idTipoPrecio}
                                        onChange={(val) => handleChange({ target: { name: 'idTipoPrecio', value: val } } as any)}
                                        disabled={!isEditing || loadingLovs}
                                        loading={loadingLovs}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="motivo" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Motivo / Notas</label>
                                    <input
                                        id="motivo"
                                        type="text"
                                        name="motivo"
                                        value={values.motivo || ''}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        autoComplete="off"
                                        className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                        placeholder="Ej: Asignación inicial"
                                    />
                                </div>
                            </div>

                            <div className="mt-2 text-center text-xs text-gray-400">
                                {isEditing
                                    ? "Edita los campos y guarda los cambios."
                                    : "Modo visualización. Haz clic en Editar para modificar."
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
