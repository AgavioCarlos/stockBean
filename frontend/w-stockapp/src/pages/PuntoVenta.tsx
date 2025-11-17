import { useState } from "react";
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Layouts/Sidebar";
import { TbCashRegister } from "react-icons/tb";


function PuntoVenta() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
    <div>
        <Header/>
            <button
                className="text-3xl p-4"
                onClick={() => setIsSidebarOpen(true)}
                >
                ☰
            </button>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="w-200 h-16 bg-gray-300 p-4 flex items-center justify-center mx-auto">
            <input
                type="text"
                placeholder="Capturar codigo"
                className="
                w-full h-11 px-4 rounded-lg border border-gray-300
                bg-white text-gray-800 placeholder:text-gray-400
                outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            <button
                className="bg-black-500 text-black px-4 py-2 rounded"
            >
                <TbCashRegister/>

            </button>
        </div>

    </div>
    )
}

export default PuntoVenta;