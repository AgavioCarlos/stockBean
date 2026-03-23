import { apiFetch } from "../../services/Api";

export interface TipoPrecio {
    idTipoPrecio: number;
    nombre: string;
    descripcion?: string;
    status?: boolean;
}

export async function consultarTipoPrecios(signal?: AbortSignal) {
    const res = await apiFetch<TipoPrecio[]>("/tipos-precio", { signal });
    return res || [];
}

export async function crearTipoPrecio(data: Partial<TipoPrecio>) {
    return apiFetch<TipoPrecio>("/tipos-precio", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function actualizarTipoPrecio(id: number, data: Partial<TipoPrecio>) {
    return apiFetch<TipoPrecio>(`/tipos-precio/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function eliminarTipoPrecio(id: number) {
    return apiFetch<void>(`/tipos-precio/${id}`, {
        method: "DELETE",
    });
}
