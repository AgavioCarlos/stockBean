import { useState } from "react";
import Swal from 'sweetalert2';
import {useLOVs} from '../hooks/useLOVs';
import {Rol} from '../interfaces/roles.interface'

export default function FormularioRegistro({ mostrarFormulario, setMostrarFormulario }) {
  
  const { data, loading } = useLOVs(['roles']);
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    cuenta: "",
    password: "",
    rol: "",
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
    // Por ahora no hacemos la petición POST. Solo simulamos el envío y mostramos los datos seleccionados.
    console.log('Datos de registro (simulación):', formData);
    Swal.fire({
      icon: 'info',
      title: 'Simulación',
      html: `<pre style="text-align:left">${JSON.stringify(formData, null, 2)}</pre>`,
      confirmButtonText: 'Cerrar'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-xl font-bold mb-6 text-center">Formulario Registro</h1>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {paso === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre:
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Apellido Paterno:
                  <input
                    type="text"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    placeholder="Apellido Paterno"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Apellido Materno:
                  <input
                    type="text"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    placeholder="Apellido Materno"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={siguientePaso}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Siguiente
                </button>

                <button
                  type="button"
                  /* onClick={() => window.location.reload()} */
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Iniciar Sesión
                </button>
              </>
            )}

            {paso === 2 && (
              <>
                <label>Rol:</label>
                <select name="rol" value={formData.rol} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                  {loading ? (
                    <option value="">Cargando...</option>
                  ) : data.roles && data.roles.length > 0 ? (
                    data.roles.map((r: Rol) => (
                      <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                    ))
                  ) : (
                    <option value="">No hay roles disponibles</option>
                  )}
                </select>
                <label className="block text-sm font-medium text-gray-700">
                  Cuenta:
                  <input
                    type="text"
                    name="cuenta"
                    value={formData.cuenta}
                    onChange={handleChange}
                    placeholder="cuenta"
                    required
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Contraseña:
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    required
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={pasoAnterior}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Anterior
                </button>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Registrar
                </button>

                <button
                  type="button"
                  /* onClick={() => window.location.reload()} */
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
