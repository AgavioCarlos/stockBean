import { apiFetch } from "./Api";

export async function consultarPersonas() {
    return apiFetch("/personas")
}

export async function consultarPersona() {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }

    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/persona/${id}`, { headers });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Error al consultar persona: ${response.status} ${body}`);
    }
    return await response.json();
}
