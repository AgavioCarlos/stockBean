import Planes from '../components/Planes';
import { useState } from 'react';
import MainLayout from "../components/Layouts/MainLayout";
import Footer from "../components/Layouts/Footer";

interface Planes {
  id_plan: number;
  nombre: string;
  descripcion: string;
  precioMensual: number;
  precioAnual: number;
  caracteristicas: string;
}
function Home() {


  return (

    <MainLayout>
      <div className="home-container">
        <Planes />
      </div>
      <Footer />
    </MainLayout>
  )
}

export default Home;