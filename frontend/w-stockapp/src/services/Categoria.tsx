import { apiFetch } from "./Api";
import { Categoria } from "../interfaces/categoria.interface";

export async function consultarCategorias(signal?: AbortSignal) {
    return apiFetch("/categorias", { signal });
}

export async function crearCategoria(payload: {
    nombre: string;
    status: boolean;
}) {
    return apiFetch("/categorias", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function actualizarCategoria(idCategoria: number, payload: {
    nombre: string;
    status: boolean;
}) {
    return apiFetch(`/categorias/${idCategoria}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function eliminarCategoria(id: number) {
    return apiFetch(`/categorias/${id}`, {
        method: "DELETE",
    });
}
