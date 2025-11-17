import { useState } from "react";
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Layouts/Sidebar";

function Prooveadores() {
    
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
            <h1>Hola Proovedores</h1>
        </div>
    )
}
export default Prooveadores;