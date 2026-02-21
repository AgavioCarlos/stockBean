import { apiFetch } from "./Api";

export async function consultarPersonas() {
    return apiFetch("/personas/mis-personas")
}

export async function consultarPersona() {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }
    return apiFetch(`/personas/${id}`);
}

export async function actualizarPersona(id: number, persona: any) {
    return apiFetch(`/personas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(persona)
    });
}
