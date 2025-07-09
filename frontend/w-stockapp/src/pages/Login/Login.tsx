import { useEffect, useState } from "react"
import FormularioRegistro from "../../components/FormularioRegistro";

function Login(){
    const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);

    useEffect(()=> {
        if(mostrarFormularioRegistro){
            document.body.classList.add("modal-open")
        } else {
            document.body.classList.remove("modal-open")
        }
    }, [mostrarFormularioRegistro]);


return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Iniciar Sesión</h2>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          ¿No tienes una cuenta? <a onClick={() => setMostrarFormularioRegistro(true)} className="text-indigo-600 hover:underline">Regístrate</a>
        </p>

        <button onClick={() => setMostrarFormularioRegistro(true)}>
            Registrar
        </button>

      </div>

        <FormularioRegistro
        mostrarFormulario={mostrarFormularioRegistro}
        setMostrarFormulario={setMostrarFormularioRegistro}
        />
    </div>
);
}
export default Login;