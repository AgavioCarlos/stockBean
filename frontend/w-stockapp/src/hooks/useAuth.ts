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
    empresa?: any[]; // Typically Array of objects
    // Added for RBAC Micro-Permissions
    permisos_crud?: Record<number, Record<string, string[]>>; // { idEmpresa: { "pantallaKey": ["create", "read"] } }
    [key: string]: any;
}

/**
 * Hook to manage user authentication and session data.
 * Centralizes access to localStorage and provides role-based helpers.
 */
export const useAuth = () => {
    const [user, setUser] = useState<UserSession | null>(() => {
        const uDataStr = localStorage.getItem("usuario") || localStorage.getItem("user_data");
        if (uDataStr) {
            try {
                return JSON.parse(uDataStr);
            } catch (e) {
                console.error("Error parsing user data from localStorage", e);
                localStorage.removeItem("usuario");
                localStorage.removeItem("user_data");
                return null;
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(!user);

    // Sync state if needed (though primary load is now sync)
    useEffect(() => {
        if (!user) {
            const uDataStr = localStorage.getItem("usuario") || localStorage.getItem("user_data");
            if (uDataStr) {
                try {
                    setUser(JSON.parse(uDataStr));
                } catch (e) { }
            }
        }
        setLoading(false);
    }, [user]);

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

/**
 * Hook to retrieve specific UI interactions (CRUD) per screen based on RBAC.
 * It reads the injected "permisos_crud" object map from the user's session.
 * Permissions are now ALWAYS read from admin_usuario_pantalla for ALL roles.
 * NOTE: JSON keys are always strings, so we must use String() for empresa ID lookups.
 */
export const usePermissions = (pantallaKey: string) => {
    const { user, loading } = useAuth();

    // Default permission object for when we are loading or unauthorized
    const DENIED = {
        canView: false,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canExport: false,
        loading: loading
    };

    if (loading) return DENIED;

    const permisosCrud = user?.permisos_crud;

    // Fallback: si Sistemas no tiene permisos_crud definidos, otorgar todo como seguridad
    if (!permisosCrud || Object.keys(permisosCrud).length === 0) {
        if (user?.id_rol === 1) {
            return { ...DENIED, canView: true, canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, loading: false };
        }
        return DENIED;
    }

    // JSON keys are ALWAYS strings ("5" not 5), so use String for the lookup
    const empresaKeys = Object.keys(permisosCrud);
    const activeEmpresaKey = localStorage.getItem('id_empresa') || empresaKeys[0] || '';

    // Access the permissions map for this empresa using the string key
    const permisosPorPantalla = permisosCrud[activeEmpresaKey as any];

    if (!permisosPorPantalla) {
        // Fallback para Sistemas sin empresa
        if (user?.id_rol === 1) {
            return { ...DENIED, canView: true, canCreate: true, canRead: true, canUpdate: true, canDelete: true, canExport: true, loading: false };
        }
        return DENIED;
    }

    // Get the actions array for this specific screen
    const accionesPermitidas = (permisosPorPantalla[pantallaKey] || []).map((p: string) => p.toLowerCase());

    const canView = accionesPermitidas.includes('ver');

    return {
        canView,
        canCreate: canView && accionesPermitidas.includes('guardar'),
        canRead: canView, // backward compat alias
        canUpdate: canView && accionesPermitidas.includes('actualizar'),
        canDelete: canView && accionesPermitidas.includes('eliminar'),
        canExport: canView,
        loading: false
    };
};
