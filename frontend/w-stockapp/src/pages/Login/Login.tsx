import { useEffect, useState } from "react"
import FormularioRegistro from "../../components/FormularioRegistro";
import { login } from "../../services/Login"
import Swal from 'sweetalert2';

function Login(){
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [cuenta, setCuenta] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        if(mostrarFormulario){
            document.body.classList.add("modal-open")
        } else {
            document.body.classList.remove("modal-open")
        }
    }, [mostrarFormulario]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null);

    try {
      const data = await login({ cuenta, password });
      console.log("✅ Usuario logueado:", data);

      if (data.success) {
      // localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", data.token) 
      localStorage.setItem("isAuthenticated", "true");
      
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: data.mensaje, 
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "/home"; 
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.mensaje || "Credenciales inválidas",
        confirmButtonText: "Intentar de nuevo",
      });
    }
      
    } catch (err) {
      Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo conectar con el servidor",
      confirmButtonText: "Cerrar",
    });
    }
  };

return (
  
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
        
      {mostrarFormulario ? (
      <FormularioRegistro
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={setMostrarFormulario}
      />
    ) : (

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Iniciar Sesión</h2>

        <form 
        onSubmit={handleSubmit}
        className="space-y-4">
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuenta
            </label>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <input
              type="cuenta"
              id="cuenta"
              placeholder="cuenta"
              value={cuenta}
              onChange={ (e) => setCuenta(e.target.value)}
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
              onChange={ (e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          ¿No tienes una cuenta? <a onClick={() => setMostrarFormulario(true)} className="text-blue-600 hover:underline">Regístrate</a>
        </p>

        {/* <button onClick={() => setMostrarFormularioRegistro(true)}>
            Registrar
        </button> */}

      </div>
    )}
    </div>
);
}
export default Login;