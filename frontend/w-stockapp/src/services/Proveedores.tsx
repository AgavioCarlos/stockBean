import { apiFetch } from "./Api";

export interface Proveedor {
    idProveedor: number;
    nombre: string;
    direccion: string;
    email: string;
    status: boolean;
    fechaAlta?: string;
    fechaBaja?: string;
    fechaUltimaModificacion?: string;
}

export const consultarProveedores = async (signal?: AbortSignal): Promise<Proveedor[]> => {
    const response = await apiFetch<Proveedor[]>("/proveedores", { signal });
    return response || [];
};

export const crearProveedor = async (proveedor: Partial<Proveedor>): Promise<Proveedor | null> => {
    return apiFetch<Proveedor>("/proveedores", {
        method: "POST",
        body: JSON.stringify(proveedor),
    });
};

export const actualizarProveedor = async (id: number, proveedor: Partial<Proveedor>): Promise<Proveedor | null> => {
    return apiFetch<Proveedor>(`/proveedores/${id}`, {
        method: "PUT",
        body: JSON.stringify(proveedor),
    });
};

export const eliminarProveedor = async (id: number): Promise<void> => {
    await apiFetch(`/proveedores/${id}`, {
        method: "DELETE",
    });
};
