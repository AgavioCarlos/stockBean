import { useAlerts } from './useAlerts';

/**
 * Hook de notificaciones centralizado. Actualmente es un wrapper de useAlerts.
 * Centralizarlo aquí permite cambiar la librería de notificaciones en un futuro
 * (ej. cambiar Sonner por Toast UI) sin tocar los componentes de negocio.
 */
export const useNotifications = () => {
    const alerts = useAlerts();

    return {
        ...alerts,
        /**
         * Alias para mensajes rápidos de éxito
         */
        notifySuccess: (text: string) => alerts.success('¡Éxito!', text),
        /**
         * Alias para mensajes rápidos de error
         */
        notifyError: (text: string) => alerts.error('Error', text),
    };
};
