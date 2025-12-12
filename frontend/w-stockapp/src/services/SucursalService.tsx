import { apiFetch } from "./Api";

const API_URL = "/sucursales";

export interface Sucursal {
    idSucursal: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    status: boolean;
    fechaAlta?: string;
}

export const consultarSucursales = async (): Promise<Sucursal[]> => {
    try {
        const data = await apiFetch<Sucursal[]>(API_URL);
        return data || [];
    } catch (error) {
        console.error("Error al consultar sucursales", error);
        return [];
    }
};

export const crearSucursal = async (sucursal: Omit<Sucursal, "idSucursal">): Promise<Sucursal> => {
    try {
        const data = await apiFetch<Sucursal>(API_URL, {
            method: "POST",
            body: JSON.stringify(sucursal),
        });
        if (!data) throw new Error("No data returned");
        return data;
    } catch (error) {
        console.error("Error al crear sucursal", error);
        throw error;
    }
};

export const actualizarSucursal = async (id: number, sucursal: Partial<Sucursal>): Promise<Sucursal> => {
    try {
        const data = await apiFetch<Sucursal>(`${API_URL}/${id}`, {
            method: "PUT",
            body: JSON.stringify(sucursal),
        });
        if (!data) throw new Error("No data returned");
        return data;
    } catch (error) {
        console.error("Error al actualizar sucursal", error);
        throw error;
    }
};

export const eliminarSucursal = async (id: number): Promise<void> => {
    try {
        await apiFetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Error al eliminar sucursal", error);
        throw error;
    }
};
