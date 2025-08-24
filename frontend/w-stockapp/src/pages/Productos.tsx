import { useEffect, useState } from 'react';
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Sidebar";
import { consultarProductos } from "../services/Productos";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Footer from "../components/Layouts/Footer";

interface Categoria {
  idCategoria: number;
  nombre: string;
}

interface Unidad {
  idUnidad: number;
  nombre: string;
}

interface Marca {
  idMarca: number;
  nombre: string;
}

interface Productos {
    id_producto: number;
    nombre: string;
    descripcion: string;
    Categoria: Categoria[]; 
    Unidad: Unidad[];
    Marca: Marca[];
    codigoBarras: string; 
    imagenUrl: string;
    status: boolean;
}
function Productos(){
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [productos, setProductos] = useState<Productos[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        consultarProductos()
         .then((data: Productos[]) => {
            setProductos(data);
            setLoading(false);
         })
         .catch((error) => {
            console.log("Error al consultar productos", error);
            setLoading(false);
         });
    },[]);

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

            <div
                className={`transition-all duration-300 ease-in-out 
                ${isSidebarOpen ? 'ml-[265px]' : 'ml-[30px]'}`}
                >
                {productos && productos.length > 0 ? (
                <div className="ag-theme-alpine w-220 h-96 bg-white rounded-xl shadow-md p-4">
                    <AgGridReact
                        theme="legacy"
                        rowData={productos}
                        columnDefs={[
                            { field: "id_producto", headerName: "ID", editable: false, filter: false },
                            { field: "nombre", headerName: "Nombre", editable: true, filter: false },
                            { field: "descripcion", headerName: "Descripcion", editable: false, filter: false },
/*                          { field: "Categoria.nombre", headerName: "Categoria", editable: false, filter: false },
                            { field: "unidad", headerName: "Unidad", editable: false, filter: false },
                            { field: "marca", headerName: "Marca", editable: false, filter: false }, */
                            { field: "codigoBarras", headerName: "Codigo", editable: false, filter: false },
                            { field: "status", headerName: "Status", editable: false, filter: false },
                        ]}
                          defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: false,
                            editable: true,
                            floatingFilter: false,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 mt-4">No hay datos para mostrar</div>
                    )}
            
            </div>

            <Footer />
        </div>
    )
}
export default Productos;