import React, { useState } from 'react';
import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { consultarCategorias } from "../services/Categoria";
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Sidebar";

// Registrar AllCommunityModule
ModuleRegistry.registerModules([AllCommunityModule]);

interface Categoria {
  idCategoria: number;
  nombre: string;
  fechaAlta: string;
  status: boolean;
}
const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Estados para el formulario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoStatus, setNuevoStatus] = useState(true);

  useEffect(() => {
    consultarCategorias()
      .then((data: Categoria[]) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar categorias:", error);
        setLoading(false);
      });
  }, []);

  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  // POST al backend
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre,
          status: nuevoStatus,
        }),
      });
      if (!response.ok) throw new Error("Error al crear categoría");
      // Recargar categorías
      const nuevaCategoria = await response.json();
      setCategorias([...categorias, nuevaCategoria]);
      setMostrarModal(false);
      setNuevoNombre('');
      setNuevoStatus(true);
    } catch (error) {
      alert("Error al guardar la categoría");
    }
  };

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
        className={`transition-all duration-300 ${
          isSidebarOpen
            ? 'ml-[265px]'
            : 'ml-[30px]'
        }`}
      >
          <h1>Categorias</h1>
          <button className = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded btnNuevo" type='button' onClick={abrirModal}>Nuevo</button>
          <button className= "ml-5 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded btnEliminar" type='button'>Eliminar</button>

      </div>

      <div
        className={`transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'ml-[265px]' : 'ml-[30px]'}`}
      >
        {categorias && categorias.length > 0 ? (
          <div className="ag-theme-alpine w-220 h-96 bg-white rounded-xl shadow-md p-4">
            <AgGridReact
              theme="legacy"
              rowData={categorias}
              columnDefs={[
                { field: "idCategoria", headerName: "ID", editable: false, filter: false },
                { field: "nombre", headerName: "Nombre", editable: true, filter: false },
                { field: "fechaAlta", headerName: "Fecha", editable: false, filter: false },
                { field: "status", headerName: "Activo", editable: true, filter: false },
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


      {mostrarModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        bg-white w-80 p-6 rounded-lg shadow-2xl z-50">
          <h2 className="text-lg font-bold mb-4">Categoria</h2>
          <form onSubmit={manejarEnvio}>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border px-3 py-2 mb-3 rounded"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              required
            />
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-2 text-sm">Activo</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={nuevoStatus}
                  onChange={() => setNuevoStatus(!nuevoStatus)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={cerrarModal}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancelar
              </button>
              <button className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-2">
                <FontAwesomeIcon icon={faFloppyDisk} className="w-5 h-5" />
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
  </div>
  );
};

export default Categorias;
