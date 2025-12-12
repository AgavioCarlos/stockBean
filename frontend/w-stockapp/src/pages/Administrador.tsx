import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layouts/MainLayout';
import Breadcrumb from '../components/Breadcrumb';
import { FaUserShield, FaUsers, FaStoreAlt, FaHome, FaBuilding } from "react-icons/fa";

interface AdminCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path: string;
    stats?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, icon, color, path, stats }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative mt-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group"
        >
            {/* Floating Icon Header */}
            <div
                className={`absolute -top-6 left-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${color} transition-transform group-hover:scale-110`}
            >
                {icon}
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seguridad</span>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {/* Mock avatars */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">A</div>
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">B</div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-gray-800">{stats || "Active"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Administrador() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div>
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                        { label: "Administrador" }
                    ]}
                    onBack={() => navigate(-1)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    <AdminCard
                        title="Roles"
                        description="Gestión de roles y permisos del sistema."
                        icon={<FaUserShield size={24} />}
                        color="bg-purple-500"
                        path="/roles"
                        stats="Configuración"
                    />

                    <AdminCard
                        title="Usuarios"
                        description="Administración de cuentas de usuario."
                        icon={<FaUsers size={24} />}
                        color="bg-blue-500"
                        path="/usuarios"
                        stats="Gestión"
                    />

                    <AdminCard
                        title="Asignación a sucursales"
                        description="Asignación de usuarios a sucursales."
                        icon={<FaStoreAlt size={24} />}
                        color="bg-orange-500"
                        path="/usuarios-sucursales"
                        stats="Asignación"
                    />

                    <AdminCard
                        title="Sucursales"
                        description="Administración de las sucursales del negocio."
                        icon={<FaBuilding size={24} />}
                        color="bg-green-500"
                        path="/sucursales"
                        stats="Catálogo"
                    />
                </div>
            </div>
        </MainLayout>
    );
}

export default Administrador;