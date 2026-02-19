import { useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { HiMail } from "react-icons/hi";
import Swal from "sweetalert2";

function Header({ isSidebarOpen = false, sidebarCollapsed = false }: { isSidebarOpen?: boolean; sidebarCollapsed?: boolean }) {
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate("/perfil");
    };

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión actual se cerrará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
                navigate("/");
            }
        });
    };

    const left = isSidebarOpen ? (sidebarCollapsed ? 80 : 288) : 0;

    return (
        <div>
            <nav style={{ marginLeft: left, transition: 'margin-left 300ms' }} className="bg-gray-800 text-white p-5 flex justify-between items-center relative z-50">

                {/* Notifications and Messages */}
                <div className="flex items-center space-x-3 ml-auto">
                    {/* Notifications */}
                    <button
                        className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 hover:border-blue-400 transition-colors"
                        title="Notificaciones"
                    >
                        <IoNotifications className="text-xl text-gray-200" />
                        {/* Badge for unread notifications */}
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
                    </button>

                    {/* Messages */}
                    <button
                        className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600 hover:border-blue-400 transition-colors"
                        title="Mensajes"
                    >
                        <HiMail className="text-xl text-gray-200" />
                        {/* Badge for unread messages */}
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
                    </button>

                    {/* User Avatar - placeholder icon, will be replaced with user image later */}
                    <button
                        onClick={handleProfile}
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        title="Ver perfil"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500 hover:border-blue-400 transition-colors">
                            <FaUserCircle className="text-2xl text-gray-200" />
                        </div>
                    </button>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                        title="Cerrar sesión"
                    >
                        <RiLogoutCircleLine className="text-xl" />
                    </button>
                </div>

                {/* User Profile and Logout */}
                {/* <div className="flex items-center space-x-3 mr-4">

                </div> */}
            </nav>
        </div>
    );
}

export default Header;
