import {
    FiBox,
    FiLayers,
    FiUsers,
    FiTag,
    FiTruck,
    FiMapPin,
    FiClipboard,
    FiGrid,
    FiShoppingCart,
    FiPackage,
    FiDollarSign,
    FiFileText,
    FiHome,
    FiSettings,
    FiUser,
    FiShield,
} from "react-icons/fi";
import { BsMenuButton } from "react-icons/bs";
import { MdOutlinePointOfSale } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";

/**
 * Mapa de nombres de íconos a componentes de React Icons
 * Permite obtener dinámicamente el ícono correcto basado en el nombre string
 * que viene desde la base de datos
 */
export const iconMap: { [key: string]: React.ComponentType } = {
    // Iconos generales
    FiHome,
    FiLayers,
    FiGrid,
    FiSettings,
    IoIosSettings,

    // Catálogos y productos
    FiBox,
    FiPackage,
    FiTag,
    BsMenuButton,

    // Usuarios y personas
    FiUsers,
    FiUser,
    FiShield,
    RiAdminLine,

    // Operaciones
    FiClipboard,
    FiShoppingCart,
    FiDollarSign,
    FiFileText,
    MdOutlinePointOfSale,

    // Proveedores y logística
    FiTruck,
    FiMapPin,
};

/**
 * Obtiene el componente de ícono basado en el nombre string
 * @param iconName Nombre del ícono (ej: "FiBox")
 * @returns Componente del ícono o un ícono por defecto
 */
export const getIcon = (iconName: string): React.ComponentType => {
    return iconMap[iconName] || FiLayers; // FiLayers como ícono por defecto
};
