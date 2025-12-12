import { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/Tabs";
import { IoMdList, IoMdPricetag } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import HistorialPreciosTable from "../components/HistorialPreciosTable";
import { HistorialPrecios } from "../interfaces/historialPrecios.interface";
import { listarActuales, listarHistoricosId, guardar } from "../services/HistorialPrecios";
import SearchInput from "../components/SearchInput";
import Swal from "sweetalert2";

export default function HistorialPreciosPage() {
    const navigate = useNavigate();
    const [vista, setVista] = useState("lista");
    const [loading, setLoading] = useState(true);
    const [historialActual, setHistorialActual] = useState<HistorialPrecios[]>([]);
    const [historialFiltrado, setHistorialFiltrado] = useState<HistorialPrecios[]>([]);
    const [busqueda, setBusqueda] = useState("");

    // Detalle states
    const [seleccionado, setSeleccionado] = useState<HistorialPrecios | null>(null);
    const [historialProducto, setHistorialProducto] = useState<HistorialPrecios[]>([]);
    const [nuevoPrecio, setNuevoPrecio] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === "") {
            setHistorialFiltrado(historialActual);
        } else {
            setHistorialFiltrado(historialActual.filter(h =>
                h.producto?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
            ));
        }
    }, [busqueda, historialActual]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await listarActuales();
            setHistorialActual(data);
            setHistorialFiltrado(data);
        } catch (error) {
            console.error("Error cargando historial", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = async (event: any) => {
        const item: HistorialPrecios = event.data;
        setSeleccionado(item);
        setVista("detalle");
        setNuevoPrecio("");
        setMotivo("");

        // Cargar historico del producto
        if (item.producto?.id_producto) {
            try {
                const historico = await listarHistoricosId(item.producto.id_producto);
                setHistorialProducto(historico);
            } catch (error) {
                console.error("Error loading history for product", error);
            }
        }
    };

    const handleGuardarPrecio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!seleccionado || !nuevoPrecio || !motivo) {
            return Swal.fire("Error", "Complete todos los campos", "warning");
        }

        try {
            const nuevoRegistro: Partial<HistorialPrecios> = {
                producto: seleccionado.producto,
                precioAnterior: seleccionado.precioNuevo,
                precioNuevo: Number(nuevoPrecio),
                motivo: motivo,
                idTipoPrecio: 1, // Asumiendo 1 por defecto o manejar lógica
                // usuario se maneja en backend normalmente o se obtiene de contexto
            };

            await guardar(nuevoRegistro);
            await Swal.fire("Éxito", "Precio actualizado correctamente", "success");

            // Recargar datos y volver a lista o actualizar detalle
            await cargarDatos();

            // Actualizar historial localmente para ver reflejado en el momento
            const historico = await listarHistoricosId(seleccionado.producto.id_producto!);
            setHistorialProducto(historico);

            // Actualizar seleccionado con el nuevo precio actual
            const updatedCurrent = historico[0]; // Asumiendo que retorna ordenado, o filtrar por logic
            if (updatedCurrent) setSeleccionado({ ...seleccionado, precioNuevo: Number(nuevoPrecio) }); // Simple update visual

            setNuevoPrecio("");
            setMotivo("");

        } catch (error) {
            console.error("Error guardando precio", error);
            Swal.fire("Error", "No se pudo actualizar el precio", "error");
        }
    };

    return (
        <MainLayout>
            <Breadcrumb
                items={[
                    { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                    { label: "Catálogos", onClick: () => navigate("/catalogos") },
                    { label: "Historial Precios" }
                ]}
                onBack={() => navigate(-1)}
            />

            <Tabs
                activeTab={vista}
                onChange={setVista}
                tabs={[
                    {
                        key: "lista",
                        label: "Precios Actuales",
                        icon: <IoMdList />,
                        content: (
                            <div>
                                <div className="mb-4">
                                    <SearchInput
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        placeholder="Buscar por producto..."
                                        className="w-80"
                                    />
                                </div>
                                {loading ? (
                                    <div className="text-center p-4">Cargando...</div>
                                ) : (
                                    <HistorialPreciosTable
                                        datos={historialFiltrado}
                                        onRowClick={handleRowClick}
                                    />
                                )}
                            </div>
                        )
                    },
                    {
                        key: "detalle",
                        label: "Detalle y Actualización",
                        icon: <MdDescription />,
                        content: (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Columna Izquierda: Detalle Actual y Formulario */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <IoMdPricetag className="text-blue-600" />
                                            Precio Actual
                                        </h3>
                                        {seleccionado ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm text-gray-500 block">Producto</label>
                                                    <span className="font-medium text-lg">{seleccionado.producto?.nombre}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm text-gray-500 block">Precio Actual</label>
                                                        <span className="font-bold text-xl text-green-600">
                                                            ${seleccionado.precioNuevo?.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-500 block">Último Cambio</label>
                                                        <span className="text-gray-700">
                                                            {seleccionado.fechaCambio ? new Date(seleccionado.fechaCambio).toLocaleDateString() : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-500 block">Motivo Último Cambio</label>
                                                    <p className="text-gray-700 italic">{seleccionado.motivo || "Sin motivo registrado"}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Seleccione un producto de la lista para ver detalles.</p>
                                        )}
                                    </div>

                                    {seleccionado && (
                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4">Actualizar Precio</h3>
                                            <form onSubmit={handleGuardarPrecio} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Precio</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={nuevoPrecio}
                                                        onChange={(e) => setNuevoPrecio(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del Cambio</label>
                                                    <textarea
                                                        value={motivo}
                                                        onChange={(e) => setMotivo(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        rows={3}
                                                        placeholder="Justificación del nuevo precio..."
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    Actualizar Precio
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>

                                {/* Columna Derecha: Historial */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
                                    <h3 className="text-lg font-semibold mb-4">Historial de Cambios</h3>
                                    {seleccionado ? (
                                        <div className="h-[500px]"> {/* Altura fija para scroll en tabla interna si es necesario */}
                                            <HistorialPreciosTable
                                                datos={historialProducto}
                                            // No click action on history items
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Seleccione un producto para ver su historial.</p>
                                    )}
                                </div>
                            </div>
                        )
                    }
                ]}
            />
        </MainLayout>
    );
}
