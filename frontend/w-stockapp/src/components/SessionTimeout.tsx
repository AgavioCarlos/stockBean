
import React, { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getPantallasUsuario, savePantallasToLocalStorage } from '../services/Pantallas';

interface DecodedToken {
    exp: number;
}

const SessionTimeout: React.FC = () => {
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const logout = () => {
        // Limpiar todo el localStorage al hacer logout
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('pantallas');
        localStorage.removeItem('user_data');
        navigate('/login');
        // Close any open swal
        Swal.close();
    };

    const refreshToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('⚠️ No hay token para refrescar');
            logout();
            return;
        }

        try {
            console.log('🔄 Intentando refrescar token...');

            // ✅ CORRECCIÓN: Usar la IP correcta del servidor (antes era localhost:8080)
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Enviar token también en header
                },
                body: JSON.stringify({ token }),
            });

            console.log('📡 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Respuesta del servidor:', data);

                if (data.success && data.token) {
                    // Guardar nuevo token
                    localStorage.setItem('token', data.token);

                    // ✅ MEJORA: Recargar pantallas con el nuevo token
                    try {
                        const pantallas = await getPantallasUsuario();
                        savePantallasToLocalStorage(pantallas);
                        console.log('✅ Pantallas recargadas después de refresh');
                    } catch (pantallasError) {
                        console.warn('⚠️ No se pudieron recargar pantallas:', pantallasError);
                        // No bloqueamos el refresh si falla la recarga de pantallas
                    }

                    Swal.fire({
                        toast: true,
                        position: 'bottom-end',
                        icon: 'success',
                        title: 'Sesión extendida',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        background: '#f8fafc',
                        color: '#1e293b'
                    });

                    console.log('✅ Token refrescado exitosamente');
                } else {
                    console.error('❌ Refresh falló: respuesta sin token válido', data);
                    throw new Error("Token refresh failed: " + (data.mensaje || 'Unknown error'));
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Error HTTP:', response.status, errorText);

                // ✅ MEJORA: Mensaje específico si el endpoint no existe (404)
                if (response.status === 404) {
                    console.error('❌ El endpoint /auth/refresh NO EXISTE en el backend');
                    throw new Error('Endpoint de refresh no implementado en el servidor');
                }

                throw new Error(`Network response was not ok: ${response.status}`);
            }
        } catch (error) {
            console.error("❌ Error refrescando token:", error);

            // ✅ MEJORA: Mostrar mensaje específico al usuario
            Swal.fire({
                icon: 'error',
                title: 'No se pudo extender la sesión',
                text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                confirmButtonText: 'Ir a Login',
                allowOutsideClick: false
            }).then(() => {
                logout();
            });
        }
    };

    const checkSession = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded: DecodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const timeLeft = decoded.exp - currentTime;

            // Ensure we check when less than 5 minutes remain
            if (timeLeft < 300 && timeLeft > 0) {
                const idleTime = Date.now() - lastActivityRef.current;

                // If user was active in the last 2 minutes, refresh automatically
                if (idleTime < 2 * 60 * 1000) {
                    console.log('👤 Usuario activo, extendiendo sesión automáticamente');
                    refreshToken();
                } else {
                    console.log(`⏱️ Usuario inactivo. La sesión expirará en ${Math.floor(timeLeft)}s`);
                }
            } else if (timeLeft <= 0) {
                console.log('⏰ Sesión expirada');
                logout();
            }
        } catch (error) {
            console.error("Invalid token:", error);
            logout();
        }
    };

    const startSessionCheck = () => {
        // Clear existing interval if any
        if (timerRef.current) clearInterval(timerRef.current);

        // Check immediately and then every minute
        checkSession();
        timerRef.current = setInterval(checkSession, 60000); // Check every minute
    };

    useEffect(() => {
        const handleUserActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
        activityEvents.forEach(event => window.addEventListener(event, handleUserActivity));

        startSessionCheck();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            activityEvents.forEach(event => window.removeEventListener(event, handleUserActivity));
        };
    }, []);

    return null; // This component doesn't render anything visible unless the modal triggers
};

export default SessionTimeout;
