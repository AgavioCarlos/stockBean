import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layouts/MainLayout";
import {
  consultarProductos,
  crearProducto,
  actualizarProducto,
} from "../services/Productos";
import { consultarCategorias } from "../services/Categoria";
import { consultarMarcas } from "../services/Marcas";
import { consultarUnidades } from "../services/Unidad";
import Swal from "sweetalert2";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import type { Productos } from "../interfaces/producto.interface";
import Tabs from "../components/Tabs";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import Pagination from "../components/Pagination";

import Breadcrumb from "../components/Breadcrumb";
import SearchInput from "../components/SearchInput";
import StatusFilter from "../components/StatusFilter";
import { PdfButton, ExcelButton } from "../components/Buttons";

import { Categoria } from "../interfaces/categoria.interface";
import { Marca } from "../interfaces/marca.interface";

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
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Productos | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // ... (rest of state)
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);
  const [marcasList, setMarcasList] = useState<Marca[]>([]);
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
        const actualizado = await actualizarProducto(
          productoSeleccionado.id_producto,
          payload
        );
        // actualizar la lista local con la respuesta del servidor si viene completa
        setProductos((prev) =>
          prev.map((p) =>
            p.id_producto === productoSeleccionado.id_producto
              ? { ...p, ...actualizado }
              : p
          )
        );
        await Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto se actualizó correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
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
        await Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: "El producto se creó correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
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
      consultarUnidades(),
    ])
      .then(([productosData, categoriasData, marcasData, unidadesData]) => {
        setProductos(productosData);
        if (Array.isArray(categoriasData)) setCategoriasList(categoriasData);
        if (Array.isArray(marcasData)) setMarcasList(marcasData);
        if (Array.isArray(unidadesData)) setUnidadesList(unidadesData);
        setLoading(false);
      })
      .catch((error) => {
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

    datosFiltrados = datosFiltrados.filter(
      (item) => item.status === filtroEstado
    );

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
        await Swal.fire({
          icon: "error",
          title: "No encontrado",
          text: "Producto no encontrado",
        });
        return;
      }

      const payload = {
        nombre: producto.nombre ?? "",
        descripcion: producto.descripcion ?? "",
        idCategoria:
          (Array.isArray((producto as any).Categoria) &&
            (producto as any).Categoria[0]?.idCategoria) ??
          (typeof (producto as any).categoria === "number"
            ? (producto as any).categoria
            : null),
        idUnidad:
          (Array.isArray((producto as any).Unidad) &&
            (producto as any).Unidad[0]?.idUnidad) ??
          (typeof (producto as any).unidad === "number"
            ? (producto as any).unidad
            : null),
        idMarca:
          (Array.isArray((producto as any).Marca) &&
            (producto as any).Marca[0]?.idMarca) ??
          (typeof (producto as any).marca === "number"
            ? (producto as any).marca
            : null),
        imagenUrl: producto.imagenUrl ?? "",
        codigoBarras: producto.codigoBarras ?? "",
        status: newStatus,
      };

      await actualizarProducto(id, payload as any);
      setProductos((prev) =>
        prev.map((p) =>
          p.id_producto === id ? { ...p, status: newStatus } : p
        )
      );
      await Swal.fire({
        icon: "success",
        title: newStatus ? "Producto activado" : "Producto desactivado",
        text: newStatus
          ? "El producto se activó correctamente."
          : "El producto se desactivó correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      setVista("lista");
    } catch (error) {
      console.error("Error al cambiar estado del producto:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cambiar el estado del producto.",
      });
    }
  };

  // Column definitions for Ag-Grid (inlined from ProductosTable)
  const columnDefs: ColDef[] = [
    {
      field: "id_producto",
      headerName: "ID",
      editable: false,
      filter: false,
      flex: 0.5,
      minWidth: 70,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      editable: true,
      filter: false,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      editable: false,
      filter: false,
      flex: 1.2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: "Categoria",
      headerName: "Categoria",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        if (params.data.Categoria && params.data.Categoria.length > 0)
          return params.data.Categoria[0].nombre;
        const id =
          typeof params.data.categoria === "number"
            ? params.data.categoria
            : params.data.idCategoria;
        if (!id) return "";
        const cat = categoriasList.find(
          (c: any) => c.id_categoria === id || c.id === id
        );
        return cat ? cat.nombre : "";
      },
    },
    {
      field: "Marca",
      headerName: "Marca",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        if (params.data.Marca && params.data.Marca.length > 0)
          return params.data.Marca[0].nombre;
        const id =
          typeof params.data.marca === "number"
            ? params.data.marca
            : params.data.idMarca;
        if (!id) return "";
        const marcaItem = marcasList.find(
          (m: any) => m.id_marca === id || m.id === id
        );
        return marcaItem ? marcaItem.nombre : "";
      },
    },
    {
      field: "Unidad",
      headerName: "Unidad",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        if (params.data.Unidad && params.data.Unidad.length > 0)
          return params.data.Unidad[0].nombre;
        const id =
          typeof params.data.unidad === "number"
            ? params.data.unidad
            : params.data.idUnidad;
        if (!id) return "";
        const u = unidadesList.find(
          (item: any) => item.id_unidad === id || item.id === id
        );
        return u ? u.nombre : "";
      },
    },
  ];

  return (
    <MainLayout>
      <div>
        <Breadcrumb
          items={[
            {
              label: "",
              icon: <FaHome />,
              onClick: () => navigate("/dashboard"),
            },
            { label: "Catálogos", onClick: () => navigate("/catalogos") },
            { label: "Productos" },
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
                      <PdfButton onClick={() => {}} />
                      <ExcelButton onClick={() => {}} />
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
                      {/* Inline table using AgGridReact - preserve previous Table styling */}
                      <div
                        className={`ag-theme-material`}
                        style={{ width: "100%" }}
                      >
                        <AgGridReact
                          theme="legacy"
                          rowData={rowDataFiltrada.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          )}
                          onRowClicked={handleRowClick}
                          rowSelection="single"
                          domLayout="autoHeight"
                          autoSizeStrategy={{
                            type: "fitGridWidth",
                            defaultMinWidth: 50,
                          }}
                          columnDefs={columnDefs}
                          defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                            editable: true,
                            floatingFilter: false,
                          }}
                          overlayNoRowsTemplate={
                            '<div class="p-4 text-gray-500">No hay datos para mostrar</div>'
                          }
                        />
                      </div>
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
                <div className="w-full h-full flex flex-col">
                  <form
                    onSubmit={manejarEnvio}
                    className="w-full h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {productoSeleccionado
                            ? "Detalle del Producto"
                            : "Nuevo Producto"}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                        >
                          Guardar
                        </button>
                        {productoSeleccionado && (
                          <button
                            type="button"
                            onClick={() => nuevoDesdeDetalle()}
                            className="px-4 py-1.5 text-blue-600 text-sm font-medium rounded-md border border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Nuevo
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-6 overflow-hidden">
                      <div className="flex gap-8 h-full">
                        <div className="w-1/3 flex flex-col gap-4">
                          <div
                            className={`flex-[2] border-2 border-dashed rounded-xl bg-gray-50 transition-all group relative flex flex-col items-center justify-center overflow-hidden h-64 ${
                              productoSeleccionado
                                ? "border-gray-300"
                                : "border-gray-200"
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={manejarCambio}
                              className={`absolute inset-0 w-full h-full opacity-0 z-10 ${
                                productoSeleccionado
                                  ? "cursor-pointer"
                                  : "cursor-default"
                              }`}
                            />
                            {imagenUrl ? (
                              <img
                                src={imagenUrl}
                                alt="preview"
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">
                                  {productoSeleccionado
                                    ? "Subir Imagen Principal"
                                    : "Sin imagen"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="w-2/3 flex flex-col gap-5">
                          <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-3">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Nombre
                              </label>
                              <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full border rounded-lg px-4 py-2.5"
                                required
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Código de Barras
                              </label>
                              <input
                                value={codigoBarras}
                                onChange={(e) =>
                                  setCodigoBarras(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-2.5 font-mono text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={descripcion}
                              onChange={(e) => setDescripcion(e.target.value)}
                              className="w-full flex-1 border rounded-lg px-4 py-3 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Categoría
                              </label>
                              <select
                                value={categoria ?? 0}
                                onChange={(e) =>
                                  setCategoria(Number(e.target.value))
                                }
                                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                              >
                                <option value={0}>Seleccionar...</option>
                                {categoriasList.map((c: any) => (
                                  <option
                                    key={c.idCategoria ?? c.id}
                                    value={c.idCategoria ?? c.id}
                                  >
                                    {c.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Marca
                              </label>
                              <select
                                value={marca ?? 0}
                                onChange={(e) =>
                                  setMarca(Number(e.target.value))
                                }
                                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                              >
                                <option value={0}>Seleccionar...</option>
                                {marcasList.map((m: any) => (
                                  <option
                                    key={m.idMarca ?? m.id}
                                    value={m.idMarca ?? m.id}
                                  >
                                    {m.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Unidad
                              </label>
                              <select
                                value={unidad ?? 0}
                                onChange={(e) =>
                                  setUnidad(Number(e.target.value))
                                }
                                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                              >
                                <option value={0}>Seleccionar...</option>
                                {unidadesList.map((u: any) => (
                                  <option
                                    key={u.idUnidad ?? u.id}
                                    value={u.idUnidad ?? u.id}
                                  >
                                    {u.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-2 text-center text-xs text-gray-400">
                            {productoSeleccionado
                              ? "Edita los campos y guarda los cambios."
                              : "Crear nuevo producto."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ),
            },
          ]}
        />
      </div>
    </MainLayout>
  );
}

export default Productos;
