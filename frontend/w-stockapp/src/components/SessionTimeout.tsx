
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
    // Use a ref to track if the warning modal is currently shown to prevent duplicates
    const isWarningShownRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
                        icon: 'success',
                        title: 'Sesión Extendida',
                        text: 'Tu sesión ha sido extendida exitosamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    console.log('✅ Token refrescado exitosamente');

                    // Reset the check loop
                    startSessionCheck();
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

            // Ensure we are not already showing the warning
            if (timeLeft < 300 && timeLeft > 0 && !isWarningShownRef.current) { // Less than 5 minutes
                isWarningShownRef.current = true;

                let timerInterval: ReturnType<typeof setTimeout>;
                Swal.fire({
                    title: 'Tu sesión está por expirar',
                    html: 'Se cerrará la sesión en <b>5:00</b> minutos.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Extender sesión',
                    cancelButtonText: 'Cerrar sesión',
                    allowOutsideClick: false,
                    timer: timeLeft * 1000, // Auto close when expired
                    timerProgressBar: true,
                    didOpen: () => {
                        const b = Swal.getHtmlContainer()?.querySelector('b');
                        timerInterval = setInterval(() => {
                            const newToken = localStorage.getItem('token');
                            // If token changed externally (e.g. another tab), close this
                            if (newToken !== token) {
                                Swal.close();
                                return;
                            }

                            // Recalculate time left
                            const freshDecoded: DecodedToken = jwtDecode(newToken!);
                            const freshTimeLeft = freshDecoded.exp - (Date.now() / 1000);

                            if (b) {
                                const minutes = Math.floor(freshTimeLeft / 60);
                                const seconds = Math.floor(freshTimeLeft % 60);
                                b.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                        }, 1000);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                        isWarningShownRef.current = false;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Usuario hizo clic en "Extender sesión"
                        console.log('👤 Usuario quiere extender sesión');
                        refreshToken();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Usuario hizo clic en "Cerrar sesión"
                        console.log('👤 Usuario cerró sesión manualmente');
                        logout();
                    } else if (result.dismiss === Swal.DismissReason.timer) {
                        // El timer expiró
                        console.log('⏰ Timer expiró');
                        logout();
                    }
                });
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
        startSessionCheck();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return null; // This component doesn't render anything visible unless the modal triggers
};

export default SessionTimeout;
