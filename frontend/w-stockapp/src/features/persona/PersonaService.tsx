import { apiFetch } from "../../services/Api";
import type { IPersona } from "./persona.interface";

const ENDPOINT = "/personas";

export const consultarPersonas = async (): Promise<IPersona[]> => {
    return await apiFetch<IPersona[]>(`${ENDPOINT}/mis-personas`) || [];
};

export const consultarPersona = async (): Promise<IPersona> => {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }
    return await apiFetch<IPersona>(`${ENDPOINT}/${id}`) as IPersona;
};

export const crearPersona = async (data: Partial<IPersona>): Promise<IPersona> => {
    return await apiFetch<IPersona>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
    }) as IPersona;
};

export const actualizarPersona = async (id: number, data: Partial<IPersona>): Promise<IPersona> => {
    return await apiFetch<IPersona>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }) as IPersona;
};

export const eliminarPersona = async (id: number, currentPersona: IPersona, newStatus: boolean): Promise<IPersona> => {
    return await apiFetch<IPersona>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...currentPersona, status: newStatus }),
    }) as IPersona;
};
