import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { configurarEmpresa } from '../services/Empresas';
import { useAlerts } from '../hooks/useAlerts';
import {
    HiBuildingOffice2,
    HiIdentification,
    HiMapPin,
    HiPhone,
    HiEnvelope,
    HiArrowRightOnRectangle,
    HiSparkles,
    HiShieldCheck
} from 'react-icons/hi2';

function ConfiguracionEmpresa() {
    const navigate = useNavigate();
    const { success, error, confirm } = useAlerts();
    const [nombre, setNombre] = useState('');
    const [rfc, setRfc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const empresaData = {
            razonSocial: nombre,
            nombreComercial: nombre,
            rfc,
        };

        try {
            await configurarEmpresa(empresaData);
            success('Configuración Exitosa', 'Tu empresa ha sido registrada correctamente.');
            localStorage.removeItem('requiresEmpresaConfig');

            setTimeout(() => {
                window.location.reload();
            }, 1200);
        } catch (err) {
            console.error(err);
            error('Error de Configuración', 'No pudimos guardar los datos en este momento.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        const result = await confirm(
            '¿Interrumpir configuración?',
            'Deberás completar este paso la próxima vez que ingreses.',
            'Cerrar Sesión',
            'Continuar'
        );

        if (result) {
            localStorage.clear();
            navigate('/');
        }
    };

    // Helper for staggered animations
    const getDelayStyle = (index: number) => ({
        animationDelay: `${index * 100}ms`
    });

    return (
        <div className="fixed inset-0 min-h-screen bg-[#0a0a0c] selection:bg-emerald-500/30 overflow-y-auto overflow-x-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Architectural Background Elements */}
            <div className="fixed inset-0 -z-10 bg-grain opacity-[0.03] pointer-events-none" />
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Main Container with subtle offset perspective */}
            <div className={`w-full max-w-4xl transition-all duration-1000 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Panel: Context & Branding */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-0 h-full py-4">
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={getDelayStyle(1)}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-sm">
                                <HiSparkles className="text-emerald-500 w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Paso Obligatorio</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                                Define la identidad de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">tu negocio.</span>
                            </h1>

                            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm">
                                Para activar todas las funciones de StockApp, necesitamos los detalles legales y de contacto de tu empresa.
                            </p>
                        </div>

                        <div className="hidden lg:block space-y-6 pt-8 border-t border-white/5 animate-in fade-in" style={getDelayStyle(2)}>
                            <div className="flex items-start gap-4 group">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                    <HiShieldCheck className="text-emerald-500 w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">Seguridad Garantizada</h4>
                                    <p className="text-gray-500 text-xs mt-1">Tus datos están protegidos bajo estándares de encriptación bancaria.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium transition-colors group animate-in fade-in"
                            style={getDelayStyle(3)}
                        >
                            <HiArrowRightOnRectangle className="group-hover:-translate-x-1 transition-transform" />
                            Cerrar sesión y configurar después
                        </button>
                    </div>

                    {/* Right Panel: The Form */}
                    <div className="lg:col-span-7 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden animate-in fade-in scale-in-95 group-hover:shadow-emerald-500/5 transition-all duration-500">
                        {/* Internal Grain for depth */}
                        <div className="absolute inset-0 bg-grain opacity-[0.02] pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                            {/* Section 1: Legal */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" style={getDelayStyle(4)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-emerald-500/50" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Información Legal</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="nombre" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Razón Social</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                                                <HiBuildingOffice2 className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                id="nombre"
                                                autoComplete="organization"
                                                placeholder="Ej. Comercializadora Azteca…"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="rfc" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">RFC</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                                                <HiIdentification className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                id="rfc"
                                                placeholder="ABC123456XYZ…"
                                                maxLength={13}
                                                value={rfc}
                                                onChange={(e) => setRfc(e.target.value.toUpperCase())}
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono tracking-widest text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Location */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" style={getDelayStyle(5)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Ubicación</span>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="direccion" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Dirección Fiscal / Principal</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                                            <HiMapPin className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            id="direccion"
                                            autoComplete="street-address"
                                            placeholder="Calle, No., Colonia, C.P.…"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Contact */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" style={getDelayStyle(6)}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-px bg-white/20" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Contacto Directo</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="telefono" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Teléfono Corporativo</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                                                <HiPhone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="telefono"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                placeholder="Ej. +52 55 1234 5678…"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email de la Empresa</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                                                <HiEnvelope className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                spellCheck={false}
                                                autoComplete="email"
                                                placeholder="contacto@empresa.com…"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 animate-in fade-in slide-in-from-bottom-4" style={getDelayStyle(7)}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/20 disabled:cursor-not-allowed text-black font-bold text-base rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            <span className="font-bold tracking-tight">Procesando Identidad…</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-bold tracking-tight">Finalizar Configuración</span>
                                            <HiSparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-gray-600 text-center mt-4 font-semibold uppercase tracking-widest">
                                    Al continuar, aceptas la creación de tu perfil administrativo principal.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfiguracionEmpresa;
