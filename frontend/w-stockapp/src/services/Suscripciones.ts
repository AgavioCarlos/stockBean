import { apiFetch } from "./Api";

export async function consultarSuscripcionesAdmin(signal?: AbortSignal) {
    return apiFetch("/suscripciones/admin", { signal });
}

export async function cambiarStatusSuscripcion(idSuscripcion: number, status: boolean) {
    return apiFetch(`/suscripciones/${idSuscripcion}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
    });
}

export async function extenderFechaSuscripcion(idSuscripcion: number, fechaFin: string) {
    return apiFetch(`/suscripciones/${idSuscripcion}/extend`, {
        method: "PUT",
        body: JSON.stringify({ fechaFin })
    });
}

export async function consultarSucursalesEmpresa(idEmpresa: number, signal?: AbortSignal) {
    return apiFetch(`/sucursales/empresa/${idEmpresa}`, { signal });
}
