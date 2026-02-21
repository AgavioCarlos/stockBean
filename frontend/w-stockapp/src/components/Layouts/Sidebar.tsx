// src/components/Sidebar.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import { FiBox, FiLayers, FiUsers, FiTag, FiTruck, FiX, FiChevronRight, FiChevronLeft, FiMapPin, FiClipboard } from "react-icons/fi";
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
  const base = "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group";
  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `${base} ${isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold scale-[1.02]"
            : "text-gray-400 hover:text-white hover:bg-white/5"} ${className || ""}`
        }
      >
        {icon && <span className="text-xl transition-transform group-hover:scale-110 duration-300">{icon}</span>}
        <span className="truncate text-sm tracking-wide font-medium">{label}</span>
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
        fixed top-0 left-0 h-full bg-[#0F172A] text-white z-50
        transform transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "w-20" : "w-72"}
      `}
      style={{ minWidth: collapsed ? 80 : 288 }}
    >
      <div className="flex flex-col h-full relative">

        {/* Header Section */}
        <div className="flex flex-col w-full relative">
          <NavLink
            to="/home"
            className={`flex items-center gap-4 p-6 hover:bg-white/5 transition-all group ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
              <img src="/stock_icono.ico" alt="Logo" className="w-6 h-6 invert" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter uppercase leading-none">StockApp</span>
                <span className="text-[10px] text-indigo-400 font-bold tracking-widest mt-1">PRO EDITION</span>
              </div>
            )}
          </NavLink>

          {/* Toggle Button */}
          <div className="absolute -right-3 top-20 z-50 hidden md:block">
            <button
              onClick={() => {
                const next = !collapsed;
                if (onCollapsedChange) onCollapsedChange(next);
                else setInternalCollapsed(next);
              }}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1E293B] text-gray-400 border border-white/10 hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-90"
              title={collapsed ? "Expandir" : "Contraer"}
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors active:scale-95 sm:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-auto p-4 mt-2 custom-scrollbar">
          {!collapsed && (
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Módulos</p>
          )}
          <ul className="space-y-1.5">
            <NavItem to="/dashboard" label={collapsed ? "" : "Dashboard"} icon={<FiLayers />} />
            <NavItem to="/catalogos" label={collapsed ? "" : "Catálogos"} icon={<BsMenuButton />} />
            <NavItem to="/productos" label={collapsed ? "" : "Productos"} icon={<FiBox />} />
            <NavItem to="/inventario" label={collapsed ? "" : "Inventario"} icon={<FiClipboard />} />
            <NavItem to="/persona" label={collapsed ? "" : "Personas"} icon={<FiUsers />} />
            <NavItem to="/proveedores" label={collapsed ? "" : "Proveedores"} icon={<FiTruck />} />
            <NavItem to="/marcas" label={collapsed ? "" : "Marcas"} icon={<FiTag />} />
            <NavItem to="/sucursales" label={collapsed ? "" : "Sucursales"} icon={<FiMapPin />} />
            <NavItem to="/punto-venta" label={collapsed ? "" : "Punto de Venta"} icon={<MdOutlinePointOfSale />} />
            <NavItem to="/administrador" label={collapsed ? "" : "Administrador"} icon={<RiAdminLine />} />
          </ul>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/5">
          <ul className="space-y-1.5">
            <NavItem
              to="/configuracion"
              label={collapsed ? "" : "Configuración"}
              icon={<IoIosSettings />}
              className="bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white"
            />
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
