import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layouts/MainLayout';
import Breadcrumb from '../components/Breadcrumb';
import { FaHome } from "react-icons/fa";

function Usuarios() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="p-4">
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                        { label: "Administrador", onClick: () => navigate("/administrador") },
                        { label: "Usuarios" }
                    ]}
                    onBack={() => navigate(-1)}
                />
                <h1 className="text-2xl font-bold mb-4 mt-4">Gestión de Usuarios</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Módulo de Usuarios en construcción.</p>
                </div>
            </div>
        </MainLayout>
    );
}

export default Usuarios;
