import { useEffect, useState } from "react";
import { consultarMarcas } from "../services/Marcas";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from 'ag-grid-react';
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Layouts/Sidebar";
ModuleRegistry.registerModules([AllCommunityModule]);

interface Marcas {
        idMarca: number;
        nombre: string;
        status: boolean; 
        fechaAlta: string;
}
function Marcas(){
    
    const [marcas, setMarcas] = useState<Marcas[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        consultarMarcas()
        .then((data: Marcas[]) => {
            setMarcas(data);
            setLoading(false);
        })
        .catch((error) => {
            console.log("Error al consultar marcas:", error);
            setLoading(false);
        })
    }, []);

    const columnDefs = [
        {
            field: "idMarca",
            headerName: "ID",
            suppressSizeToFit: true,
            editable: false, 
            filter: false
        }, 
        {
            field: "nombre", 
            headerName: "Nombre",
            width: 150,
            editable: true, 
            filter: false,
        },
        {
            field: "status", 
            headerName: "Status",
            width: 100,
            editable: false, 
            filter: false,
        },
        {
            field: "fechaAlta", 
            headerName: "Fecha",
            width: 150,
            editable: false, 
            filter: false,
        }
    ];
    
    const defaultColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: true,
    cellClass: 'text-sm text-gray-700',
    headerClass: 'font-semibold text-gray-800'
  };

    return (
        <div>
            <Header/>
            <button
                className="fixed top-20 left-4 z-40 text-3xl p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
            >
                ☰
            </button>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            {/* Contenedor de la tabla */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
                <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando datos...</p>
                </div>
            ) : marcas && marcas.length > 0 ? (
                <div 
                className="ag-theme-alpine compact-grid" 
                style={{ 
                    height: '500px',
                    width: '100%'
                }}
                >
                <AgGridReact
                    rowData={marcas}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowHeight={40}
                    headerHeight={45}
                    suppressHorizontalScroll={true}
                    animateRows={true}
                    enableCellTextSelection={true}
                    ensureDomOrder={true}
                    domLayout='normal'
                />
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                No hay datos para mostrar
                </div>
            )}
            </div>
        </div>
    )
}

export default Marcas;