import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layouts/MainLayout';
import Breadcrumb from '../components/Breadcrumb';
import { BiCategory } from "react-icons/bi";
import { MdBrandingWatermark, MdStraighten, MdLocalShipping } from "react-icons/md"; // Unidades (Straighten), Proveedores (LocalShipping), Marcas (Branding)
import { FaTags, FaBoxOpen } from "react-icons/fa";

interface CatalogCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path: string;
    stats?: string;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ title, description, icon, color, path, stats }) => {
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
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestión</span>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {/* Mock avatars mimicking "Team Members" in design */}
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

function Catalogos() {
    return (
        <MainLayout>
            {/* No extra padding container as per previous "Red Line" optimization, 
                 but we need some margin/padding for the grid not to touch edges directly if MainLayout has reduced padding. 
                 MainLayout has p-4 md:px-4. So it's safe. */}
            <div>
                <Breadcrumb
                    items={[
                        { label: "Proyectos", onClick: () => { } },
                        { label: "Catálogos" }
                    ]}
                    onBack={() => { }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                    <CatalogCard
                        title="Categorías"
                        description="Administra las clasificaciones de productos."
                        icon={<BiCategory size={24} />}
                        color="bg-pink-500" // Pinkish/Red like Image 1
                        path="/categorias"
                        stats="12 Items"
                    />

                    <CatalogCard
                        title="Marcas"
                        description="Gestiona las marcas y fabricantes."
                        icon={<MdBrandingWatermark size={24} />}
                        color="bg-teal-400" // Teal/Green like Image 2
                        path="/marcas"
                        stats="8 Marcas"
                    />

                    <CatalogCard
                        title="Unidades"
                        description="Define unidades de medida (kg, lt, pza)."
                        icon={<MdStraighten size={24} />}
                        color="bg-blue-500" // Blue like Image 3
                        path="/unidades"
                        stats="Standard"
                    />

                    <CatalogCard
                        title="Proveedores"
                        description="Directorio de proveedores y contactos."
                        icon={<MdLocalShipping size={24} />}
                        color="bg-orange-400" // Orange like Image 4
                        path="/proveedores"
                        stats="Active"
                    />
                </div>
            </div>
        </MainLayout>
    );
}

export default Catalogos;
