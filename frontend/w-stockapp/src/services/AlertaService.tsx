import { apiFetch } from "./Api";

const ENDPOINT = "/alertas";

export interface IAlerta {
    idAlerta: number;
    producto: {
        id_producto: number;
        nombre: string;
        codigoBarras?: string;
    };
    sucursal: {
        id_sucursal: number;
        nombre: string;
    };
    tipoAlerta: {
        id_tipo_alerta: number;
        nombre: string;
        descripcion?: string;
    };
    fecha: string;
    mensaje: string;
    status: boolean;
}

/**
 * Obtener alertas activas del usuario autenticado.
 */
export const obtenerAlertas = async (): Promise<IAlerta[]> => {
    return await apiFetch<IAlerta[]>(ENDPOINT) || [];
};

/**
 * Contar alertas activas (para el badge).
 */
export const contarAlertas = async (): Promise<number> => {
    return await apiFetch<number>(`${ENDPOINT}/count`) || 0;
};

/**
 * Marcar una alerta como leída.
 */
export const marcarAlertaLeida = async (idAlerta: number): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/${idAlerta}/leer`, { method: "PUT" });
};

/**
 * Marcar todas las alertas como leídas.
 */
export const marcarTodasLeidas = async (): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/leer-todas`, { method: "PUT" });
};
