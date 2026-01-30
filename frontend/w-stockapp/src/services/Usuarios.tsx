import { apiFetch } from "./Api";

export async function consultarUsuarios(signal?: AbortSignal) {
    return apiFetch("/usuarios", { signal });
}

export async function crearUsuario(usuario: any) {
    return apiFetch("/usuarios", {
        method: "POST",
        body: JSON.stringify(usuario),
    });
}

export async function actualizarUsuario(id: number, usuario: any) {
    return apiFetch(`/usuarios/${id}`, {
        method: "PUT", // or PATCH
        body: JSON.stringify(usuario),
    });
}