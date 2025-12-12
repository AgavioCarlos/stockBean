
import React, { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
    exp: number;
}

const SessionTimeout: React.FC = () => {
    const navigate = useNavigate();
    // Use a ref to track if the warning modal is currently shown to prevent duplicates
    const isWarningShownRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        // Close any open swal
        Swal.close();
    };

    const refreshToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            logout();
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.token) {
                    localStorage.setItem('token', data.token);
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión Extendida',
                        text: 'Tu sesión ha sido extendida exitosamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    // Reset the check loop
                    startSessionCheck();
                } else {
                    throw new Error("Token refresh failed");
                }
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Fallback to logout if refresh fails
            logout();
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
                        refreshToken();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        logout();
                    } else if (result.dismiss === Swal.DismissReason.timer) {
                        logout(); // Timer ran out
                    }
                });
            } else if (timeLeft <= 0) {
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
