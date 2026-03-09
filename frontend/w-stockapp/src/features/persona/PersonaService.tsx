import { apiFetch } from "../../services/Api";
import { Persona } from "./persona.interface";

const ENDPOINT = "/personas";

export const consultarPersonas = async (): Promise<Persona[]> => {
    return await apiFetch<Persona[]>(`${ENDPOINT}/mis-personas`) || [];
};

export const consultarPersona = async (): Promise<Persona> => {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }
    return await apiFetch<Persona>(`${ENDPOINT}/${id}`) as Persona;
};

export const crearPersona = async (data: Partial<Persona>): Promise<Persona> => {
    return await apiFetch<Persona>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
    }) as Persona;
};

export const actualizarPersona = async (id: number, data: Partial<Persona>): Promise<Persona> => {
    return await apiFetch<Persona>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }) as Persona;
};

export const eliminarPersona = async (id: number, currentPersona: Persona, newStatus: boolean): Promise<Persona> => {
    return await apiFetch<Persona>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...currentPersona, status: newStatus }),
    }) as Persona;
};
