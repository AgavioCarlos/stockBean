/**
 * Interfaz que representa una pantalla/ruta del sistema
 * Utilizada para la navegación dinámica basada en permisos del usuario
 */
export interface Pantalla {
    idPantalla: number;     // ID único de la pantalla
    clave: string;          // Clave única (ej: "PROD", "CAT")
    nombre: string;         // Nombre descriptivo (ej: "Productos", "Categorías")
    ruta: string;           // Ruta URL (ej: "/productos", "/categorias")
    icono: string;          // Nombre del ícono (ej: "FiBox", "FiLayers")
    orden: number;          // Orden de aparición en el menú
    idPadre: number | null; // ID del padre si es submenu, null si es raíz
    esMenu: boolean;        // Indica si debe mostrarse en el menú lateral
}
