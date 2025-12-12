import { apiFetch } from "./Api";
import { HistorialPrecios } from "../interfaces/historialPrecios.interface";

const ENDPOINT = "/historial-precios";

export const listarTodos = async (): Promise<HistorialPrecios[]> => {
    return await apiFetch<HistorialPrecios[]>(`${ENDPOINT}`) || [];
};

export const listarActuales = async (): Promise<HistorialPrecios[]> => {
    return await apiFetch<HistorialPrecios[]>(`${ENDPOINT}/actuales`) || [];
};

export const listarHistoricosId = async (id: number): Promise<HistorialPrecios[]> => {
    return await apiFetch<HistorialPrecios[]>(`${ENDPOINT}/historicos/${id}`) || [];
};

export const guardar = async (historialPrecios: Partial<HistorialPrecios>): Promise<HistorialPrecios> => {
    const response = await apiFetch<HistorialPrecios>(`${ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(historialPrecios),
    });
    if (!response) throw new Error("Error al guardar historial de precios");
    return response;
};

export const eliminar = async (id: number): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: "DELETE",
    });
};
