import { useState } from "react";
import Swal from 'sweetalert2';
import { useLOVs } from '../hooks/useLOVs';
import { Rol } from '../interfaces/roles.interface';
import { FaUser, FaEnvelope, FaShieldAlt, FaArrowRight, FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function FormularioRegistro({ setMostrarFormulario }: { setMostrarFormulario: (val: boolean) => void }) {
  const { data, loading: loadingRoles } = useLOVs(['roles']);
  const [paso, setPaso] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    cuenta: "",
    password: "",
    rolId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const siguientePaso = () => setPaso(paso + 1);
  const pasoAnterior = () => setPaso(paso - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        confirmButtonColor: '#4F46E5'
      }).then(() => {
        setMostrarFormulario(false);
      });
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-l-4 border-indigo-600 pl-4 uppercase tracking-wider text-xs">
            {paso === 1 ? "Datos Personales" : "Credenciales de Acceso"}
          </h2>
          <div className="flex gap-1.5">
            <div className={`w-8 h-1.5 rounded-full transition-all duration-500 ${paso === 1 ? 'bg-indigo-600 w-12' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-1.5 rounded-full transition-all duration-500 ${paso === 2 ? 'bg-indigo-600 w-12' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {paso === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup
                  label="Nombre"
                  icon={<FaUser />}
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                />
                <InputGroup
                  label="Email"
                  icon={<FaEnvelope />}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup
                  label="Apellido Paterno"
                  name="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  placeholder="Paterno"
                />
                <InputGroup
                  label="Apellido Materno"
                  name="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  placeholder="Materno"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={siguientePaso}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-100"
                >
                  Continuar <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
                  Rol de Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <FaShieldAlt size={16} />
                  </div>
                  <select
                    name="rolId"
                    value={formData.rolId}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-100/50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all duration-300 font-medium text-gray-700 appearance-none"
                    required
                  >
                    <option value="">Selecciona un rol</option>
                    {loadingRoles ? (
                      <option value="">Cargando…</option>
                    ) : data.roles?.map((r: Rol) => (
                      <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <InputGroup
                label="Nombre de Cuenta"
                icon={<FaUser />}
                name="cuenta"
                value={formData.cuenta}
                onChange={handleChange}
                placeholder="usuario123"
                required
              />

              <InputGroup
                label="Contraseña"
                icon={<FaLock />}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={pasoAnterior}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                  <FaArrowLeft size={12} /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-[2] py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FaCheckCircle /> Finalizar Registro
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <button
            onClick={() => setMostrarFormulario(false)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-4 bg-gray-50/50 border-2 border-gray-100/50 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all duration-300 font-medium text-gray-700`}
        />
      </div>
    </div>
  );
}
