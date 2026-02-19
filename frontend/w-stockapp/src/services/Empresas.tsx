import { apiFetch } from "./Api";

export async function consultarEmpresas(signal?: AbortSignal) {
    return apiFetch("/empresas", { signal })
}

export async function guardarEmpresa(empresa: any, signal?: AbortSignal) {
    return apiFetch("/empresas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
        signal,
    });
}

export async function actualizarEmpresa(id: number, empresa: any, signal?: AbortSignal) {
    return apiFetch(`/empresas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
        signal,
    });
}

export async function configurarEmpresa(empresa: any, idUsuario: number, signal?: AbortSignal) {
    return apiFetch(`/empresas/configurar/${idUsuario}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
        signal,
    });
}