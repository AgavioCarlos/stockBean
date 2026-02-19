/**
 * DynamicSidebar - Sidebar que se construye dinámicamente basado en los permisos del usuario
 * 
 * Este componente reemplaza el Sidebar estático cargando las pantallas permitidas
 * desde el localStorage (previamente obtenidas del backend al hacer login).
 * 
 * Características:
 * - Muestra solo las pantallas a las que el usuario tiene acceso
 * - Permite colapsar/expandir el menú
 * - Muestra íconos dinámicos basados en la configuración de BD
 * - Ordena las pantallas según el campo 'orden'
 * - Filtra solo pantallas que deben aparecer en el menú (esMenu: true)
 * - Soporta menús jerárquicos (padre-hijo) desplegables
 */

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiX, FiChevronRight, FiChevronLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Logo from "../../assets/icon.png";
import { Pantalla } from "../../interfaces/Pantalla";
import { getPantallasFromLocalStorage } from "../../services/Pantallas";
import { getIcon } from "../../utils/iconMapper";

type DynamicSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
};

/**
 * Componente para items del menú sin hijos (pantallas finales navegables)
 */
const NavItem: React.FC<{
    to: string;
    label: string;
    icon?: React.ComponentType;
    onClick?: () => void;
    className?: string;
    isChild?: boolean; // Indica si es un item hijo (para aplicar indentación)
}> = ({ to, label, icon: Icon, onClick, className, isChild = false }) => {
    const base = `flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${isChild ? 'pl-10' : ''}`;

    return (
        <li>
            <NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) =>
                    `${base} ${isActive ? "bg-red-500 text-white shadow-md font-semibold" : "text-gray-300"} ${className || ""}`
                }
            >
                {Icon && <span className="text-2xl"><Icon /></span>}
                <span className="truncate text-lg">{label}</span>
            </NavLink>
        </li>
    );
};

/**
 * Componente para items del menú padre (desplegables que contienen hijos)
 */
const ParentNavItem: React.FC<{
    label: string;
    icon?: React.ComponentType;
    children: Pantalla[];
    collapsed: boolean;
}> = ({ label, icon: Icon, children, collapsed }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <li>
            {/* Botón para expandir/contraer - No navega, solo despliega */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300"
            >
                <div className="flex items-center gap-3">
                    {Icon && <span className="text-2xl"><Icon /></span>}
                    {!collapsed && <span className="truncate text-lg font-semibold">{label}</span>}
                </div>
                {!collapsed && (
                    <span className="text-lg">
                        {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </span>
                )}
            </button>

            {/* Lista de items hijos - Se muestra solo cuando está expandido */}
            {isExpanded && !collapsed && (
                <ul className="mt-1 space-y-1">
                    {children.map((child) => {
                        const ChildIcon = getIcon(child.icono);
                        return (
                            <NavItem
                                key={child.idPantalla}
                                to={child.ruta}
                                label={child.nombre}
                                icon={ChildIcon}
                                isChild={true} // Aplica indentación
                            />
                        );
                    })}
                </ul>
            )}
        </li>
    );
};

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({
    isOpen,
    onClose,
    collapsed: collapsedProp,
    onCollapsedChange,
}) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;

    // Cargar pantallas desde localStorage al montar el componente
    useEffect(() => {
        const loadPantallas = () => {
            const pantallasFromStorage = getPantallasFromLocalStorage();
            if (pantallasFromStorage) {
                // Filtrar solo pantallas que deben mostrarse en el menú y ordenarlas
                const pantallasMenu = pantallasFromStorage
                    .filter((p) => p.esMenu)
                    .sort((a, b) => a.orden - b.orden);
                setPantallas(pantallasMenu);
            }
        };

        loadPantallas();
    }, []);

    /**
     * Organiza las pantallas en estructura jerárquica
     * Separa pantallas padre (sin idPadre) de pantallas hijas (con idPadre)
     */
    const organizarPantallas = () => {
        const padres = pantallas.filter((p) => p.idPadre === null);
        const hijos = pantallas.filter((p) => p.idPadre !== null);

        return padres.map((padre) => ({
            padre,
            hijos: hijos.filter((h) => h.idPadre === padre.idPantalla),
        }));
    };

    const pantallasOrganizadas = organizarPantallas();

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
                        className={`flex items-center gap-3 p-5 hover:bg-gray-700 transition-colors ${collapsed ? "justify-center" : ""
                            }`}
                    >
                        <img src={Logo} alt="StockApp Logo" className="w-14 h-14 flex-shrink-0 object-contain" />
                        {!collapsed && <span className="font-bold truncate text-xl">StockApp</span>}
                    </NavLink>

                    {/* Toggle Button - Desktop only */}
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

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-700 sm:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* NAV - Dinámico basado en pantallas del usuario con jerarquía */}
                <nav className="flex-1 overflow-auto p-3 mt-4">
                    <ul className="space-y-2">
                        {pantallasOrganizadas.length > 0 ? (
                            // Renderizar pantallas jerárquicamente
                            pantallasOrganizadas.map(({ padre, hijos }) => {
                                const IconComponent = getIcon(padre.icono);

                                // Si tiene hijos, renderizar como grupo desplegable
                                if (hijos.length > 0) {
                                    return (
                                        <ParentNavItem
                                            key={padre.idPantalla}
                                            label={collapsed ? "" : padre.nombre}
                                            icon={IconComponent}
                                            children={hijos}
                                            collapsed={collapsed}
                                        />
                                    );
                                }

                                // Si no tiene hijos, renderizar como item normal navegable
                                return (
                                    <NavItem
                                        key={padre.idPantalla}
                                        to={padre.ruta}
                                        label={collapsed ? "" : padre.nombre}
                                        icon={IconComponent}
                                    />
                                );
                            })
                        ) : (
                            // Mensaje cuando no hay pantallas cargadas
                            <li className="text-gray-400 text-sm p-2">
                                {collapsed ? "" : "Sin pantallas disponibles"}
                            </li>
                        )}
                    </ul>
                </nav>

                {/* FOOTER - Configuración siempre visible */}
                <div className="p-3 border-t border-gray-700">
                    <ul className="space-y-2">
                        <NavItem
                            to="/configuracion"
                            label={collapsed ? "" : "Configuración"}
                            icon={getIcon("IoIosSettings")}
                        />
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default DynamicSidebar;
