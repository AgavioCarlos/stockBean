import { ChangeEvent, useEffect, useState } from "react";
import Header from "../components/Layouts/Header";
import Sidebar from "../components/Layouts/Sidebar";
import { consultarProductos, crearProducto, eliminarProducto } from "../services/Productos";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoMdAddCircle } from "react-icons/io";
import type { Productos } from "../interfaces/producto.interface";
import Tabs from "../components/Tabs";
import ProductosTable from "../components/ProductosTable";
import ProductosDetalle from "../components/ProductosDetalle";

function Productos() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productos, setProductos] = useState<Productos[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<number | null>(null);
  const [unidad, setUnidad] = useState<number | null>(null);
  const [marca, setMarca] = useState<number | null>(null);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [status, setStatus] = useState(true);
  const [vista, setVista] = useState("lista");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Productos | null>(null);

  const [rowDataFiltrada, setRowDataFiltrada] = useState(productos);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(true);

  const pestañas = [
    { key: "lista", label: "Lista" },
    { key: "detalle", label: "Detalle" },
  ];

  const handleRowClick = (event: any) => {
    const p = event.data;
    setProductoSeleccionado(p);
    setVista("detalle");
    setNombre(p.nombre ?? "");
    setDescripcion(p.descripcion ?? "");
    setCategoria(typeof p.categoria === "number" ? p.categoria : null);
    setUnidad(typeof p.unidad === "number" ? p.unidad : null);
    setMarca(typeof p.marca === "number" ? p.marca : null);
    setCodigoBarras(p.codigoBarras ?? "");
    setImagenUrl(p.imagenUrl ?? "");
    setStatus(typeof p.status === "boolean" ? p.status : true);
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre,
      descripcion,
      idCategoria: categoria ?? null,
      idUnidad: unidad ?? null,
      idMarca: marca ?? null,
      imagenUrl: imagenUrl,
      codigoBarras,
      status,
    };

    try {
      const nuevoProducto = await crearProducto(payload);
      setProductos((prev) => [...prev, nuevoProducto]);
      setNombre("");
      setDescripcion("");
      setCategoria(null);
      setUnidad(null);
      setMarca(null);
      setCodigoBarras("");
      setImagenUrl("");
      setStatus(true);
    } catch (error) {
      console.error("❌ Error al guardar Producto:", error);
      alert("Error al guardar");
    }
  };

  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      setImagenUrl(URL.createObjectURL(archivo));
    }
  };

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
  }, []);

  // 🔍 Filtrar datos cada vez que cambian la búsqueda o el filtro de estado
  useEffect(() => {
    let datosFiltrados = productos;
    console.log(datosFiltrados);

    if (busqueda.trim() !== "") {
      datosFiltrados = datosFiltrados.filter((item) =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    datosFiltrados = datosFiltrados.filter((item) => item.status === filtroEstado);
    
    setRowDataFiltrada(datosFiltrados);
  }, [busqueda, filtroEstado, productos]);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleFiltrarEstado = (valor: string) => {
    setFiltroEstado(valor === "true");
  };

  const nuevoDesdeDetalle = () => {
    setProductoSeleccionado(null);
    setNombre("");
    setDescripcion("");
    setCategoria(null);
    setUnidad(null);
    setMarca(null);
    setCodigoBarras("");
    setImagenUrl("");
    setStatus(true);
    setVista("detalle");
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarProducto(id);
      setProductos(productos.filter((p) => p.id_producto !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div>
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
              nuevoDesdeDetalle();
            }}
          >
            <IoMdAddCircle size={20} />
          </button>
        </div>
      </div>

      {vista === "lista" && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-[265px]" : "ml-[30px]"
          }`}
        >
          <div className="flex gap-4 mb-2 items-center ml-10">
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

          {loading ? <div className="text-center text-gray-500 mt-4">Cargando...</div> : rowDataFiltrada.length > 0 ? (
            <ProductosTable productos={rowDataFiltrada} onRowClick={handleRowClick} onDelete={handleDelete} />
          ) : (
            <div className="text-center text-gray-500 mt-4">
              No hay datos para mostrar
            </div>
          )}
        </div>
      )}

      {vista === "detalle" && (
        <ProductosDetalle
          productoSeleccionado={productoSeleccionado}
          nombre={nombre}
          setNombre={setNombre}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          categoria={categoria}
          setCategoria={setCategoria}
          unidad={unidad}
          setUnidad={setUnidad}
          marca={marca}
          setMarca={setMarca}
          codigoBarras={codigoBarras}
          setCodigoBarras={setCodigoBarras}
          imagenUrl={imagenUrl}
          manejarCambio={manejarCambio}
          status={status}
          setStatus={setStatus}
          manejarEnvio={manejarEnvio}
          nuevoDesdeDetalle={nuevoDesdeDetalle}
          setVista={setVista}
        />
      )}
    </div>
  );
}

export default Productos;
