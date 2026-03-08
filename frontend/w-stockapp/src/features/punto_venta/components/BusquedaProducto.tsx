import { IProductoBusqueda } from "../punto_venta.interface";
import { HiOutlineCube } from "react-icons/hi2";

interface Props {
    resultados: IProductoBusqueda[];
    visible: boolean;
    onSelect: (producto: IProductoBusqueda) => void;
    buscando: boolean;
}

export default function BusquedaProducto({ resultados, visible, onSelect, buscando }: Props) {
    if (!visible) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-80 overflow-y-auto"
            style={{ backdropFilter: "blur(20px)" }}>

            {buscando && (
                <div className="flex items-center justify-center py-8 gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 text-sm font-medium">Buscando...</span>
                </div>
            )}

            {!buscando && resultados.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <HiOutlineCube size={32} className="mb-2 opacity-40" />
                    <span className="text-sm font-medium">No se encontraron productos</span>
                </div>
            )}

            {!buscando && resultados.map((producto) => (
                <button
                    key={producto.idProducto}
                    type="button"
                    onClick={() => onSelect(producto)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50/60 transition-all duration-200 text-left border-b border-gray-50 last:border-0 group"
                >
                    {/* Imagen o placeholder */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 group-hover:border-indigo-200 transition-colors">
                        {producto.imagenUrl ? (
                            <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full object-cover" />
                        ) : (
                            <HiOutlineCube size={20} className="text-gray-300" />
                        )}
                    </div>

                    {/* Info del producto */}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate text-sm group-hover:text-indigo-700 transition-colors">
                            {producto.nombre}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            {producto.codigoBarras && (
                                <span className="text-xs text-gray-400 font-mono">{producto.codigoBarras}</span>
                            )}
                            {producto.categoria && (
                                <span className="text-xs text-gray-300">•</span>
                            )}
                            {producto.categoria && (
                                <span className="text-xs text-gray-400">{producto.categoria}</span>
                            )}
                        </div>
                    </div>

                    {/* Precio y stock */}
                    <div className="text-right flex-shrink-0">
                        <div className="font-bold text-indigo-600 text-sm">
                            ${producto.precioVenta?.toFixed(2) || "0.00"}
                        </div>
                        <div className={`text-xs font-medium mt-0.5 ${producto.stockDisponible <= producto.stockMinimo
                            ? "text-amber-500"
                            : "text-emerald-500"
                            }`}>
                            {producto.stockDisponible} en stock
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
