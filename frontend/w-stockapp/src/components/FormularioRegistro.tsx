import { useState } from "react";

export default function FormularioRegistro({ mostrarFormulario, setMostrarFormulario }) {
 /*  const [mostrarFormulario, setMostrarFormulario] = useState(false); */
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    usuario: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const siguientePaso = () => setPaso(paso + 1);
  const pasoAnterior = () => setPaso(paso - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí podrías hacer una petición POST al backend
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
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    placeholder="Apellido Paterno"
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Apellido Materno:
                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
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
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    Iniciar Sesión
                </button>
              </>
            )}

            {paso === 2 && (
              <>
                <label className="block text-sm font-medium text-gray-700">
                  Usuario:
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    placeholder="Usuario"
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
                    onClick={() => window.location.reload()}
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
