import React, { useState } from 'react';
import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { consultarRoles, crearRol } from "../services/Roles";
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Layouts/Sidebar";
import Footer from "../components/Layouts/Footer";
import "../components/dataTables.css";

// Registrar AllCommunityModule
ModuleRegistry.registerModules([AllCommunityModule]);

interface Roles {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    consultarRoles()
      .then((data: Roles[]) => {
        setRoles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar roles:", error);
        setLoading(false);
      });
  }, []);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevoRol = await crearRol({
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
      });
      setRoles(prev => [...prev, nuevoRol]);
      setMostrarModal(false);
      setNuevoNombre('');
      setNuevaDescripcion('');
    } catch (error) {
      console.error("Error al guardar rol:", error);
      alert("Error al guardar");
    }
  };
  const columnDefs = [
    { 
      field: "id_rol", 
      headerName: "ID", 
      width: 80,
      suppressSizeToFit: true,
      editable: false,
      filter: false
    },
    { 
      field: "nombre", 
      headerName: "Nombre ↑", 
      width: 150,
      editable: true,
      filter: false,
      cellStyle: { fontWeight: '500' }
    },
    { 
      field: "descripcion", 
      headerName: "Descripción",
      width: 250,
      editable: false,
      filter: false,
      flex: 1,
      minWidth: 200
    },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: true,
    cellClass: 'text-sm text-gray-700',
    headerClass: 'font-semibold text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <button
        className="fixed top-20 left-4 z-40 text-3xl p-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`pt-20 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="px-6">
          
          <div className="flex items-center justify-end mb-6">
            <div className="flex gap-3">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                type='button' 
                onClick={abrirModal}
              >
                Nuevo
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                type='button'
              >
                Eliminar
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando datos...</p>
              </div>
            ) : roles && roles.length > 0 ? (
              <div 
                className="ag-theme-alpine compact-grid" 
                style={{ 
                  height: '500px',
                  width: '100%'
                }}
              >
                <AgGridReact
                  rowData={roles}
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
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar</h2>
            <form onSubmit={manejarEnvio}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  placeholder="Descripción"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nuevaDescripcion}
                  onChange={e => setNuevaDescripcion(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <span className="mr-3 text-sm text-gray-700">Activo</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-200"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />    </div>
  );
};

export default Roles;