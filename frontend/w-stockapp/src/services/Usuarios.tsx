import { apiFetch } from "./Api";

export async function consultarUsuarios(idUsuarioSolicitante: number, signal?: AbortSignal) {
    return apiFetch(`/usuarios/solicitante/${idUsuarioSolicitante}`, { signal });
}

export async function crearUsuario(usuario: any, idUsuarioCreador: number) {
    return apiFetch(`/usuarios/crear/${idUsuarioCreador}`, {
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