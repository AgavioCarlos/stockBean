import { useState, useEffect } from "react";
import { IMetodoPago, ICarritoItem } from "../punto_venta.interface";
import { obtenerMetodosPago } from "../VentaService";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { HiOutlineBanknotes, HiCheck } from "react-icons/hi2";

interface Props {
    items: ICarritoItem[];
    totalAmount: number;
    onPagar: (idMetodoPago: number) => void;
    procesando: boolean;
}

export default function PanelPago({ items, totalAmount, onPagar, procesando }: Props) {
    const [metodosPago, setMetodosPago] = useState<IMetodoPago[]>([]);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState<number | null>(null);
    const [loadingMetodos, setLoadingMetodos] = useState(true);

    useEffect(() => {
        obtenerMetodosPago()
            .then((metodos) => {
                setMetodosPago(metodos);
                if (metodos.length > 0) {
                    setMetodoSeleccionado(metodos[0].idMetodoPago);
                }
            })
            .catch(console.error)
            .finally(() => setLoadingMetodos(false));
    }, []);

    const getIconForMetodo = (nombre: string) => {
        const lower = nombre.toLowerCase();
        if (lower.includes("tarjeta") || lower.includes("card") || lower.includes("crédito") || lower.includes("débito"))
            return <FaCreditCard size={18} />;
        if (lower.includes("efectivo") || lower.includes("cash"))
            return <FaMoneyBillWave size={18} />;
        return <HiOutlineBanknotes size={18} />;
    };

    const handlePagar = () => {
        if (metodoSeleccionado !== null) {
            onPagar(metodoSeleccionado);
        }
    };

    const disabled = items.length === 0 || metodoSeleccionado === null || procesando;

    return (
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Resumen de Pago</h2>
                <p className="text-xs text-gray-400 mt-0.5">Selecciona el método de pago</p>
            </div>

            <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
                {/* Total grande prominente */}
                <div className="text-center py-4">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total a cobrar</span>
                    <div className="text-4xl font-extrabold text-gray-800 mt-1">
                        ${totalAmount.toFixed(2)}
                    </div>
                    <span className="text-xs text-gray-300 mt-1">
                        {items.length} {items.length === 1 ? "producto" : "productos"}
                    </span>
                </div>

                {/* Métodos de pago */}
                <div>
                    <label className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-3">Método de Pago</label>

                    {loadingMetodos ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {metodosPago.map((metodo) => (
                                <button
                                    key={metodo.idMetodoPago}
                                    type="button"
                                    onClick={() => setMetodoSeleccionado(metodo.idMetodoPago)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left ${metodoSeleccionado === metodo.idMetodoPago
                                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm shadow-indigo-100"
                                        : "border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${metodoSeleccionado === metodo.idMetodoPago
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "bg-gray-100 text-gray-400"
                                        }`}>
                                        {getIconForMetodo(metodo.nombre)}
                                    </div>
                                    <span className="font-semibold text-sm flex-1">{metodo.nombre}</span>
                                    {metodoSeleccionado === metodo.idMetodoPago && (
                                        <HiCheck className="text-indigo-500" size={20} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumen de items */}
                {items.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Detalle</span>
                        {items.map((item) => (
                            <div key={item.idProducto} className="flex justify-between text-sm">
                                <span className="text-gray-500 truncate mr-3">
                                    {item.cantidad}x {item.nombre}
                                </span>
                                <span className="font-medium text-gray-700 flex-shrink-0">
                                    ${item.subtotal.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botón de pago */}
            <div className="px-6 py-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handlePagar}
                    disabled={disabled}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98]"
                        }`}
                >
                    {procesando ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <HiOutlineBanknotes size={20} />
                            Cobrar ${totalAmount.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
