import React, { useState, useId, FC, ChangeEvent, FormEvent } from 'react';
import {
    HiXMark,
    HiUser,
    HiEnvelope,
    HiLockClosed,
    HiArrowRight,
    HiArrowLeft,
    HiRocketLaunch,
    HiCheckBadge
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { getPantallasUsuario, savePantallasToLocalStorage } from '../services/Pantallas';
import { useAlerts } from '../hooks/useAlerts';

interface Plan {
    id_plan: number;
    nombre: string;
    descripcion?: string;
}

interface RegistroModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan?: Plan | null;
}

const RegistroModal: FC<RegistroModalProps> = ({ isOpen, onClose, selectedPlan }) => {
    const navigate = useNavigate();
    const { success, error, showAlert } = useAlerts();
    const [paso, setPaso] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const idPrefix = useId();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        cuenta: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePaso1 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
        if (!formData.apellido_paterno.trim()) newErrors.apellido_paterno = 'Apellido paterno requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'Email requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePaso2 = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.cuenta.trim()) newErrors.cuenta = 'Usuario requerido';
        else if (formData.cuenta.length < 4) newErrors.cuenta = 'Mínimo 4 caracteres';
        if (!formData.password) newErrors.password = 'Contraseña requerida';
        else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSiguiente = () => {
        if (validatePaso1()) setPaso(2);
    };

    const handleAnterior = () => setPaso(1);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (paso === 1) {
            handleSiguiente();
            return;
        }
        if (!validatePaso2()) return;

        setIsProcessing(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/auth/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    apellido_paterno: formData.apellido_paterno,
                    apellido_materno: formData.apellido_materno,
                    email: formData.email,
                    cuenta: formData.cuenta,
                    password: formData.password,
                    id_rol: 2 // Por defecto rol de usuario administrador de sucursal/empresa
                })
            });

            if (response.ok) {
                // Éxito: Auto-login
                const loginResponse = await fetch(`${import.meta.env.VITE_API_URL || ""}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cuenta: formData.cuenta, password: formData.password })
                });

                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user_data', JSON.stringify(loginData));

                    try {
                        const pantallas = await getPantallasUsuario();
                        savePantallasToLocalStorage(pantallas);
                    } catch (err) {
                        console.warn('No se pudieron cargar pantallas:', err);
                    }

                    success('¡Bienvenido!', 'Tu cuenta ha sido creada y has iniciado sesión correctamente.');
                    navigate('/home');
                    onClose();
                } else {
                    showAlert('Cuenta creada', 'Por favor inicia sesión manualmente.', 'info');
                    navigate('/login');
                    onClose();
                }
            } else {
                const errorData = await response.json();
                error('Error en el Registro', errorData.mensaje || 'No se pudo completar el registro.');
            }
        } catch (err) {
            console.error('Error en registro:', err);
            error('Error de Conexión', 'No se pudo conectar con el servidor.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${idPrefix}-title`}
        >
            <div className="relative w-full max-w-lg overflow-hidden bg-white/95 border border-white/20 rounded-[2.5rem] shadow-2xl transition-all duration-500 flex flex-col max-h-[95vh]">

                {/* Header Decorativo */}
                <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white/50"
                        aria-label="Cerrar modal"
                    >
                        <HiXMark className="w-6 h-6" />
                    </button>

                    <div className="relative z-10">
                        <h2 id={`${idPrefix}-title`} className="text-3xl font-black tracking-tight text-wrap-balance mb-2">
                            Comienza hoy mismo
                        </h2>
                        <p className="text-blue-100/90 text-lg flex items-center gap-2 font-medium">
                            <HiCheckBadge className="text-blue-300" />
                            {selectedPlan ? `Plan ${selectedPlan.nombre}` : 'Crea tu cuenta gratuita'}
                        </p>
                    </div>
                </div>

                {/* Barra de Progreso */}
                <div className="px-8 pt-6">
                    <div className="flex items-center gap-4">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className={`h-full bg-blue-600 transition-all duration-700 ease-in-out ${paso === 1 ? 'w-1/2' : 'w-full'}`}
                            />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Paso {paso} de 2
                        </span>
                    </div>
                </div>

                {/* Cuerpo del Formulario */}
                <div className="p-8 pt-6 overflow-y-auto overflow-x-hidden">
                    <form onSubmit={handleSubmit} className="space-y-1">

                        {/* Paso 1: Datos Personales */}
                        <div className={`transition-all duration-500 transform ${paso === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute pointer-events-none'}`}>
                            <div className="space-y-4">
                                <p className="text-slate-500 font-medium mb-1 leading-relaxed">Ingresa tus datos para identificarte en la plataforma.</p>

                                <div className="space-y-2">
                                    <label htmlFor={`${idPrefix}-nombre`} className="text-sm font-bold text-slate-700 ml-1">Nombre(s) *</label>
                                    <div className="relative group">
                                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                        <input
                                            id={`${idPrefix}-nombre`}
                                            name="nombre"
                                            type="text"
                                            placeholder="Ej. Juan"
                                            autoComplete="given-name"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.nombre ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                        />
                                    </div>
                                    {errors.nombre && <p className="text-red-500 text-xs font-bold ml-1">{errors.nombre}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor={`${idPrefix}-paterno`} className="text-sm font-bold text-slate-700 ml-1">Apellido Paterno *</label>
                                        <input
                                            id={`${idPrefix}-paterno`}
                                            name="apellido_paterno"
                                            type="text"
                                            placeholder="Pérez"
                                            autoComplete="family-name"
                                            value={formData.apellido_paterno}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.apellido_paterno ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                        />
                                        {errors.apellido_paterno && <p className="text-red-500 text-xs font-bold ml-1">{errors.apellido_paterno}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor={`${idPrefix}-materno`} className="text-sm font-bold text-slate-700 ml-1">Apellido Materno</label>
                                        <input
                                            id={`${idPrefix}-materno`}
                                            name="apellido_materno"
                                            type="text"
                                            placeholder="García"
                                            value={formData.apellido_materno}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl transition-all focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus-visible:outline-none font-semibold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor={`${idPrefix}-email`} className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico *</label>
                                    <div className="relative">
                                        <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                        <input
                                            id={`${idPrefix}-email`}
                                            name="email"
                                            type="email"
                                            spellCheck={false}
                                            autoComplete="email"
                                            placeholder="tu@correo.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email}</p>}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSiguiente}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-2xl shadow-slate-200"
                                    >
                                        Continuar
                                        <HiArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Paso 2: Credenciales */}
                        <div className={`transition-all duration-500 transform ${paso === 2 ? 'translate-x-0 opacity-100 relative' : 'translate-x-full opacity-0 absolute pointer-events-none'}`}>
                            <div className="space-y-4">
                                <p className="text-slate-500 font-medium mb-1 leading-relaxed">Configura tus credenciales para acceder a tu cuenta.</p>

                                <div className="space-y-2">
                                    <label htmlFor={`${idPrefix}-cuenta`} className="text-sm font-bold text-slate-700 ml-1">Nombre de Usuario *</label>
                                    <div className="relative">
                                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                        <input
                                            id={`${idPrefix}-cuenta`}
                                            name="cuenta"
                                            type="text"
                                            spellCheck={false}
                                            autoComplete="username"
                                            placeholder="Ej. juanperez123"
                                            value={formData.cuenta}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.cuenta ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                        />
                                    </div>
                                    {errors.cuenta && <p className="text-red-500 text-xs font-bold ml-1">{errors.cuenta}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor={`${idPrefix}-password`} className="text-sm font-bold text-slate-700 ml-1">Contraseña *</label>
                                        <div className="relative">
                                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                            <input
                                                id={`${idPrefix}-password`}
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.password ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor={`${idPrefix}-confirm`} className="text-sm font-bold text-slate-700 ml-1">Confirmar *</label>
                                        <input
                                            id={`${idPrefix}-confirm`}
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-4 bg-slate-50 border rounded-2xl transition-all focus:ring-4 focus-visible:outline-none ${errors.confirmPassword ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold text-slate-900'}`}
                                        />
                                    </div>
                                </div>
                                {(errors.password || errors.confirmPassword) && (
                                    <p className="text-red-500 text-xs font-bold ml-1">{errors.password || errors.confirmPassword}</p>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleAnterior}
                                        className="flex-none w-20 py-5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center shadow-md active:scale-95"
                                        aria-label="Volver al paso anterior"
                                    >
                                        <HiArrowLeft className="w-7 h-7" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 shadow-blue-200/50'}`}
                                    >
                                        {isProcessing ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <HiRocketLaunch className="w-6 h-6" />
                                                Finalizar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 text-center mt-auto">
                    <p className="text-sm text-slate-500 font-bold">
                        ¿Ya tienes una cuenta? {' '}
                        <button
                            onClick={() => { onClose(); navigate('/login'); }}
                            className="text-blue-600 font-black hover:text-blue-700 transition-colors inline-flex items-center gap-1 hover:underline"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistroModal;

