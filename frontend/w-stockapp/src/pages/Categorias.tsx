import React, { useState, useEffect } from 'react';
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from '../components/Tabs';
import { consultarCategorias, crearCategoria, actualizarCategoria } from "../services/Categoria";
import { Categoria } from "../interfaces/categoria.interface";
import CategoriasTable from "../components/CategoriasTable";
import CategoriasDetalle from "../components/CategoriasDetalle";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import Swal from 'sweetalert2';

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState("lista");

  // State for filtering
  const [rowDataFiltrada, setRowDataFiltrada] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(true);

  // State for selection/editing
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // State for form
  const [nombre, setNombre] = useState('');
  const [status, setStatus] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data
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

  // Filter logic
  useEffect(() => {
    let datosFiltrados = categorias;

    if (busqueda.trim() !== "") {
      datosFiltrados = datosFiltrados.filter((item) =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    datosFiltrados = datosFiltrados.filter((item) => item.status === filtroEstado);

    setRowDataFiltrada(datosFiltrados);
    setCurrentPage(1);
  }, [busqueda, filtroEstado, categorias]);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleFiltrarEstado = (valor: string) => {
    setFiltroEstado(valor === "true");
  };

  const handleRowClick = (event: any) => {
    const c = event.data;
    setCategoriaSeleccionada(c);
    setNombre(c.nombre);
    setStatus(c.status);
    setVista("detalle");
  };

  const nuevoDesdeDetalle = () => {
    setCategoriaSeleccionada(null);
    setNombre("");
    setStatus(true);
    setVista("detalle");
  };

  const handleDelete = async (id: number, newStatus: boolean = false) => {
    try {
      const cat = categorias.find((c) => c.idCategoria === id);
      if (!cat) {
        await Swal.fire({ icon: 'error', title: 'No encontrado', text: 'Categoría no encontrada' });
        return;
      }

      const payload = {
        nombre: cat.nombre,
        status: newStatus
      };

      await actualizarCategoria(id, payload);

      setCategorias((prev) => prev.map((c) => (c.idCategoria === id ? { ...c, status: newStatus } : c)));
      await Swal.fire({ icon: 'success', title: newStatus ? 'Categoría activada' : 'Categoría desactivada', text: newStatus ? 'La categoría se activó correctamente.' : 'La categoría se desactivó correctamente.', timer: 1500, showConfirmButton: false });
      setVista('lista');

    } catch (error) {
      console.error("Error al cambiar estado:", error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cambiar el estado de la categoría.' });
    }
  };

  // POST/PUT to backend
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nombre,
        status
      };

      if (categoriaSeleccionada) {
        // Update
        const actualizada = await actualizarCategoria(categoriaSeleccionada.idCategoria, payload);
        // Only update local state if we get a response, but we can optimistically update or re-fetch.
        // Assuming backend returns the updated object or we use properties.
        // Using optimistic update for smoother UX or mapping based on successful response.
        // Ideally backend returns the updated object.

        // Re-fetch or map:
        // Let's assume we want to update the local list
        setCategorias(prev => prev.map(p => p.idCategoria === categoriaSeleccionada.idCategoria ? { ...p, ...payload } : p));

        await Swal.fire({ icon: 'success', title: 'Categoría actualizada', text: 'La categoría se actualizó correctamente.', timer: 1500, showConfirmButton: false });
        setVista("lista");

      } else {
        // Create
        const response: any = await crearCategoria(payload);
        // Ensure response is the object
        if (response && response.idCategoria) {
          setCategorias([...categorias, response]);
          nuevoDesdeDetalle(); // Clear form
          await Swal.fire({ icon: 'success', title: 'Categoría creada', text: 'La categoría se creó correctamente.', timer: 1500, showConfirmButton: false });
        } else {
          // Fallback if response structure is different (e.g. wrapper)
          // Reloading all might be safer if unsure, but let's trust standard return
          const nueva = await response; // In case it wasn't awaited properly in service (it is)
          // If service returns response object, we might need .json()? 
          // Service uses apiFetch which presumably returns parsed JSON.
          if (nueva) setCategorias([...categorias, nueva]);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error al guardar la categoría");
    }
  };

  const pestañas = [
    {
      key: "lista",
      label: "Lista",
      icon: <IoMdList />,
      content: (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-2 mt-2">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Buscar..."
                onChange={handleBuscar}
                className="border border-gray-300 rounded-lg px-3 py-2 w-60"
              />
              <select
                value={String(filtroEstado)}
                onChange={(e) => handleFiltrarEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <button
              className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
              type="button"
              onClick={nuevoDesdeDetalle}
            >
              <IoMdAddCircle size={20} />
              <span>Agregar</span>
            </button>
          </div>

          <div className="flex-grow">
            {loading ? (
              <div className="text-center text-gray-500 mt-4">
                Cargando...
              </div>
            ) : rowDataFiltrada && rowDataFiltrada.length > 0 ? (
              <div>
                <CategoriasTable
                  categorias={rowDataFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                  onRowClick={handleRowClick}
                  onDelete={handleDelete}
                />
                <Pagination
                  totalItems={rowDataFiltrada.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                No hay datos para mostrar
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "detalle",
      label: "Detalle",
      icon: <MdDescription />,
      content: (
        <CategoriasDetalle
          categoriaSeleccionada={categoriaSeleccionada}
          nombre={nombre}
          setNombre={setNombre}
          status={status}
          setStatus={setStatus}
          manejarEnvio={manejarEnvio}
          onDelete={handleDelete}
          nuevoDesdeDetalle={nuevoDesdeDetalle}
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        <Breadcrumb
          items={[
            { label: "Proyectos", onClick: () => { } },
            { label: "Catálogo", onClick: () => { } },
            { label: "Categorías" }
          ]}
          onBack={() => console.log("Back")}
        />
        <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
      </div>
    </MainLayout>
  );
};

export default Categorias;
