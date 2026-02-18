import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layouts/MainLayout";
import { consultarSucursales, consultarSucursalesPorSolicitante, crearSucursal, actualizarSucursal, eliminarSucursal, Sucursal } from "../services/SucursalService";
import Swal from 'sweetalert2';
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
            const userDataString = localStorage.getItem('user_data');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                // Try id_usuario first, fallback to id (some implementations vary)
                const idUsuario = userData.id_usuario || userData.id;

                if (idUsuario) {
                    const data = await consultarSucursalesPorSolicitante(idUsuario);
                    setSucursales(data);
                } else {
                    console.warn("No user ID found in user_data");
                    // Fallback to fetch all or empty
                    const data = await consultarSucursales();
                    setSucursales(data);
                }
            } else {
                console.warn("No user_data found in localStorage");
                const data = await consultarSucursales();
                setSucursales(data);
            }
        } catch (error) {
            console.error("Error loading sucursales", error);
            // Fallback
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
                await actualizarSucursal(sucursalSeleccionada.idSucursal, payload); // Update
                await Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Sucursal actualizada correctamente', timer: 1500, showConfirmButton: false });
            } else {
                // Get User ID for creation
                const userDataString = localStorage.getItem('user_data');
                let idUsuario = 0;
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    idUsuario = userData.id_usuario || userData.id;
                }

                await crearSucursal(payload, idUsuario); // Create with user ID
                await Swal.fire({ icon: 'success', title: 'Creado', text: 'Sucursal creada correctamente', timer: 1500, showConfirmButton: false });
            }
            cargarDatos();
            setVista("lista");
            limpiarFormulario();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la sucursal' });
        }
    };

    const handleDelete = async (id: number, currentStatus?: boolean) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Cambiarás el estado de la sucursal",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                // If logic is just to toggle status, ideally backend handles or we send update. 
                // Assuming logic delete in service (eliminar calls delete endpoint which does logical delete)
                // However, onDelete prop in table passes usually just ID.
                // We will use eliminarSucursal which maps to DELETE endpoint (logical delete)
                await eliminarSucursal(id);
                await Swal.fire('Estado cambiado', 'La sucursal ha sido actualizada.', 'success');
                cargarDatos();
                if (vista === 'detalle') setVista('lista');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar la sucursal', 'error');
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
