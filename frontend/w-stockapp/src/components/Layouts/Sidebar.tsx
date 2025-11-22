import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="p-4">
        <button className="text-white text-2xl mb-6" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-6">Menú</h2>
        <ul className="space-y-4">
<li>
  <button
    onClick={() => setIsCategoriasOpen(!isCategoriasOpen)}
    className="w-full text-left hover:underline flex justify-between items-center"
  >
    Catálogos
    <span>{isCategoriasOpen ? "▲" : "▼"}</span>
  </button>
  {isCategoriasOpen && (
    <ul className="ml-4 mt-2 space-y-2">
      <li>
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-green-500 font-bold" : ""}`
          }
        >
          Productos
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/categorias"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-blue-500 font-bold" : ""}`
          }
        >
          Categorías
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/roles"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-red-500 font-bold" : ""}`
          }
        >
          Roles
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/marcas"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-red-500 font-bold" : ""}`
          }
        >
          Marcas
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-red-500 font-bold" : ""}`
          }
        >
          Clientes
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/proveedores"
          className={({ isActive }) =>
            `block hover:underline ${isActive ? "text-green-500 font-bold" : ""}`

          }
          >
            Proveedores
        </NavLink>
      </li>
    </ul>
  )}
</li>

    <li>

      <li>
        <a href="/persona" className="hover:underline">
            Personas
        </a>
      </li> 

      <li>
        <a href="/roles" className="hover:underline">
            Roles
        </a>

      </li>

      <li>
        <a href="/punto-venta" className="hover:underline">
          Punto de Venta
        </a>
      </li>
      
    </li>
          
  </ul>
      </div>
      <div className="">
        {/* Contenido */}

        <NavLink
          to="/configuracion"
          className="fixed bottom-4 right-4 p-3 rounded-full"
        >
          <IoIosSettings className="w-8 h-8" />
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
