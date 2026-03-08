import { ICarritoItem } from "../punto_venta.interface";
import { IoMdClose } from "react-icons/io";
import { HiOutlineCube, HiMinus, HiPlus } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";

interface Props {
    items: ICarritoItem[];
    onUpdateQuantity: (idProducto: number, delta: number) => void;
    onRemoveItem: (idProducto: number) => void;
}

export default function CarritoVenta({ items, onUpdateQuantity, onRemoveItem }: Props) {
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const descuentoTotal = items.reduce((acc, item) => acc + item.descuento, 0);
    const total = subtotal;
    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <FiShoppingCart className="text-indigo-600" size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Carrito de Venta</h2>
                        <span className="text-xs text-gray-400 font-medium">
                            {totalItems} {totalItems === 1 ? "producto" : "productos"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3 py-16">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                            <FiShoppingCart size={32} />
                        </div>
                        <p className="text-sm font-medium text-gray-400">Escanea o busca un producto</p>
                        <p className="text-xs text-gray-300">Los productos aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {items.map((item) => (
                            <div
                                key={item.idProducto}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                            >
                                {/* Image */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                                    {item.imagenUrl ? (
                                        <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <HiOutlineCube className="text-gray-300" size={20} />
                                    )}
                                </div>

                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm truncate">{item.nombre}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-indigo-500 font-semibold">${item.precioUnitario.toFixed(2)}</span>
                                        {item.unidad && <span className="text-xs text-gray-300">/ {item.unidad}</span>}
                                    </div>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-1 py-1 border border-gray-100">
                                    <button
                                        onClick={() => onUpdateQuantity(item.idProducto, -1)}
                                        disabled={item.cantidad <= 1}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                                    >
                                        <HiMinus size={12} />
                                    </button>
                                    <span className="font-bold text-gray-800 w-7 text-center text-sm">{item.cantidad}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.idProducto, 1)}
                                        disabled={item.cantidad >= item.stockDisponible}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                                    >
                                        <HiPlus size={12} />
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="text-right w-20 flex-shrink-0">
                                    <span className="font-bold text-gray-800 text-sm">${item.subtotal.toFixed(2)}</span>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => onRemoveItem(item.idProducto)}
                                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                                >
                                    <IoMdClose size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer totals */}
            {items.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 space-y-2 bg-gradient-to-b from-white to-gray-50/30">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                        <span className="font-semibold text-gray-600">${subtotal.toFixed(2)}</span>
                    </div>
                    {descuentoTotal > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Descuento</span>
                            <span className="font-semibold text-emerald-500">-${descuentoTotal.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                        <span className="text-base font-bold text-gray-800">Total</span>
                        <span className="text-xl font-extrabold text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
