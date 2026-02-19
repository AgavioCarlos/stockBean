import { apiFetch } from "./Api";

export async function consultarPersonas(idUsuarioSolicitante?: number) {
    if (idUsuarioSolicitante) {
        return apiFetch(`/personas/solicitante/${idUsuarioSolicitante}`)
    }
    return apiFetch("/personas")
}

export async function consultarPersona() {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }
    return apiFetch(`/persona/${id}`);
}
