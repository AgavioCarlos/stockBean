import { apiFetch } from "./Api";

export interface Usuario {
    id_usuario: number;
    cuenta: string;
    persona: {
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno?: string;
        email: string;
    };
}

export interface Sucursal {
    idSucursal: number;
    nombre: string;
}

export interface UsuarioSucursal {
    idUsuarioSucursal: number;
    usuario: Usuario;
    sucursal: Sucursal;
    status: boolean;
}

const ENDPOINT = "/usuario-sucursales";

export const listarUsuarioSucursales = async (): Promise<UsuarioSucursal[]> => {
    return await apiFetch<UsuarioSucursal[]>(ENDPOINT) || [];
};

export const asignarUsuarioSucursal = async (data: Partial<UsuarioSucursal>): Promise<UsuarioSucursal> => {
    // We need to send { usuario: { idUsuario: ... }, sucursal: { idSucursal: ... } }
    // or however the backend expects it.
    // The backend expects UsuarioSucursal object.
    return await apiFetch<UsuarioSucursal>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
    }) as UsuarioSucursal;
};

export const actualizarUsuarioSucursal = async (data: UsuarioSucursal): Promise<UsuarioSucursal> => {
    return await apiFetch<UsuarioSucursal>(ENDPOINT, {
        method: "PUT",
        body: JSON.stringify(data),
    }) as UsuarioSucursal;
};

export const eliminarUsuarioSucursal = async (id: number): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: "DELETE",
    });
};
