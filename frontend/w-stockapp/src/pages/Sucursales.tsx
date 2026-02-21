import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layouts/MainLayout";
import { consultarSucursales, consultarSucursalesPorSolicitante, crearSucursal, actualizarSucursal, eliminarSucursal, Sucursal } from "../services/SucursalService";
import { useAlerts } from "../hooks/useAlerts";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import Tabs from "../components/Tabs";
import SucursalesTable from "../components/SucursalesTable";
import SucursalesDetalle from "../components/SucursalesDetalle";
import Breadcrumb from "../components/Breadcrumb";
import SearchInput from "../components/SearchInput";
import StatusFilter from "../components/StatusFilter";
import { PdfButton, ExcelButton } from "../components/Buttons";

function Sucursales() {
    const navigate = useNavigate();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const { success, error: showError, confirm } = useAlerts();

    // Form State
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);

    // View State
    const [vista, setVista] = useState("lista");
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);

    // Filters
    const [rowDataFiltrada, setRowDataFiltrada] = useState(sucursales);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        let datos = sucursales;
        if (busqueda.trim() !== "") {
            datos = datos.filter((item) =>
                item.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        datos = datos.filter((item) => item.status === filtroEstado);
        setRowDataFiltrada(datos);
    }, [busqueda, filtroEstado, sucursales]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await consultarSucursalesPorSolicitante();
            setSucursales(data);
        } catch (error) {
            console.error("Error loading sucursales", error);
            // Fallback to fetch all or empty
            const data = await consultarSucursales();
            setSucursales(data);
        }
        setLoading(false);
    };

    const handleRowClick = (event: any) => {
        const s = event.data;
        setSucursalSeleccionada(s);
        setNombre(s.nombre);
        setDireccion(s.direccion || "");
        setTelefono(s.telefono || "");
        setEmail(s.email || "");
        setStatus(s.status);
        setVista("detalle");
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { nombre, direccion, telefono, email, status };

        try {
            if (sucursalSeleccionada) {
                const id = sucursalSeleccionada.idSucursal ?? sucursalSeleccionada.id_sucursal;
                if (id === undefined) {
                    showError('Error', 'No se pudo identificar la sucursal para actualizar');
                    return;
                }
                await actualizarSucursal(id, payload);
                success('Actualizado', 'Sucursal actualizada correctamente');
            } else {
                await crearSucursal(payload);
                success('Creado', 'Sucursal creada correctamente');
            }
            cargarDatos();
            setVista("lista");
            limpiarFormulario();
        } catch (error) {
            showError('Error', 'No se pudo guardar la sucursal');
        }
    };

    const handleDelete = async (id: number, currentStatus?: boolean) => {
        const isConfirmed = await confirm(
            '¿Estás seguro?',
            "Cambiarás el estado de la sucursal",
            'Sí, cambiar',
            'Cancelar'
        );

        if (isConfirmed) {
            try {
                await eliminarSucursal(id);
                success('Estado cambiado', 'La sucursal ha sido actualizada.');
                cargarDatos();
                if (vista === 'detalle') setVista('lista');
            } catch (error) {
                showError('Error', 'No se pudo eliminar la sucursal');
            }
        }
    };

    const limpiarFormulario = () => {
        setSucursalSeleccionada(null);
        setNombre("");
        setDireccion("");
        setTelefono("");
        setEmail("");
        setStatus(true);
    };

    return (
        <MainLayout>
            <div className="p-4">
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                        { label: "Catálogos", onClick: () => navigate("/catalogos") },
                        { label: "Sucursales" }
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
                                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                                        <div className="flex gap-4 items-center flex-wrap">
                                            <SearchInput
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                placeholder="Buscar sucursal..."
                                                className="w-80"
                                            />
                                            <StatusFilter
                                                status={filtroEstado}
                                                onChange={setFiltroEstado}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <PdfButton onClick={() => { }} />
                                            <ExcelButton onClick={() => { }} />
                                            <button
                                                className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center shadow-sm"
                                                type="button"
                                                onClick={() => {
                                                    limpiarFormulario();
                                                    setVista("detalle");
                                                }}
                                            >
                                                <IoMdAddCircle size={20} className="mr-1" />
                                                <span>Agregar</span>
                                            </button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-10">Cargando...</div>
                                    ) : (
                                        <SucursalesTable
                                            sucursales={rowDataFiltrada}
                                            onRowClick={handleRowClick}
                                            onDelete={handleDelete}
                                        />
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: "detalle",
                            label: "Detalle",
                            icon: <MdDescription />,
                            content: (
                                <SucursalesDetalle
                                    sucursalSeleccionada={sucursalSeleccionada}
                                    nombre={nombre}
                                    setNombre={setNombre}
                                    direccion={direccion}
                                    setDireccion={setDireccion}
                                    telefono={telefono}
                                    setTelefono={setTelefono}
                                    email={email}
                                    setEmail={setEmail}
                                    status={status}
                                    setStatus={setStatus}
                                    manejarEnvio={manejarEnvio}
                                    onDelete={(id) => handleDelete(id)}
                                    limpiarFormulario={limpiarFormulario}
                                    setVista={setVista}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </MainLayout>
    );
}

export default Sucursales;
