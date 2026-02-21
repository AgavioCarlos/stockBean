/**
 * DynamicSidebar - Sidebar que se construye dinámicamente basado en los permisos del usuario
 * 
 * Este componente reemplaza el Sidebar estático cargando las pantallas permitidas
 * desde el localStorage (previamente obtenidas del backend al hacer login).
 */

import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FiX, FiChevronRight, FiChevronLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Logo from "../../assets/icon.png";
import { Pantalla } from "../../interfaces/Pantalla";
import { getPantallasFromLocalStorage } from "../../services/Pantallas";
import { getIcon } from "../../utils/iconMapper";
import { useResponsive } from "../../hooks/useResponsive";

type DynamicSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
};

/**
 * Componente para items del menú sin hijos
 */
const NavItem: React.FC<{
    to: string;
    label: string;
    icon?: React.ComponentType;
    onClick?: () => void;
    className?: string;
    isChild?: boolean;
}> = ({ to, label, icon: Icon, onClick, className, isChild = false }) => {
    const base = `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${isChild ? 'pl-11' : ''}`;

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
                {Icon && (
                    <span className="text-xl transition-transform group-hover:scale-110 duration-300">
                        <Icon />
                    </span>
                )}
                <span className="truncate text-sm tracking-wide">{label}</span>
            </NavLink>
        </li>
    );
};

/**
 * Componente para items del menú padre (desplegables)
 */
const ParentNavItem: React.FC<{
    label: string;
    icon?: React.ComponentType;
    children: Pantalla[];
    collapsed: boolean;
    onCloseSidebar?: () => void;
}> = ({ label, icon: Icon, children, collapsed, onCloseSidebar }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <li>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-gray-400 hover:text-white"
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <span className="text-xl transition-transform group-hover:scale-110 duration-300">
                            <Icon />
                        </span>
                    )}
                    {!collapsed && <span className="truncate text-sm font-bold tracking-wide">{label}</span>}
                </div>
                {!collapsed && (
                    <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <FiChevronDown size={16} />
                    </span>
                )}
            </button>

            {isExpanded && !collapsed && (
                <ul className="mt-1 space-y-1 relative before:absolute before:left-5 before:top-0 before:bottom-3 before:w-px before:bg-white/10">
                    {children.map((child) => {
                        const ChildIcon = getIcon(child.icono);
                        return (
                            <NavItem
                                key={child.idPantalla}
                                to={child.ruta}
                                label={child.nombre}
                                icon={ChildIcon}
                                isChild={true}
                                onClick={onCloseSidebar}
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
    const { isMobile } = useResponsive();
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;

    useEffect(() => {
        const loadPantallas = () => {
            const pantallasFromStorage = getPantallasFromLocalStorage();
            if (pantallasFromStorage) {
                const pantallasMenu = pantallasFromStorage
                    .filter((p) => p.esMenu)
                    .sort((a, b) => a.orden - b.orden);
                setPantallas(pantallasMenu);
            }
        };
        loadPantallas();
    }, []);

    const pantallasOrganizadas = useMemo(() => {
        const padres = pantallas.filter((p) => p.idPadre === null);
        const hijos = pantallas.filter((p) => p.idPadre !== null);

        return padres.map((padre) => ({
            padre,
            hijos: hijos.filter((h) => h.idPadre === padre.idPantalla),
        }));
    }, [pantallas]);

    return (
        <>
            {/* Backdrop para móvil */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[45] animate-in fade-in duration-500"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full bg-[#0F172A] text-white z-50
                    transform transition-all duration-300 ease-in-out border-r border-white/5 shadow-2xl
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    ${collapsed && !isMobile ? "w-20" : "w-72"}
                `}
                style={{ minWidth: collapsed && !isMobile ? 80 : 288 }}
            >
                <div className="flex flex-col h-full relative">
                    {/* Header */}
                    <div className="flex flex-col w-full relative">
                        <NavLink
                            to="/home"
                            onClick={isMobile ? onClose : undefined}
                            className={`flex items-center gap-4 p-6 hover:bg-white/5 transition-all group ${collapsed && !isMobile ? "justify-center" : ""}`}
                        >
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
                                <img src="/stock_icono.ico" alt="Logo" className="w-6 h-6 invert" />
                            </div>
                            {!collapsed && !isMobile && (
                                <div className="flex flex-col">
                                    <span className="font-black text-xl tracking-tighter uppercase leading-none">StockApp</span>
                                    <span className="text-[10px] text-indigo-400 font-bold tracking-widest mt-1">PRO EDITION</span>
                                </div>
                            )}
                        </NavLink>

                        {/* Botón de colapso */}
                        {!isMobile && (
                            <div className="absolute -right-3 top-20 z-50">
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
                        )}

                        {/* Botón de cierre (Solo Móvil) */}
                        {isMobile && (
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors active:scale-95"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 overflow-auto p-4 mt-2 custom-scrollbar space-y-8">
                        <div>
                            {!collapsed && (
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Módulos Principales</p>
                            )}
                            <ul className="space-y-1.5">
                                {pantallasOrganizadas.length > 0 ? (
                                    pantallasOrganizadas.map(({ padre, hijos }) => {
                                        const IconComponent = getIcon(padre.icono);
                                        if (hijos.length > 0) {
                                            return (
                                                <ParentNavItem
                                                    key={padre.idPantalla}
                                                    label={collapsed && !isMobile ? "" : padre.nombre}
                                                    icon={IconComponent}
                                                    children={hijos}
                                                    collapsed={collapsed && !isMobile}
                                                    onCloseSidebar={isMobile ? onClose : undefined}
                                                />
                                            );
                                        }
                                        return (
                                            <NavItem
                                                key={padre.idPantalla}
                                                to={padre.ruta}
                                                label={collapsed && !isMobile ? "" : padre.nombre}
                                                icon={IconComponent}
                                                onClick={isMobile ? onClose : undefined}
                                            />
                                        );
                                    })
                                ) : (
                                    <li className="bg-white/5 text-gray-500 text-[10px] font-bold py-8 rounded-2xl text-center uppercase tracking-widest border border-dashed border-white/10 mx-2">
                                        Sin accesos
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5">
                        <NavItem
                            to="/configuracion"
                            label={collapsed && !isMobile ? "" : "Configuración"}
                            icon={getIcon("IoIosSettings")}
                            onClick={isMobile ? onClose : undefined}
                            className="bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                        />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DynamicSidebar;
