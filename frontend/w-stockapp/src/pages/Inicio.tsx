import Planes from '../components/Planes';
import Footer from "../components/Layouts/Footer";

function Inicio() {
  const handleLogin = () => {
    window.location.href = "/login";
  };
  
  return (
    <div className="min-h-screen flex flex-col"> {/* Contenedor principal flex */}
      {/* Contenedor con margen inferior */}
      <div className='flex items-center justify-end mb-12 p-4'>
        <button
          onClick={handleLogin}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
          Iniciar Sesión
        </button>
      </div>

      {/* Contenido que se expande */}
      <div className="flex-grow">
        <div className="home-container">
          <Planes />
        </div>
      </div>

      {/* Footer al final */}
      <Footer />
    </div>
  );
}
export default Inicio;