import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layouts/MainLayout";
import Breadcrumb from "../components/Breadcrumb";
import Tabs from "../components/Tabs";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedoresDetalle from "../components/ProveedoresDetalle";
import { PdfButton, ExcelButton } from "../components/Buttons";
import { Proveedor, consultarProveedores, crearProveedor, actualizarProveedor, eliminarProveedor } from "../services/Proveedores";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import Swal from "sweetalert2";

function Proveedores() {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState("lista");
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

    // Form states
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);

    // Filter/Pagination states
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load data
    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = () => {
        setLoading(true);
        consultarProveedores()
            .then(data => {
                setProveedores(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // Filter logic
    const filteredData = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleRowClick = (event: any) => {
        const p = event.data;
        setProveedorSeleccionado(p);
        setNombre(p.nombre);
        setDireccion(p.direccion);
        setEmail(p.email);
        setStatus(p.status);
        setVista("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setProveedorSeleccionado(null);
        setNombre("");
        setDireccion("");
        setEmail("");
        setStatus(true);
        setVista("lista"); // Or stay in detail? Logic in Product is usually 'reset' but button in list calls this and sets view. 
        // Here specific function to go back or reset.
        if (vista === 'lista') setVista('detalle'); // if called from Add button
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            nombre,
            direccion,
            email,
            status
        };

        try {
            if (proveedorSeleccionado) {
                await actualizarProveedor(proveedorSeleccionado.idProveedor, payload);
                Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Proveedor actualizado correctamente', timer: 1500, showConfirmButton: false });
            } else {
                await crearProveedor(payload);
                Swal.fire({ icon: 'success', title: 'Creado', text: 'Proveedor creado correctamente', timer: 1500, showConfirmButton: false });
            }
            cargarProveedores();
            setVista("lista");
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el proveedor' });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await eliminarProveedor(id);
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Proveedor eliminado correctamente', timer: 1500, showConfirmButton: false });
            cargarProveedores();
            setVista("lista"); // Ensure list view
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el proveedor' });
        }
    };

    return (
        <MainLayout>
            <div>
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                        { label: "Catálogos", onClick: () => navigate("/catalogos") },
                        { label: "Proveedores" }
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
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                placeholder="Buscar proveedor..."
                                                className="w-80"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <PdfButton onClick={() => { }} />
                                            <ExcelButton onClick={() => { }} />
                                            <button
                                                className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center"
                                                type="button"
                                                onClick={() => {
                                                    setProveedorSeleccionado(null);
                                                    setNombre("");
                                                    setDireccion("");
                                                    setEmail("");
                                                    setStatus(true);
                                                    setVista("detalle");
                                                }}
                                            >
                                                <IoMdAddCircle size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center text-gray-500 mt-4">Cargando...</div>
                                    ) : filteredData.length > 0 ? (
                                        <div>
                                            <ProveedoresTable
                                                proveedores={paginatedData}
                                                onRowClick={handleRowClick}
                                            />
                                            <Pagination
                                                totalItems={filteredData.length}
                                                itemsPerPage={itemsPerPage}
                                                currentPage={currentPage}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 mt-4">No hay proveedores registrados.</div>
                                    )}
                                </div>
                            )
                        },
                        {
                            key: "detalle",
                            label: "Detalle",
                            icon: <MdDescription />,
                            content: (
                                <ProveedoresDetalle
                                    proveedorSeleccionado={proveedorSeleccionado}
                                    nombre={nombre}
                                    setNombre={setNombre}
                                    direccion={direccion}
                                    setDireccion={setDireccion}
                                    email={email}
                                    setEmail={setEmail}
                                    status={status}
                                    setStatus={setStatus}
                                    manejarEnvio={manejarEnvio}
                                    nuevoDesdeDetalle={() => setVista("lista")}
                                    onDelete={handleDelete}
                                />
                            )
                        }
                    ]}
                />
            </div>
        </MainLayout>
    );
}

export default Proveedores;
