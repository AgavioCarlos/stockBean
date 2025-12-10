import { apiFetch } from "./Api";

export async function consultarMarcas(signal?: AbortSignal) {
    return apiFetch("/marcas", { signal });
}

export async function crearMarca(payload: {
    nombre: string;
    status: boolean;
}) {
    return apiFetch("/marcas", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function actualizarMarca(idMarca: number, payload: {
    nombre: string;
    status: boolean;
}) {
    return apiFetch(`/marcas/${idMarca}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function eliminarMarca(id: number) {
    return apiFetch(`/marcas/${id}`, {
        method: "DELETE",
    });
}
