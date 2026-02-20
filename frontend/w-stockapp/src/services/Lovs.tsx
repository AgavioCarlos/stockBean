
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
    // Intentar leer 'usuario' o 'user_data' ya que parece haber inconsistencia en dónde se guarda
    let uData = localStorage.getItem("usuario");
    if (!uData) {
        uData = localStorage.getItem("user_data");
    }

    if (!uData) {
        console.warn("Lovs.Sucursales: No user data found in localStorage (usuario or user_data). Returning empty list.");
        return Promise.resolve([]);
    }

    try {
        const u = JSON.parse(uData);

        const idRol = u.id_rol || u.idRol;
        const idUsuario = u.id_usuario || u.id || u.idUsuario;

        if (idRol === 1) {
            return apiFetch("/sucursales", { signal });
        }

        if (!idUsuario) {
            console.warn("Lovs.Sucursales: User ID not found in user data", u);
            return Promise.resolve([]);
        }

        return apiFetch(`/sucursales/solicitante/${idUsuario}`, { signal });
    } catch (error) {
        console.error("Lovs.Sucursales: Error parsing user data", error);
        return Promise.resolve([]);
    }
}