import { useCallback } from 'react';
import { useAlertContext, AlertType } from '../context/AlertContext';

export const useAlerts = () => {
    const { addToast, showModal } = useAlertContext();

    const showAlert = useCallback(async (title: string, message: string, type: AlertType = 'info') => {
        return await showModal({
            title,
            message,
            type,
            confirmText: 'Aceptar'
        });
    }, [showModal]);

    const success = useCallback((title: string = '¡Éxito!', text: string = 'Operación realizada correctamente') => {
        addToast(title, 'success', text);
    }, [addToast]);

    const error = useCallback((title: string = '¡Error!', text: string = 'Ha ocurrido un error inesperado') => {
        addToast(title, 'error', text);
    }, [addToast]);

    const warning = useCallback((title: string = '¡Atención!', text: string) => {
        addToast(title, 'warning', text);
    }, [addToast]);

    const confirm = useCallback(async (
        title: string,
        text: string,
        confirmButtonText: string = 'Sí, continuar',
        cancelButtonText: string = 'Cancelar'
    ) => {
        return await showModal({
            title,
            message: text,
            type: 'warning',
            isConfirm: true,
            confirmText: confirmButtonText,
            cancelText: cancelButtonText
        });
    }, [showModal]);

    const toast = useCallback((title: string, type: AlertType = 'success') => {
        addToast(title, type);
    }, [addToast]);

    return {
        showAlert,
        success,
        error,
        warning,
        confirm,
        toast
    };
};
