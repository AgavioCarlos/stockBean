import Planes from '../components/Planes';
import { useState } from 'react';
import Sidebar from "../components/Layouts/Sidebar";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

interface Planes {
  id_plan: number;
  nombre: string;
  descripcion: string;
  precioMensual: number; 
  precioAnual: number;
  caracteristicas: string;
}
function Home(){
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (

    <div>
      <Header/>
      <button className="text-3xl p-4" onClick={() => setIsSidebarOpen(true)}>☰</button>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="home-container">
            <Planes />
        </div>
        <Footer />
    </div>
  )
}

export default Home;