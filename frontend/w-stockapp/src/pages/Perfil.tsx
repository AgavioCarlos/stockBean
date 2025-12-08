import { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import { FaUserCircle, FaEnvelope, FaIdCard, FaPhoneAlt, FaMapMarkerAlt, FaFileMedicalAlt, FaEdit } from "react-icons/fa";
import { consultarPersona } from "../services/Persona";
import { consultarProductos } from "../services/Productos";
import Breadcrumb from "../components/Breadcrumb";
import ProductosTable from "../components/ProductosTable";
import type { Productos } from "../interfaces/producto.interface";

interface Persona {
    id_persona: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    status: boolean;
    // New fields from login
    id_rol?: number;
    cuenta?: string;
    fecha_alta?: string;
}

function Perfil() {
    const [persona, setPersona] = useState<Persona | null>(null);
    const [productos, setProductos] = useState<Productos[]>([]);
    const [loadingPersona, setLoadingPersona] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // First try to get data from local storage (Login response)
                const storedData = localStorage.getItem("user_data");
                if (storedData) {
                    const userData = JSON.parse(storedData);
                    // Map LoginResponse to Persona interface expected by the component
                    setPersona({
                        id_persona: userData.id_persona || 0,
                        nombre: userData.nombre || "",
                        apellido_paterno: userData.apellido_paterno || "",
                        apellido_materno: userData.apellido_materno || "",
                        email: userData.email || "",
                        status: userData.status || false,
                        id_rol: userData.id_rol,
                        cuenta: userData.cuenta,
                        fecha_alta: userData.fecha_alta
                    });
                    setLoadingPersona(false);
                } else {
                    // Fallback to API if no local data
                    const dataPersona = await consultarPersona();
                    setPersona(dataPersona);
                    setLoadingPersona(false);
                }
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                setLoadingPersona(false);
            }

            try {
                // Cargar Productos para "Reportes"
                const dataProductos = await consultarProductos();
                setProductos(dataProductos);
            } catch (error) {
                console.error("Error al consultar productos:", error);
            } finally {
                setLoadingProductos(false);
            }
        };
        cargarDatos();
    }, []);

    // Placeholder image if user wants "photo" - simplified with icon for now as per previous impl, 
    // but styled like the requested image.

    return (
        <MainLayout>
            <div className="pb-10">
                <Breadcrumb
                    items={[
                        { label: "Lista de Pacientes", onClick: () => { } }, // Mock parent
                        { label: persona ? `${persona.nombre} ${persona.apellido_paterno}` : "Perfil" }
                    ]}
                    onBack={() => { }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-fit">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 overflow-hidden relative">
                            {/* Icon Avatar as requested */}
                            <FaUserCircle size={60} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            {persona ? `${persona.nombre} ${persona.apellido_paterno} ${persona.apellido_materno || ""}` : "Usuario"}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">{persona?.email || "Sin email"}</p>

                        <div className="flex justify-between w-full border-t border-gray-100 pt-4 mb-6">
                            <div className="text-center w-1/2 border-r border-gray-100">
                                <p className="text-lg font-bold text-gray-800">{persona?.id_rol === 1 ? "Admin" : "User"}</p>
                                <p className="text-xs text-gray-400">Rol ID: {persona?.id_rol}</p>
                            </div>
                            <div className="text-center w-1/2">
                                <p className="text-lg font-bold text-gray-800">{persona?.status ? "Activo" : "Inactivo"}</p>
                                <p className="text-xs text-gray-400">Estatus</p>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm">
                            Editar Perfil
                        </button>
                    </div>

                    {/* Middle Column: Personal Info */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaIdCard className="text-blue-500" /> Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Nombre Completo</p>
                                    <p className="text-sm text-gray-700 font-medium">{persona?.nombre} {persona?.apellido_paterno} {persona?.apellido_materno}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Correo Electrónico</p>
                                    <p className="text-sm text-gray-700 font-medium">{persona?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Cuenta de Usuario</p>
                                    <p className="text-sm text-gray-700 font-medium">{persona?.cuenta}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Rol del Sistema</p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {persona?.id_rol === 1 ? "Administrador" : `Rol ${persona?.id_rol}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Estado</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${persona?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {persona?.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Fecha Registro</p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {persona?.fecha_alta ? new Date(persona.fecha_alta).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: "Reportes" (Products Table) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    Reportes
                                </h3>
                                <button className="text-sm text-blue-600 font-medium hover:underline">+ Agregar Reporte</button>
                            </div>

                            {loadingProductos ? (
                                <div className="text-center py-4 text-gray-400">Cargando reportes...</div>
                            ) : (
                                <div className="overflow-hidden">
                                    {/* Using ProductosTable in 'read-only' style by not passing actions */}
                                    <ProductosTable productos={productos.slice(0, 5)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Perfil;