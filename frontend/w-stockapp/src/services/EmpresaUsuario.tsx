import { apiFetch } from "./Api";

export async function consultarEmpresaUsuario(signal?: AbortSignal) {
    return apiFetch("/empresa_usuarios", { signal })
}

export async function guardarEmpresaUsuario(empresaUsuario: any, signal?: AbortSignal) {
    return apiFetch("/empresa_usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaUsuario),
        signal,
    });
}

export async function actualizarEmpresaUsuario(id: number, empresaUsuario: any, signal?: AbortSignal) {
    return apiFetch(`/empresa_usuarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaUsuario),
        signal,
    });             
}

export async function eliminarEmpresaUsuario(id: number, signal?: AbortSignal) {
    return apiFetch(`/empresa_usuarios/${id}`, {
        method: "DELETE",
        signal,
    });
}