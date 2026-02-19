
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
    const uData = localStorage.getItem("usuario");
    if (!uData) return Promise.resolve([]);
    const u = JSON.parse(uData);

    // Role 1 (Sistemas) logic handled in page or specific service call for detailed filter, 
    // but for generic LOV usage, returning "accessible" branches is correct.
    // However, for Systems, they see ALL branches.
    if (u.id_rol === 1) {
        return apiFetch("/sucursales", { signal });
    }
    return apiFetch(`/sucursales/solicitante/${u.id_usuario}`, { signal });
}