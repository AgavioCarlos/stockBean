import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import Logo from '../../assets/logo.svg?react';

function Header(){
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
            navigate("/");
        }
        });
    };
    return (
        <div>
            <nav className='bg-gray-800 text-white p-2 flex justify-between items-center'>
            <Link to="/home" className="text-base font-bold hover:cursor-pointer">
                <Logo className="w-12 h-12" />
            </Link>
                <div className="flex space-x-3">
                    <button
                        onClick={handleProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        <FaUserCircle />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        <RiLogoutCircleLine />
                    </button>
                </div>
            </nav>
        </div>
    )
}
export default Header;
