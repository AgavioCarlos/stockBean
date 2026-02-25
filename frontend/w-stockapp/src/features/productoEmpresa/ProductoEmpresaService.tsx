import { apiFetch } from "../../services/Api";
import type { IProductoEmpresa } from "./productoEmpresa.interface";

export async function consultarProductoEmpresas(signal?: AbortSignal): Promise<IProductoEmpresa[]> {
    return apiFetch("/producto-empresa", { signal }) as Promise<IProductoEmpresa[]>;
}

export async function crearProductoEmpresa(payload: Partial<IProductoEmpresa>): Promise<IProductoEmpresa> {
    return apiFetch("/producto-empresa", {
        method: "POST",
        body: JSON.stringify(payload),
    }) as Promise<IProductoEmpresa>;
}

export async function actualizarProductoEmpresa(id: number, payload: Partial<IProductoEmpresa>): Promise<IProductoEmpresa> {
    return apiFetch(`/producto-empresa/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    }) as Promise<IProductoEmpresa>;
}

export async function eliminarProductoEmpresa(id: number) {
    return apiFetch(`/producto-empresa/${id}`, {
        method: "DELETE",
    });
}
