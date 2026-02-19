import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { configurarEmpresa } from '../services/Empresas';

// Modal obligatorio para configurar empresa con botón de cerrar sesión
function ConfiguracionEmpresa() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [rfc, setRfc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userDataString = localStorage.getItem('user_data');
        if (!userDataString) {
            Swal.fire('Error', 'No se encontró información del usuario. Por favor inicie sesión nuevamente.', 'error');
            return;
        }

        const userData = JSON.parse(userDataString);
        /* 
           Assuming 'id_usuario' based on conventions or previous context. 
           If 'id' is standard, I'll try both or verify if possible. 
           Let's assume 'id_usuario' is the key as seen in SQL/Entitites often mapped to JSON.
           Actually, let's use a safe check.
        */
        const userId = userData.id_usuario || userData.id;

        if (!userId) {
            Swal.fire('Error', 'No se pudo identificar al usuario.', 'error');
            return;
        }

        const empresaData = {
            razonSocial: nombre,
            nombreComercial: nombre,
            rfc,
            // direccion, telefono, email - not in backend model yet, but passing them won't hurt if ignored or if backend is updated later. 
            // For now, only mapped fields will be used by backend.
        };

        Swal.fire({
            title: 'Guardando...',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        configurarEmpresa(empresaData, Number(userId))
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Empresa configurada!',
                    text: 'Bienvenido',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.removeItem('requiresEmpresaConfig');
                    // Refresh or detailed redirection
                    window.location.reload();
                });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire('Error', 'Hubo un problema al guardar la empresa.', 'error');
            });
    };

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: 'Tu sesión actual se cerrará',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('requiresEmpresaConfig');
                localStorage.removeItem('user_data');
                navigate('/');
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl m-4">
                {/* Encabezado con botón de cerrar sesión */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Configuración de Empresa</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Para continuar, debes configurar tu empresa
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Primera fila: Nombre y RFC */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Empresa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa el nombre de tu empresa"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-1">
                                RFC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="rfc"
                                value={rfc}
                                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: ABC123456XYZ"
                                maxLength={13}
                                required
                            />
                        </div>
                    </div>

                    {/* Segunda fila: Dirección */}
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa la dirección"
                            required
                        />
                    </div>

                    {/* Tercera fila: Teléfono y Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="telefono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 5512345678"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="empresa@ejemplo.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition mt-6"
                    >
                        Guardar y Continuar
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        * Campos obligatorios
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ConfiguracionEmpresa;