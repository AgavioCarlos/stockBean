/**
 * RegistroModal - Modal moderno de registro de usuario
 * 
 * Características:
 * - Registro en 2 pasos: Datos personales y Usuario
 * - Diseño moderno con glassmorphism
 * - Validaciones en tiempo real
 * - Integración con backend existente
 * - Animaciones suaves
 * - Auto-login después del registro
 * 
 * Props:
 * - isOpen: Estado del modal
 * - onClose: Función para cerrar el modal
 * - selectedPlan: Plan seleccionado (opcional)
 */

import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getPantallasUsuario, savePantallasToLocalStorage } from '../services/Pantallas';

interface RegistroModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan?: any;
}

const RegistroModal: React.FC<RegistroModalProps> = ({ isOpen, onClose, selectedPlan }) => {
    const navigate = useNavigate();
    const [paso, setPaso] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        cuenta: '',
        password: '',
        confirmPassword: ''
    });

    // Validaciones
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    /**
     * Validar email
     */
    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    /**
     * Validar contraseña (mínimo 6 caracteres)
     */
    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    /**
     * Manejar cambios en inputs
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /**
     * Validar paso 1 (Datos personales)
     */
    const validatePaso1 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido_paterno.trim()) {
            newErrors.apellido_paterno = 'El apellido paterno es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Validar paso 2 (Credenciales)
     */
    const validatePaso2 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.cuenta.trim()) {
            newErrors.cuenta = 'El nombre de usuario es requerido';
        } else if (formData.cuenta.length < 4) {
            newErrors.cuenta = 'Mínimo 4 caracteres';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Mínimo 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Siguiente paso
     */
    const handleSiguiente = () => {
        if (validatePaso1()) {
            setPaso(2);
        }
    };

    /**
     * Paso anterior
     */
    const handleAnterior = () => {
        setPaso(1);
    };

    /**
     * Enviar formulario de registro
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePaso2()) return;

        setIsProcessing(true);

        try {
            const response = await fetch('http://10.225.16.248:8080/auth/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido_paterno: formData.apellido_paterno,
                    apellido_materno: formData.apellido_materno,
                    email: formData.email,
                    cuenta: formData.cuenta,
                    password: formData.password
                })
            });

            setIsProcessing(false);

            if (response.ok) {
                const data = await response.json();

                // Mostrar mensaje de éxito
                await Swal.fire({
                    icon: 'success',
                    title: '🎉 ¡Registro Exitoso!',
                    html: `
            <div class="text-left">
              <p class="mb-2">Tu cuenta ha sido creada correctamente.</p>
              <p class="text-sm text-gray-600">Iniciando sesión automáticamente...</p>
            </div>
          `,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Auto-login después del registro
                try {
                    const loginResponse = await fetch('http://10.225.16.248:8080/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cuenta: formData.cuenta,
                            password: formData.password
                        })
                    });

                    if (loginResponse.ok) {
                        const loginData = await loginResponse.json();

                        // Guardar token y datos
                        localStorage.setItem('token', loginData.token);
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('user_data', JSON.stringify(loginData));

                        // Cargar pantallas del usuario
                        try {
                            const pantallas = await getPantallasUsuario();
                            savePantallasToLocalStorage(pantallas);
                        } catch (error) {
                            console.warn('No se pudieron cargar pantallas:', error);
                        }

                        // Redirigir al home
                        navigate('/home');
                    } else {
                        // Si falla el auto-login, redirigir al login manual
                        Swal.fire({
                            icon: 'info',
                            title: 'Cuenta creada',
                            text: 'Por favor, inicia sesión con tus credenciales',
                            confirmButtonText: 'Ir al Login'
                        }).then(() => {
                            navigate('/login');
                        });
                    }
                } catch (loginError) {
                    console.error('Error en auto-login:', loginError);
                    navigate('/login');
                }

                onClose();
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el Registro',
                    text: errorData.mensaje || 'No se pudo completar el registro',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        } catch (error) {
            setIsProcessing(false);
            console.error('Error en registro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Intenta de nuevo.',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    return (
        // Fondo con blur glassmorphism
        <div className="fixed inset-0 bg-gradient-to-br from-green-500/30 via-blue-500/20 to-purple-500/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            {/* Modal */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/50">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90 hover:scale-110"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold mb-2">✨ Crear Cuenta</h2>
                    <p className="text-green-50">
                        {selectedPlan ? `Comienza tu prueba de ${selectedPlan.nombre}` : 'Únete a StockApp'}
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex items-center justify-center p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${paso >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            1
                        </div>
                        <div className={`w-16 h-1 transition-all ${paso >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${paso >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            2
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Paso 1: Datos Personales */}
                    {paso === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Datos Personales</h3>

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaUser className="inline mr-2" />
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Juan"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.nombre ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                            </div>

                            {/* Apellido Paterno */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido Paterno *
                                </label>
                                <input
                                    type="text"
                                    name="apellido_paterno"
                                    value={formData.apellido_paterno}
                                    onChange={handleChange}
                                    placeholder="Pérez"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.apellido_paterno ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.apellido_paterno && <p className="text-red-500 text-sm mt-1">{errors.apellido_paterno}</p>}
                            </div>

                            {/* Apellido Materno */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido Materno
                                </label>
                                <input
                                    type="text"
                                    name="apellido_materno"
                                    value={formData.apellido_materno}
                                    onChange={handleChange}
                                    placeholder="García"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Botón Siguiente */}
                            <button
                                type="button"
                                onClick={handleSiguiente}
                                className="w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <span>Siguiente</span>
                                <FaArrowRight />
                            </button>
                        </div>
                    )}

                    {/* Paso 2: Credenciales */}
                    {paso === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Credenciales de Acceso</h3>

                            {/* Cuenta/Usuario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaUser className="inline mr-2" />
                                    Nombre de Usuario *
                                </label>
                                <input
                                    type="text"
                                    name="cuenta"
                                    value={formData.cuenta}
                                    onChange={handleChange}
                                    placeholder="usuario123"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.cuenta ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.cuenta && <p className="text-red-500 text-sm mt-1">{errors.cuenta}</p>}
                                <p className="text-xs text-gray-500 mt-1">Mínimo 4 caracteres</p>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaLock className="inline mr-2" />
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaLock className="inline mr-2" />
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                                        }`}
                                    required
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleAnterior}
                                    className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaArrowLeft />
                                    <span>Atrás</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform flex items-center justify-center gap-2 ${isProcessing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Registrando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            <span>Crear Cuenta</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer del modal */}
                <div className="p-4 bg-gray-50 border-t rounded-b-2xl text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/login');
                            }}
                            className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                        >
                            Inicia Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistroModal;
