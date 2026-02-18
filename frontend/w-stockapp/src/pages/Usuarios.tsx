import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layouts/MainLayout';
import Breadcrumb from '../components/Breadcrumb';
import { FaHome } from "react-icons/fa";
import Tabs from '../components/Tabs';
import { consultarUsuarios, actualizarUsuario, crearUsuario } from '../services/Usuarios';
import { consultarRoles } from '../services/Roles';
import Swal from 'sweetalert2';
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import SearchInput from "../components/SearchInput";
import StatusFilter from "../components/StatusFilter";
import { PdfButton, ExcelButton } from "../components/Buttons";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { ColDef } from "ag-grid-community";

interface Persona {
    id_persona: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    status: boolean;
}

interface Usuario {
    id_usuario: number;
    persona: Persona;
    cuenta: string;
    id_rol: number;
    status: boolean;
    password?: string; // Optional for display, required for creation
}

function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<any[]>([]); // Adjust type if needed
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState("lista");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    // Form State
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [email, setEmail] = useState("");
    const [cuenta, setCuenta] = useState("");
    const [password, setPassword] = useState("");
    const [idRol, setIdRol] = useState<number | null>(null);
    const [status, setStatus] = useState(true);

    // Filtering & Pagination
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState(true);
    const [rowDataFiltrada, setRowDataFiltrada] = useState<Usuario[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const userDataString = localStorage.getItem('user_data');
        if (!userDataString) {
            Swal.fire('Error', 'No se encontró información del usuario.', 'error');
            return;
        }
        const userData = JSON.parse(userDataString);
        const idUsuario = userData.id_usuario || userData.id;

        Promise.all([consultarUsuarios(idUsuario), consultarRoles()])
            .then(([usersData, rolesData]) => {
                setUsuarios(usersData);
                setRoles(rolesData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading data:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let datos = usuarios;
        if (busqueda.trim() !== "") {
            datos = datos.filter(u =>
                (u.persona.nombre + " " + u.persona.apellido_paterno + " " + u.persona.apellido_materno).toLowerCase().includes(busqueda.toLowerCase()) ||
                u.cuenta.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        datos = datos.filter(u => u.status === filtroEstado);
        setRowDataFiltrada(datos);
        setCurrentPage(1);
    }, [usuarios, busqueda, filtroEstado]);

    const handleRowClick = (event: any) => {
        const u = event.data as Usuario;
        setUsuarioSeleccionado(u);
        setVista("detalle");

        // Populate form
        setNombre(u.persona.nombre);
        setApellidoPaterno(u.persona.apellido_paterno);
        setApellidoMaterno(u.persona.apellido_materno);
        setEmail(u.persona.email);
        setCuenta(u.cuenta);
        setPassword(""); // Don't show password
        setIdRol(u.id_rol);
        setStatus(u.status);
    };

    const nuevoDesdeDetalle = () => {
        setUsuarioSeleccionado(null);
        setNombre("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setEmail("");
        setCuenta("");
        setPassword("");
        setIdRol(null);
        setStatus(true);
        setVista("detalle");
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            persona: {
                nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                email,
                status: true // Persona status usually matches user status or is always active? Assume active for now
            },
            cuenta,
            password: password, // Only send if changed or new? Backend logic needed.
            id_rol: idRol,
            status
        };

        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString || '{}');
            const idUsuario = userData.id_usuario || userData.id;

            if (usuarioSeleccionado) {
                // Update
                // Note: Updating password might require specific handling if empty
                await actualizarUsuario(usuarioSeleccionado.id_usuario, payload);
                Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success');
                // Refresh list
                const updatedUsers = await consultarUsuarios(idUsuario);
                setUsuarios(updatedUsers);
                setVista("lista");
            } else {
                // Create
                await crearUsuario(payload, idUsuario);
                Swal.fire('Creado', 'Usuario creado correctamente', 'success');
                const updatedUsers = await consultarUsuarios(idUsuario);
                setUsuarios(updatedUsers);
                setVista("lista");
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
        }
    };

    // Table Columns
    const columnDefs: ColDef[] = [
        { field: "id_usuario", headerName: "ID", width: 70 },
        {
            headerName: "Nombre Completo",
            valueGetter: (params) => {
                const p = params.data?.persona;
                return p ? `${p.nombre} ${p.apellido_paterno} ${p.apellido_materno}` : "";
            },
            flex: 1.5
        },
        {
            headerName: "Email",
            valueGetter: (params) => params.data?.persona?.email,
            flex: 1.2
        },
        {
            headerName: "Rol",
            valueGetter: (params) => {
                const r = roles.find((rol: any) => rol.id_rol === params.data?.id_rol);
                return r ? r.nombre : params.data?.id_rol;
            },
            flex: 1
        },
        { field: "status", headerName: "Estado", cellRenderer: (params: any) => params.value ? "Activo" : "Inactivo", width: 100 }
    ];

    return (
        <MainLayout>
            <div className="p-4">
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/home") },
                        { label: "Administrador", onClick: () => navigate("/administrador") },
                        { label: "Usuarios" }
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
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-4 items-center">
                                            <SearchInput
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                placeholder="Buscar usuario..."
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
                                                className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                                                onClick={nuevoDesdeDetalle}
                                            >
                                                <IoMdAddCircle size={20} />
                                                Crear
                                            </button>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="text-center p-4">Cargando...</div>
                                    ) : (
                                        <>
                                            <Table
                                                rowData={rowDataFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                                                columnDefs={columnDefs}
                                                onRowClick={handleRowClick}
                                            />
                                            <Pagination
                                                totalItems={rowDataFiltrada.length}
                                                itemsPerPage={itemsPerPage}
                                                currentPage={currentPage}
                                                onPageChange={setCurrentPage}
                                            />
                                        </>
                                    )}
                                </div>
                            )
                        },
                        {
                            key: "detalle",
                            label: "Detalle",
                            icon: <MdDescription />,
                            content: (
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                                        {usuarioSeleccionado ? "Editar Usuario" : "Nuevo Usuario"}
                                    </h2>
                                    <form onSubmit={manejarEnvio} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Persona Info */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-700">Información Personal</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                                <input
                                                    type="text"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
                                                <input
                                                    type="text"
                                                    value={apellidoPaterno}
                                                    onChange={(e) => setApellidoPaterno(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                                                <input
                                                    type="text"
                                                    value={apellidoMaterno}
                                                    onChange={(e) => setApellidoMaterno(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Cuenta Info */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-700">Información de Cuenta</h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta (Usuario)</label>
                                                <input
                                                    type="text"
                                                    value={cuenta}
                                                    onChange={(e) => setCuenta(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={usuarioSeleccionado ? "Dejar en blanco para mantener actual" : ""}
                                                    required={!usuarioSeleccionado}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                                <select
                                                    value={idRol ?? ""}
                                                    onChange={(e) => setIdRol(Number(e.target.value))}
                                                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Seleccione un rol</option>
                                                    {roles.map((r: any) => (
                                                        <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 mt-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={status}
                                                        onChange={(e) => setStatus(e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Activo</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setVista("lista")}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </MainLayout>
    );
}

export default Usuarios;
