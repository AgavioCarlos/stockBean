/**
 * Hook personalizado para acceder a las pantallas del usuario autenticado
 * 
 * Proporciona:
 * - Lista de pantallas disponibles
 * - Función para verificar si el usuario tiene acceso a una ruta específica
 * - Función para recargar las pantallas desde el backend
 * 
 * Uso:
 * const { pantallas, hasAccess, reloadPantallas } = usePantallas();
 */

import { useState, useEffect } from "react";
import { Pantalla } from "../interfaces/Pantalla";
import {
    getPantallasFromLocalStorage,
    getPantallasUsuario,
    savePantallasToLocalStorage,
} from "../services/Pantallas";

export const usePantallas = () => {
    const [pantallas, setPantallas] = useState<Pantalla[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar pantallas desde localStorage al montar
    useEffect(() => {
        loadPantallasFromStorage();
    }, []);

    /**
     * Carga las pantallas desde localStorage
     */
    const loadPantallasFromStorage = () => {
        const storedPantallas = getPantallasFromLocalStorage();
        if (storedPantallas) {
            setPantallas(storedPantallas);
        }
        setLoading(false);
    };

    /**
     * Recarga las pantallas desde el backend
     * Útil si los permisos cambian durante la sesión
     */
    const reloadPantallas = async () => {
        try {
            setLoading(true);
            const nuevasPantallas = await getPantallasUsuario();
            savePantallasToLocalStorage(nuevasPantallas);
            setPantallas(nuevasPantallas);
            setLoading(false);
            return true;
        } catch (error) {
            console.error("Error al recargar pantallas:", error);
            setLoading(false);
            return false;
        }
    };

    /**
     * Verifica si el usuario tiene acceso a una ruta específica
     * @param ruta - Ruta a verificar (ej: "/productos")
     * @returns true si tiene acceso, false si no
     */
    const hasAccess = (ruta: string): boolean => {
        return pantallas.some((p) => p.ruta === ruta);
    };

    /**
     * Obtiene una pantalla por su ruta
     * @param ruta - Ruta a buscar
     * @returns Pantalla encontrada o undefined
     */
    const getPantallaByRuta = (ruta: string): Pantalla | undefined => {
        return pantallas.find((p) => p.ruta === ruta);
    };

    return {
        pantallas,
        loading,
        hasAccess,
        getPantallaByRuta,
        reloadPantallas,
        loadPantallasFromStorage,
    };
};
