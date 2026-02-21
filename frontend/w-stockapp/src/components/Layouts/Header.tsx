import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { HiMail } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { useAlerts } from "../../hooks/useAlerts";
import { useResponsive } from "../../hooks/useResponsive";

interface HeaderProps {
    isSidebarOpen?: boolean;
    sidebarCollapsed?: boolean;
    onOpenSidebar?: () => void;
}

function Header({
    isSidebarOpen = false,
    sidebarCollapsed = false,
    onOpenSidebar
}: HeaderProps) {
    const navigate = useNavigate();
    const { isMobile } = useResponsive();
    const { confirm } = useAlerts();

    const handleProfile = () => {
        navigate("/perfil");
    };

    const handleLogout = async () => {
        const isConfirmed = await confirm(
            "¿Cerrar sesión?",
            "Tu sesión actual se cerrará",
            "Sí, salir",
            "Cancelar"
        );

        if (isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("isAuthenticated");
            navigate("/");
        }
    };

    const marginLeft = !isMobile && isSidebarOpen ? (sidebarCollapsed ? 80 : 288) : 0;

    return (
        <header
            style={{ marginLeft, transition: 'margin-left 300ms' }}
            className="bg-gray-900/95 backdrop-blur-md text-white h-20 px-8 flex justify-between items-center sticky top-0 z-40 border-b border-white/5 shadow-xl shadow-gray-900/10"
        >
            {/* Left Section */}
            <div className="flex items-center gap-6">
                {(!isSidebarOpen || isMobile) && (
                    <button
                        onClick={onOpenSidebar}
                        className="p-2.5 rounded-xl bg-white/5 text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg group active:scale-95"
                        title="Abrir menú"
                    >
                        <FiMenu className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                )}

                {!isMobile && !isSidebarOpen && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <img src="/stock_icono.ico" alt="Icon" className="w-6 h-6 invert" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">StockApp</span>
                    </div>
                )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4">
                {/* Search - Placeholder for premium feel */}
                <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-indigo-500/50 transition-all">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-gray-500"
                    />
                    <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">⌘K</kbd>
                </div>

                <div className="flex items-center gap-2 mr-2">
                    {/* Notifications */}
                    <button
                        className="relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
                        title="Notificaciones"
                    >
                        <IoNotifications className="text-lg text-gray-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-gray-900"></span>
                    </button>

                    {/* Messages */}
                    <button
                        className="relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
                        title="Mensajes"
                    >
                        <HiMail className="text-lg text-gray-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
                    </button>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block"></div>

                {/* User Profile */}
                <button
                    onClick={handleProfile}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <FaUserCircle className="text-2xl text-white/90" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                        <span className="text-sm font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">Admin User</span>
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Administrator</span>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 border border-red-500/20 active:scale-95 ml-2"
                    title="Cerrar sesión"
                >
                    <RiLogoutCircleLine className="text-lg" />
                </button>
            </div>
        </header>
    );
}

export default Header;
