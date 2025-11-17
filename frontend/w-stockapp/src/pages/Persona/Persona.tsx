import  { useEffect, useState } from "react";
import { consultarPersonas } from "../../services/Persona";
import Header from "../../components/Layouts/Header";
import Sidebar from "../../components/Layouts/Sidebar";
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import Tabs from "../../components/Tabs";
import { IoMdAddCircle } from "react-icons/io";

interface Persona {
  id_persona: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  status: boolean;
}

function Persona() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [vista, setVista] = useState("lista");
  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  // Estados para el formulario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoStatus, setNuevoStatus] = useState(true);

  const pestañas = [
    { key: "lista", label: "Lista"},
    { key: "detalle", label: "Detalle"}, 
  ];

  useEffect(() => {
    consultarPersonas()
      .then((data: Persona[]) => {
        setPersonas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar personas:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;

    // POST al backend
    const manejarEnvio = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8080/personas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nuevoNombre,
            status: nuevoStatus,
          }),
        });
        if (!response.ok) throw new Error("Error al crear categoría");
        // Recargar categorías
        const nuevaPersona = await response.json();
        setPersonas([...personas, nuevaPersona]);
        setMostrarModal(false);
        setNuevoNombre('');
        setNuevoStatus(true);
      } catch (error) {
        alert("Error al guardar la categoría");
      }
    };

  return (
    <div className="">
      <Header />
      <button className="text-3xl p-4" onClick={() => setIsSidebarOpen(true)}>
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex items-center justify-between px-6 mb-2">
        <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
        <div className="flex items-center gap-3">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            type="button"
            onClick={() => {
              setVista("detalle");
              // nuevoDesdeDetalle();
            }}
          >
            <IoMdAddCircle size={20} />
          </button>
        </div>
      </div>
      {/* Main: cubre todo el espacio restante ajustándose al sidebar (expandido/collapse) */}
      <main
        className="transition-all duration-300 ease-in-out fixed right-0 bottom-0 overflow-hidden p-6"
        style={{
          // Ajusta top si tu Header no mide 64px. Usa 'top' para dejar espacio al Header fijo.
          top: "64px",
          left: isSidebarOpen ? "265px" : "30px",
        }}
      >
        <div className="w-full h-full">
          <div className="flex items-center justify-end mb-4 p-4">
            <div className="flex items-center gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded btnNuevo"
                type="button"
                onClick={abrirModal}
              >
                Nuevo
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 mr-10 rounded btnEliminar"
                type="button"
              >
                Eliminar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-0 h-[calc(100%-64px)]">
            {personas && personas.length > 0 ? (
              <div className="ag-theme-alpine w-310 h-full">
                <AgGridReact
                  theme="legacy"
                  rowData={personas}
                  columnDefs={[
                    {
                      field: "id_persona",
                      headerName: "ID",
                      editable: false,
                      filter: false,
                    },
                    {
                      field: "nombre",
                      headerName: "Nombre",
                      editable: true,
                      filter: false,
                    },
                    {
                      field: "apellido_paterno",
                      headerName: "Apellido Paterno",
                      editable: false,
                      filter: false,
                    },
                    {
                      field: "apellido_materno",
                      headerName: "Apellido Materno",
                      editable: true,
                      filter: false,
                    },
                    {
                      field: "email",
                      headerName: "Email",
                      editable: true,
                      filter: false,
                    },
                    {
                      field: "status",
                      headerName: "Status",
                      editable: true,
                      filter: false,
                    },
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
              <div className="text-center text-gray-500 mt-4">
                No hay datos para mostrar
              </div>
            )}
          </div>
        </div>
      </main>
      {mostrarModal && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                    bg-white w-80 p-6 rounded-lg shadow-2xl z-50"
        >
          <h2 className="text-lg font-bold mb-4">Categoria</h2>
          <form onSubmit={manejarEnvio}>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border px-3 py-2 mb-3 rounded"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
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
}

export default Persona;
