import React, { useEffect, useState } from 'react';
import { SharedButton } from '../../../components/SharedButton';
import { SharedInput } from '../../../components/SharedInput';
import { StatusBadge } from '../../../components/StatusBadge';
import { IoIosSave } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import type { IProductoEmpresa } from '../productoEmpresa.interface';
import { consultarProductos } from '../../Producto/ProductosService';
import type { Productos } from '../../Producto/producto.interface';
import { IoMdAddCircle } from "react-icons/io";

interface ProductoEmpresaFormProps {
    values: Partial<IProductoEmpresa>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (e: React.FormEvent) => void;
    onNew: () => void;
    selection?: IProductoEmpresa | null;
    onToggleStatus?: (item: IProductoEmpresa) => void;
}

export const ProductoEmpresaForm: React.FC<ProductoEmpresaFormProps> = ({
    values,
    handleChange,
    isEditing,
    setIsEditing,
    onSave,
    onNew,
    selection,
    onToggleStatus
}) => {
    const [productos, setProductos] = useState<Productos[]>([]);

    useEffect(() => {
        consultarProductos()
            .then(data => setProductos(Array.isArray(data) ? data : []))
            .catch(err => console.error("Error al cargar productos LOV", err));
    }, []);

    // Helper para mapear id_producto
    const idProductoSelect = values.producto?.id_producto || 0;

    const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prod = productos.find(p => p.id_producto === Number(e.target.value));
        const syntheticEvent = {
            target: { name: 'producto', value: prod || undefined }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
        setIsEditing(true);
    };

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const syntheticEvent = {
            target: { name, type: 'checkbox', checked, value: checked }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
        setIsEditing(true);
    };

    return (
        <form onSubmit={onSave} className="flex flex-col h-full bg-slate-50 relative">
            <div className="flex-none px-6 lg:px-8 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 text-blue-600 shadow-inner">
                            <MdDelete className="w-6 h-6" /> {/* Placeholder icon */}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {selection ? "Detalle Configuración Producto" : "Nueva Configuración de Producto"}
                            </h2>
                            {selection && (
                                <div className="mt-1 flex items-center gap-2">
                                    <StatusBadge status={selection.activo} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full sm:w-auto">
                        {selection && onToggleStatus && (
                            <SharedButton
                                type="button"
                                variant={selection.activo ? "danger" : "success"}
                                onClick={() => onToggleStatus(selection)}
                                icon={<MdDelete size={20} />}
                            >
                                {selection.activo ? 'Desactivar' : 'Reactivar'}
                            </SharedButton>
                        )}
                        <SharedButton
                            type="button"
                            variant="primary"
                            onClick={() => { setIsEditing(true); onNew(); }}
                            icon={<IoMdAddCircle size={20} />}
                        >
                            Nuevo
                        </SharedButton>
                        <SharedButton
                            type="submit"
                            variant="success"
                            disabled={!isEditing}
                            icon={<IoIosSave size={20} />}
                        >
                            Guardar
                        </SharedButton>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                            Información General
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-600 mb-1 block">
                                    Producto
                                </label>
                                <select
                                    name="producto"
                                    value={idProductoSelect}
                                    onChange={handleProductoChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800"
                                >
                                    <option value={0}>Seleccionar producto...</option>
                                    {productos.map(p => (
                                        <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                            Configuración Comercial
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <SharedInput
                                label="Precio Compra"
                                name="precioCompra"
                                type="number"
                                step="0.01"
                                value={values.precioCompra || 0}
                                onChange={handleChange}
                                isEditing={true}
                            />
                            <SharedInput
                                label="Precio Venta"
                                name="precioVenta"
                                type="number"
                                step="0.01"
                                value={values.precioVenta || 0}
                                onChange={handleChange}
                                isEditing={true}
                            />
                            <SharedInput
                                label="Costo Promedio"
                                name="costoPromedio"
                                type="number"
                                step="0.01"
                                value={values.costoPromedio || 0}
                                onChange={handleChange}
                                isEditing={true}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">
                            Reglas de Negocio
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    name="manejaInventario"
                                    checked={values.manejaInventario ?? true}
                                    onChange={handleCheckChange}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="font-medium text-slate-700">Maneja Inventario</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    name="permiteCompra"
                                    checked={values.permiteCompra ?? true}
                                    onChange={handleCheckChange}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="font-medium text-slate-700">Permite Compra</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    name="permiteVenta"
                                    checked={values.permiteVenta ?? true}
                                    onChange={handleCheckChange}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="font-medium text-slate-700">Permite Venta</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
