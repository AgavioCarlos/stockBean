import { useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import DetalleVenta from "../components/DetalleVenta";
import Pago from "../components/Pago";
import { TbBarcode } from "react-icons/tb";

// Mock data for initial visualization
const INITIAL_CART = [
    { id: 1, nombre: "Backpack Beige", precio: 110.99, cantidad: 2, talla: "25 L", imagenUrl: "https://via.placeholder.com/150/f5f5dc/000000?text=Backpack" },
    { id: 2, nombre: "Backpack Navy", precio: 159.99, cantidad: 1, talla: "30 L", imagenUrl: "https://via.placeholder.com/150/000080/ffffff?text=Navy" },
    { id: 3, nombre: "Backpack Yellow", precio: 89.99, cantidad: 1, talla: "25 L", imagenUrl: "https://via.placeholder.com/150/ffff00/000000?text=Yellow" },
];

function PuntoVenta() {
    const [cartItems, setCartItems] = useState(INITIAL_CART);
    const [codigo, setCodigo] = useState("");

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handlePayment = (paymentData: any) => {
        console.log("Processing payment:", paymentData);
        alert("Procesando pago... (Ver consola)");
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <MainLayout>
            <div className="h-[calc(100vh-100px)] flex flex-col gap-6 p-6 bg-gray-50">
                {/* Search / Scan Input Section */}
                <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl text-gray-500">
                        <TbBarcode size={24} />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Capturar código de barras o buscar producto..."
                            className="w-full text-lg bg-transparent border-none outline-none placeholder-gray-400 font-medium"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    {/* Left Column: Cart Details (Takes up more space) */}
                    <div className="lg:col-span-8 h-full min-h-0">
                        <DetalleVenta
                            items={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />
                    </div>

                    {/* Right Column: Payment Form */}
                    <div className="lg:col-span-4 h-full min-h-0">
                        <Pago
                            onSubmit={handlePayment}
                            totalAmount={totalAmount}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default PuntoVenta;