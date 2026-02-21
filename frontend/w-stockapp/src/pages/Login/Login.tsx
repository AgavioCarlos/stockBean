import { useEffect, useState } from "react";
import FormularioRegistro from "../../components/FormularioRegistro";
import { login } from "../../services/Login";
import { getPantallasUsuario, savePantallasToLocalStorage } from "../../services/Pantallas";
import { useAlerts } from "../../hooks/useAlerts";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

function Login() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cuenta, setCuenta] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError, showAlert } = useAlerts();

  useEffect(() => {
    if (mostrarFormulario) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [mostrarFormulario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await login({ cuenta, password });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user_data", JSON.stringify(data));

        try {
          const pantallas = await getPantallasUsuario();
          savePantallasToLocalStorage(pantallas);
        } catch (pantallasError) {
          console.error("⚠️ Error al cargar pantallas:", pantallasError);
        }

        await showAlert(
          "¡Bienvenido de nuevo!",
          `Hola, ${data.nombre || 'Usuario'}. Accediendo al sistema…`,
          'success'
        );

        if (data.empresa && data.empresa.length > 0) {
          localStorage.removeItem("requiresEmpresaConfig");
        } else {
          localStorage.setItem("requiresEmpresaConfig", "true");
        }
        window.location.href = "/home";
      }
    } catch (err: any) {
      showError("Error de Acceso", err.message || "Credenciales inválidas o error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-100">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {mostrarFormulario ? (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <FormularioRegistro
            setMostrarFormulario={setMostrarFormulario}
          />
        </div>
      ) : (
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 transform transition-transform duration-500 hover:rotate-12">
              <img src="/stock_icono.ico" alt="StockApp Icon" className="w-10 h-10 invert" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">StockApp</h1>
              <p className="text-gray-500 font-medium text-sm mt-1">Gestión Inteligente de Inventarios</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

            <div className="relative">
              <h2 className="text-xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-wider text-xs">Acceso al Sistema</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2 group">
                  <label htmlFor="cuenta" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                    Usuario / Cuenta
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaUser size={16} />
                    </div>
                    <input
                      type="text"
                      id="cuenta"
                      name="username"
                      autoComplete="username"
                      placeholder="Ingresa tu cuenta"
                      value={cuenta}
                      onChange={(e) => setCuenta(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100/50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all duration-300 font-medium text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-end px-1">
                    <label htmlFor="password" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                      Contraseña
                    </label>
                    <button type="button" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">¿Olvidaste tu clave?</button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaLock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border-2 border-gray-100/50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all duration-300 font-medium text-gray-700"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-xl ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-1 active:scale-[0.98]'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-pulse">Autenticando…</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar Ahora</span>
                      <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-500 font-medium">
                  ¿Aún no tienes acceso?
                </p>
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="px-8 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all duration-300 transform active:scale-95"
                >
                  Crear una nueva cuenta
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <p className="text-center mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            © 2024 StockApp Professional Edition
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
