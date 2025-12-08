import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import { useState } from "react";

function Configuracion() {

    const [vista, setVista] = useState("database");
    const pestañas = [
        { key: "database", label: "Base de Datos" },
        { key: "estilos", label: "Personalización" },
    ];
    return (
        <MainLayout>
            <div className="">
                <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />

                {vista === "database" && (
                    <div className="pl-12 mt-4">

                        <label className="block text-sm font-medium text-gray-700" >Base de datos</label>
                        <input className=" px-1 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" />

                        <label className="block text-sm font-medium text-gray-700" >Puerto</label>
                        <input className="mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" />

                        <label className="block text-sm font-medium text-gray-700" >Host</label>
                        <input className="mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" />

                        <label className="block text-sm font-medium text-gray-700" >Contraseña</label>
                        <input className="mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" />
                    </div>
                )}

                {vista === "estilos" && (
                    <div className="pl-12 mt-4">

                        <label className="block text-sm font-medium text-gray-700" >Color Layout:</label>
                        <input className="mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="color" />

                        <label className="block text-sm font-medium text-gray-700" >Logo:</label>
                        <input className="block w-full text-sm text-gray-700
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-indigo-50 file:text-indigo-700
                                          hover:file:bg-indigo-100 mt-2"
                            type="file"
                            accept="image/*" />

                        <label className="block text-sm font-medium text-gray-700 mt-2" >Empresa:</label>
                        <input className="mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Configuracion;