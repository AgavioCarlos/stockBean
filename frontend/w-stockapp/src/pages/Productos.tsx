import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layouts/MainLayout";
import { consultarProductos, crearProducto, actualizarProducto } from "../services/Productos";
import { consultarCategorias } from "../services/Categoria";
import { consultarMarcas } from "../services/Marcas";
import { consultarUnidades } from "../services/Unidad";
import Swal from 'sweetalert2';
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import type { Productos } from "../interfaces/producto.interface";
import Tabs from "../components/Tabs";
import ProductosTable from "../components/ProductosTable";
import ProductosDetalle from "../components/ProductosDetalle";
import Pagination from "../components/Pagination";

import Breadcrumb from "../components/Breadcrumb";
import SearchInput from "../components/SearchInput";
import StatusFilter from "../components/StatusFilter";
import { PdfButton, ExcelButton } from "../components/Buttons";

function Productos() {
  const navigate = useNavigate();
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // ... (rest of state)
  const [categoriasList, setCategoriasList] = useState<any[]>([]);
  const [marcasList, setMarcasList] = useState<any[]>([]);
  const [unidadesList, setUnidadesList] = useState<any[]>([]);

  const [rowDataFiltrada, setRowDataFiltrada] = useState(productos);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(true);

  // ... (handlers: handleRowClick, manejarEnvio, manejarCambio, useEffects, handleBuscar, handleFiltrarEstado, nuevoDesdeDetalle, handleDelete)

  const handleRowClick = (event: any) => {
    const p = event.data;
    setProductoSeleccionado(p);
    setVista("detalle");
    setNombre(p.nombre ?? "");
    setDescripcion(p.descripcion ?? "");
    setCategoria(
      Array.isArray(p.Categoria) && p.Categoria.length > 0
        ? p.Categoria[0].idCategoria
        : typeof (p as any).categoria === "number"
          ? (p as any).categoria
          : 0
    );
    setUnidad(
      Array.isArray(p.Unidad) && p.Unidad.length > 0
        ? p.Unidad[0].idUnidad
        : typeof (p as any).unidad === "number"
          ? (p as any).unidad
          : 0
    );
    setMarca(
      Array.isArray(p.Marca) && p.Marca.length > 0
        ? p.Marca[0].idMarca
        : typeof (p as any).marca === "number"
          ? (p as any).marca
          : 0
    );
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
      if (productoSeleccionado) {
        const actualizado = await actualizarProducto(productoSeleccionado.id_producto, payload);
        // actualizar la lista local con la respuesta del servidor si viene completa
        setProductos((prev) =>
          prev.map((p) => (p.id_producto === productoSeleccionado.id_producto ? { ...p, ...actualizado } : p))
        );
        await Swal.fire({ icon: 'success', title: 'Producto actualizado', text: 'El producto se actualizó correctamente.', timer: 1500, showConfirmButton: false });
        setVista("lista");
      } else {
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
        await Swal.fire({ icon: 'success', title: 'Producto creado', text: 'El producto se creó correctamente.', timer: 1500, showConfirmButton: false });
      }
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
    Promise.all([
      consultarProductos(),
      consultarCategorias(),
      consultarMarcas(),
      consultarUnidades()
    ]).then(([productosData, categoriasData, marcasData, unidadesData]) => {
      setProductos(productosData);
      if (Array.isArray(categoriasData)) setCategoriasList(categoriasData);
      if (Array.isArray(marcasData)) setMarcasList(marcasData);
      if (Array.isArray(unidadesData)) setUnidadesList(unidadesData);
      setLoading(false);
    }).catch((error) => {
      console.log("Error al cargar datos iniciales", error);
      setLoading(false);
    });
  }, []);


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
    setCurrentPage(1);
  }, [busqueda, filtroEstado, productos]);

  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleFiltrarEstado = (valor: boolean) => {
    setFiltroEstado(valor);
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

  const handleDelete = async (id: number, newStatus: boolean = false) => {
    try {
      const producto = productos.find((p) => p.id_producto === id);
      if (!producto) {
        await Swal.fire({ icon: 'error', title: 'No encontrado', text: 'Producto no encontrado' });
        return;
      }

      const payload = {
        nombre: producto.nombre ?? "",
        descripcion: producto.descripcion ?? "",
        idCategoria:
          (Array.isArray((producto as any).Categoria) && (producto as any).Categoria[0]?.idCategoria) ??
          (typeof (producto as any).categoria === "number" ? (producto as any).categoria : null),
        idUnidad:
          (Array.isArray((producto as any).Unidad) && (producto as any).Unidad[0]?.idUnidad) ??
          (typeof (producto as any).unidad === "number" ? (producto as any).unidad : null),
        idMarca:
          (Array.isArray((producto as any).Marca) && (producto as any).Marca[0]?.idMarca) ??
          (typeof (producto as any).marca === "number" ? (producto as any).marca : null),
        imagenUrl: producto.imagenUrl ?? "",
        codigoBarras: producto.codigoBarras ?? "",
        status: newStatus,
      };

      await actualizarProducto(id, payload as any);
      setProductos((prev) => prev.map((p) => (p.id_producto === id ? { ...p, status: newStatus } : p)));
      await Swal.fire({ icon: 'success', title: newStatus ? 'Producto activado' : 'Producto desactivado', text: newStatus ? 'El producto se activó correctamente.' : 'El producto se desactivó correctamente.', timer: 1500, showConfirmButton: false });
      setVista('lista');
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cambiar el estado del producto.' });
    }
  };

  return (
    <MainLayout>
      <div>
        <Breadcrumb
          items={[
            { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
            { label: "Catálogos", onClick: () => navigate("/catalogos") },
            { label: "Productos" }
          ]}
          onBack={() => navigate(-1)}
        />
        <Tabs
          activeTab={vista}
          onChange={setVista}

          tabs={[
            {
              key: "lista",
              label: "Lista",
              icon: <IoMdList />,
              content: (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-4 items-center">
                      <SearchInput
                        value={busqueda}
                        onChange={handleBuscar}
                        placeholder="Buscar producto..."
                        className="w-80"
                      />
                      <StatusFilter
                        status={filtroEstado}
                        onChange={handleFiltrarEstado}
                      />
                    </div>
                    <div className="flex gap-2">
                      <PdfButton onClick={() => { }} />
                      <ExcelButton onClick={() => { }} />
                      <button
                        className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center"
                        type="button"
                        onClick={() => {
                          setVista("detalle");
                          nuevoDesdeDetalle();
                        }}
                      >
                        <IoMdAddCircle size={20} />
                        <span></span>
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center text-gray-500 mt-4">
                      Cargando...
                    </div>
                  ) : rowDataFiltrada.length > 0 ? (
                    <div>
                      <ProductosTable
                        productos={rowDataFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                        onRowClick={handleRowClick}
                        onDelete={handleDelete}
                        categorias={categoriasList}
                        marcas={marcasList}
                        unidades={unidadesList}
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
              ),
            },
            {
              key: "detalle",
              label: "Detalle",
              icon: <MdDescription />,
              content: (
                <ProductosDetalle
                  productoSeleccionado={productoSeleccionado}
                  nombre={nombre}
                  setNombre={setNombre}
                  descripcion={descripcion}
                  setDescripcion={setDescripcion}
                  categoria={categoria ?? 0}
                  setCategoria={setCategoria}
                  unidad={unidad ?? 0}
                  setUnidad={setUnidad}
                  marca={marca ?? 0}
                  setMarca={setMarca}
                  codigoBarras={codigoBarras}
                  setCodigoBarras={setCodigoBarras}
                  imagenUrl={imagenUrl}
                  manejarCambio={manejarCambio}
                  status={status}
                  setStatus={setStatus}
                  manejarEnvio={manejarEnvio}
                  onDelete={handleDelete}
                  nuevoDesdeDetalle={nuevoDesdeDetalle}
                  setVista={setVista}
                  categoriasList={categoriasList}
                  marcasList={marcasList}
                  unidadesList={unidadesList}
                />
              ),
            },
          ]}
        />
      </div >
    </MainLayout >
  );
}

export default Productos;
