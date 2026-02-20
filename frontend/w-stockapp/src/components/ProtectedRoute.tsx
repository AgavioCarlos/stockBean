/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación y permisos
 * 
 * Funcionalidades:
 * 1. Verifica si el usuario está autenticado (tiene token válido)
 * 2. Verifica si el usuario tiene permisos para acceder a la ruta actual
 * 3. Redirige a /login si no está autenticado
 * 4. Redirige a /unauthorized si no tiene permisos
 * 
 * Uso:
 * <ProtectedRoute requirePermission={true}>
 *   <MiComponente />
 * </ProtectedRoute>
 * 
 * Props:
 * - children: Componente hijo a renderizar si tiene acceso
 * - requirePermission: Si es true, valida permisos. Si es false, solo valida autenticación
 */

import { Navigate, useLocation } from "react-router-dom";
import { usePantallas } from "../hooks/usePantallas";

interface ProtectedRouteProps {
    children: JSX.Element;
    requirePermission?: boolean; // Por defecto true - valida permisos
}

const ProtectedRoute = ({
    children,
    requirePermission = true
}: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const location = useLocation();
    const { hasAccess, loading } = usePantallas();

    console.log(`ProtectedRoute: Checking access for ${location.pathname}. Auth: ${isAuthenticated}, Loading: ${loading}, RequirePerm: ${requirePermission}`);

    // 1️⃣ Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        console.warn("ProtectedRoute: Not authenticated. Redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    // 2️⃣ Si no requiere validación de permisos, permitir acceso
    if (!requirePermission) {
        return children;
    }

    // 3️⃣ Esperar a que carguen las pantallas
    if (loading) {
        console.log("ProtectedRoute: Loading permissions...");
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // 4️⃣ Verificar si tiene acceso a la ruta actual
    const currentPath = location.pathname;

    // Lista de rutas públicas que no requieren validación de permisos
    const publicRoutes = ["/home", "/perfil", "/configuracion", "/unauthorized"];

    if (publicRoutes.includes(currentPath)) {
        return children;
    }

    // 5️⃣ Validar si tiene acceso a la ruta
    const access = hasAccess(currentPath);
    console.log(`ProtectedRoute: hasAccess(${currentPath}) = ${access}`);

    if (!access) {
        console.warn(`⛔ Acceso denegado a: ${currentPath}`);
        return <Navigate to="/unauthorized" replace />;
    }

    // 6️⃣ Si pasa todas las validaciones, renderizar el componente hijo
    console.log(`ProtectedRoute: Access granted to ${currentPath}. Rendering children.`);
    return children;
};

export default ProtectedRoute;