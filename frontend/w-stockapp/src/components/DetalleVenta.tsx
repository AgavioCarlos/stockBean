import { IoMdClose } from "react-icons/io";

interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagenUrl?: string;
    // Size can be added if needed, for now assuming generic product
    talla?: string;
}

interface Props {
    items: CartItem[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemoveItem: (id: number) => void;
}

export default function DetalleVenta({ items, onUpdateQuantity, onRemoveItem }: Props) {
    const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const total = subtotal; // Add tax or shipping if needed

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart.</h2>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm border-b">
                            <th className="pb-4 font-medium">Product</th>
                            <th className="pb-4 font-medium">Size</th>
                            <th className="pb-4 font-medium text-center">Quantity</th>
                            <th className="pb-4 font-medium text-right">Total Price</th>
                            <th className="pb-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b last:border-0">
                                <td className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.imagenUrl ? (
                                                <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{item.nombre}</h3>
                                            {/* Placeholder for category or color if available */}
                                            <span className="text-gray-400 text-sm">Color: Generic</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {/* Placeholder for size selector */}
                                    <div className="relative inline-block">
                                        <select className="appearance-none bg-transparent border-none text-gray-600 font-medium pr-6 cursor-pointer focus:outline-none" disabled>
                                            <option>{item.talla || 'N/A'}</option>
                                        </select>
                                        {/* Down arrow icon could go here */}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                                            disabled={item.cantidad <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.cantidad}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 text-right font-bold text-gray-800">
                                    ${(item.precio * item.cantidad).toFixed(2)}
                                </td>
                                <td className="py-4 text-right">
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <IoMdClose size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400">
                                    No hay productos en el carrito.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 border-t pt-6 space-y-2">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-bold text-gray-800">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
