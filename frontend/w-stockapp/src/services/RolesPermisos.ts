import { apiFetch } from "./Api";

export async function consultarArbolPermisos(idRol: number, signal?: AbortSignal) {
    return apiFetch(`/admin/roles-permisos/${idRol}`, { signal });
}

export async function actualizarPermisosRol(idRol: number, idPermisos: number[]) {
    return apiFetch(`/admin/roles-permisos/${idRol}`, {
        method: "PUT",
        body: JSON.stringify({ idPermisos })
    });
}

export async function consultarTodosPermisos(signal?: AbortSignal) {
    return apiFetch(`/admin/roles-permisos/permisos`, { signal });
}

export async function crearPermisoG(payload: { nombre: string; descripcion: string }) {
    return apiFetch(`/admin/roles-permisos/permisos`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export async function consultarPantallasPorPermiso(idPermiso: number, signal?: AbortSignal) {
    return apiFetch(`/admin/roles-permisos/permisos/${idPermiso}/pantallas`, { signal });
}

export async function actualizarPantallasPorPermiso(idPermiso: number, idPantallas: number[]) {
    return apiFetch(`/admin/roles-permisos/permisos/${idPermiso}/pantallas`, {
        method: "PUT",
        body: JSON.stringify({ idPantallas })
    });
}

export async function consultarRolesPorPermiso(idPermiso: number, signal?: AbortSignal) {
    return apiFetch(`/admin/roles-permisos/permisos/${idPermiso}/roles`, { signal });
}

export async function actualizarRolesPorPermiso(idPermiso: number, idRoles: number[]) {
    return apiFetch(`/admin/roles-permisos/permisos/${idPermiso}/roles`, {
        method: "PUT",
        body: JSON.stringify({ idRoles })
    });
}
