// src/components/Sidebar.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { FiBox, FiLayers, FiUsers, FiTag, FiTruck, FiX, FiChevronRight, FiChevronLeft, FiMapPin } from "react-icons/fi";
import { BsMenuButton } from "react-icons/bs";
import { MdOutlinePointOfSale } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import Logo from '../../assets/icon.png';


type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

const NavItem: React.FC<{
  to?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ to = "#", label, icon, onClick, className }) => {
  const base = "flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors";
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `${base} ${isActive ? "bg-red-500 text-white shadow-md font-semibold" : "text-gray-300"} ${className || ""}`
        }
      >
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="truncate text-lg">{label}</span>
      </NavLink>
    </li>
  );
};

const SubNavItem: React.FC<{
  to: string;
  label: string;
}> = ({ to, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block p-2 rounded transition-colors ${isActive ? "bg-red-500 text-white font-semibold" : "hover:bg-gray-700 text-gray-300"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed: collapsedProp, onCollapsedChange }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-gray-800 text-white z-50
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-20" : "w-72"}
      `}
      style={{ minWidth: collapsed ? 80 : 288 }}
    >
      <div className="flex flex-col h-full relative">

        {/* Header Section */}
        <div className="flex flex-col w-full relative">
          {/* Logo Section - Redirects to Home */}
          <NavLink
            to="/home"
            className={`flex items-center gap-3 p-5 hover:bg-gray-700 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <img src={Logo} alt="StockApp Logo" className="w-14 h-14 flex-shrink-0 object-contain" />
            {!collapsed && <span className="font-bold truncate text-xl">StockApp</span>}
          </NavLink>

          {/* Toggle Button - Positioned inside, subtle style */}
          <div className="absolute right-2 top-20 z-50 hidden md:block">
            <button
              onClick={() => {
                const next = !collapsed;
                if (onCollapsedChange) onCollapsedChange(next);
                else setInternalCollapsed(next);
              }}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-white transition-all cursor-pointer"
              title={collapsed ? "Expandir" : "Contraer"}
            >
              {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
            </button>
          </div>

          {/* Mobile Close Button - Only visible on small screens */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700 sm:hidden text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-auto p-3 mt-4">
          <ul className="space-y-2">
            <NavItem to="/dashboard" label={collapsed ? "" : "Dashboard"} icon={<FiLayers />} />
            <NavItem to="/catalogos" label={collapsed ? "" : "Catálogos"} icon={<BsMenuButton />} />
            <NavItem to="/productos" label={collapsed ? "" : "Productos"} icon={<FiBox />} />
            <NavItem to="/persona" label={collapsed ? "" : "Personas"} icon={<FiUsers />} />
            <NavItem to="/proveedores" label={collapsed ? "" : "Proveedores"} icon={<FiTruck />} />
            <NavItem to="/marcas" label={collapsed ? "" : "Marcas"} icon={<FiTag />} />
            <NavItem to="/sucursales" label={collapsed ? "" : "Sucursales"} icon={<FiMapPin />} />
            <NavItem to="/punto-venta" label={collapsed ? "" : "Punto de Venta"} icon={<MdOutlinePointOfSale />} />
            <NavItem to="/administrador" label={collapsed ? "" : "Administrador"} icon={<RiAdminLine />} />
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-3 border-t border-gray-700">
          <ul className="space-y-2">
            <NavItem to="/configuracion" label={collapsed ? "" : "Configuración"} icon={<IoIosSettings className="text-2xl" />} />
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
