import { useEffect, useState } from "react"
import FormularioRegistro from "../../components/FormularioRegistro";
import { login } from "../../services/Login"
import { getPantallasUsuario, savePantallasToLocalStorage } from "../../services/Pantallas"; // Importar servicio de pantallas
import Swal from 'sweetalert2';


function Login() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [cuenta, setCuenta] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mostrarFormulario) {
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
        // Guardar informacion completa del usuario para el perfil
        localStorage.setItem("user_data", JSON.stringify(data));

        try {
          // **Cargar pantallas del usuario basadas en su rol**
          // El token JWT ya contiene el id_rol, el backend lo extrae automáticamente
          const pantallas = await getPantallasUsuario();
          console.log("✅ Pantallas cargadas:", pantallas);

          // Guardar pantallas en localStorage para construir el menú dinámicamente
          savePantallasToLocalStorage(pantallas);
        } catch (pantallasError) {
          console.error("⚠️ Error al cargar pantallas:", pantallasError);
          // No bloqueamos el login si falla la carga de pantallas
          // El usuario podrá navegar igualmente
        }

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: data.mensaje,
          confirmButtonText: "Aceptar",
        }).then(() => {
          //Valida si la respuesta del login viene con empresa
          if (data.empresa.length > 0) {
            // Usuario tiene empresa, acceso normal
            localStorage.removeItem("requiresEmpresaConfig");
            window.location.href = "/home";
          } else {
            // Usuario sin empresa - marcar para mostrar modal obligatorio
            localStorage.setItem("requiresEmpresaConfig", "true");
            window.location.href = "/home";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje || "Credenciales inválidas",
          confirmButtonText: "Intentar de nuevo",
        });
      }

    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo conectar con el servidor",
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
                onChange={(e) => setCuenta(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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