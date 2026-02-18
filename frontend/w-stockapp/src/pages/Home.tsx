import Planes from '../components/Planes';
import { useState, useEffect } from 'react';
import MainLayout from "../components/Layouts/MainLayout";
import Footer from "../components/Layouts/Footer";
import ConfiguracionEmpresa from '../components/ConfiguracionEmpresa';

interface Planes {
  id_plan: number;
  nombre: string;
  descripcion: string;
  precioMensual: number;
  precioAnual: number;
  caracteristicas: string;
}

function Home() {
  const [showConfiguracionEmpresa, setShowConfiguracionEmpresa] = useState(false);

  useEffect(() => {
    // Verificar si el usuario necesita configurar empresa
    const requiresConfig = localStorage.getItem('requiresEmpresaConfig');
    if (requiresConfig === 'true') {
      setShowConfiguracionEmpresa(true);
    }
  }, []);

  return (
    <>
      {/* Si necesita configurar empresa, SOLO muestra el modal */}
      {showConfiguracionEmpresa ? (
        <ConfiguracionEmpresa />
      ) : (
        /* Si NO necesita configurar empresa, muestra el contenido normal de Home */
        <MainLayout>
          <div className="home-container">
            <Planes />
          </div>
          <Footer />
        </MainLayout>
      )}
    </>
  );
}

export default Home;