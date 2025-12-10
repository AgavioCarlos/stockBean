import { apiFetch } from "./Api";

export async function consultarUnidades() {
    return apiFetch("/unidades");
}

export async function crearUnidad(payload: {
    nombre: string;
    abreviatura: string;
}) {
    return apiFetch("/unidades", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function actualizarUnidad(idUnidad: number, payload: {
    nombre: string;
    abreviatura: string;
}) {
    return apiFetch(`/unidades/${idUnidad}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function eliminarUnidad(id: number) {
    return apiFetch(`/unidades/${id}`, {
        method: "DELETE",
    });
}
