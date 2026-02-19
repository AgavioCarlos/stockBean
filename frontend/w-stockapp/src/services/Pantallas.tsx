import { Pantalla } from "../interfaces/Pantalla";

/**
 * Servicio para gestionar las pantallas/rutas del usuario autenticado
 * Consume el endpoint /pantallas que retorna las pantallas según el rol del usuario
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Obtiene las pantallas permitidas para el usuario autenticado
 * Utiliza el token JWT almacenado en localStorage para autenticación
 * @returns Promise con el array de pantallas permitidas
 */
export const getPantallasUsuario = async (): Promise<Pantalla[]> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/pantallas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // JWT con el id_rol incluido
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener las pantallas del usuario");
    }

    const pantallas: Pantalla[] = await response.json();
    return pantallas;
};

/**
 * Guarda las pantallas en localStorage para acceso offline
 * Útil para evitar llamadas repetidas al backend
 * @param pantallas Array de pantallas a guardar
 */
export const savePantallasToLocalStorage = (pantallas: Pantalla[]): void => {
    localStorage.setItem("pantallas", JSON.stringify(pantallas));
};

/**
 * Obtiene las pantallas desde localStorage
 * @returns Array de pantallas o null si no existen
 */
export const getPantallasFromLocalStorage = (): Pantalla[] | null => {
    const pantallasStr = localStorage.getItem("pantallas");
    if (!pantallasStr) return null;

    try {
        return JSON.parse(pantallasStr) as Pantalla[];
    } catch {
        return null;
    }
};

/**
 * Limpia las pantallas del localStorage
 * Debe ejecutarse al cerrar sesión
 */
export const clearPantallasFromLocalStorage = (): void => {
    localStorage.removeItem("pantallas");
};
