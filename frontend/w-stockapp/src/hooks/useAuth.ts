import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Interface representing the user data stored in the session.
 * Based on the LoginResponse from LoginService.
 */
export interface UserSession {
    id_usuario: number;
    cuenta: string;
    id_rol: number;
    token: string;
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    email?: string;
    empresa?: string[];
    [key: string]: any;
}

/**
 * Hook to manage user authentication and session data.
 * Centralizes access to localStorage and provides role-based helpers.
 */
export const useAuth = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user data on initialization
    useEffect(() => {
        const uDataStr = localStorage.getItem("usuario") || localStorage.getItem("user_data");
        if (uDataStr) {
            try {
                const u = JSON.parse(uDataStr);
                setUser(u);
            } catch (e) {
                console.error("Error parsing user data from localStorage", e);
                localStorage.removeItem("usuario");
                localStorage.removeItem("user_data");
            }
        }
        setLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("user_data");
        setUser(null);
        window.location.href = "/login";
    }, []);

    // Role-based helper properties
    const roles = useMemo(() => ({
        isSistem: user?.id_rol === 1,
        isAdmin: user?.id_rol === 2,
        isGerente: user?.id_rol === 3,
        isCajero: user?.id_rol === 4,
        roleName: user?.id_rol === 1 ? 'SISTEM' :
            user?.id_rol === 2 ? 'ADMIN' :
                user?.id_rol === 3 ? 'GERENTE' :
                    user?.id_rol === 4 ? 'CAJERO' : 'UNKNOWN'
    }), [user?.id_rol]);

    return {
        user,
        loading,
        logout,
        ...roles,
        isAuthenticated: !!user?.token
    };
};
