/* import React from 'react'; */
import Planes from '../components/Planes';
import { useState } from 'react';
/* import FormularioRegistro from "../components/FormularioRegistro"; */
import Sidebar from "../components/SideBar";

function Home(){
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (

    <div>
        <nav className='bg-gray-800 text-white p-4 flex justify-between items-center'>
            <ul className="flex space-x-4">
                <li><a href="/" className="text-blue-500 hover:underline">Home</a></li>
                <li><a href="/persona" className="text-blue-500 hover:underline">Persona</a></li>
            </ul>

            <button 
                 onClick={() => window.location.href = '/login'}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                Iniciar Sesión
            </button>
        </nav>

        {/* <Sidebar /> */}

        {/* Botón de menú hamburguesa */}
      <button
        className="text-3xl p-4"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            <Planes />
            <p>This is the main page of the application.</p>
        </div>
    </div>
        
    )
}

export default Home;