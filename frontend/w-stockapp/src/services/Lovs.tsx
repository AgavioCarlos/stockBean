
import { apiFetch } from "./Api";

export async function Roles(signal?: AbortSignal) {
    return apiFetch("/roles", { signal });
}

export async function Unidades() {
    return apiFetch("/unidades");
}

export async function Productos(signal?: AbortSignal) {
    return apiFetch("/productos", { signal });
}

export async function Sucursales(signal?: AbortSignal) {
    return apiFetch("/sucursales/mis-sucursales", { signal });
}

export async function Categorias(signal?: AbortSignal) {
    return apiFetch("/categorias", { signal });
}

export async function Marcas(signal?: AbortSignal) {
    return apiFetch("/marcas", { signal });
}

export async function TipoPrecios(signal?: AbortSignal) {
    return apiFetch("/tipos-precio", { signal });
}