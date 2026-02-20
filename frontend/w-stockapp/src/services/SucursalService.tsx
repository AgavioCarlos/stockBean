import { apiFetch } from "./Api";
import { Sucursal } from "../interfaces/sucursal.interface";

const API_URL = "/sucursales";


export const consultarSucursales = async (): Promise<Sucursal[]> => {
    try {
        const data = await apiFetch<Sucursal[]>(API_URL);
        return data || [];
    } catch (error) {
        console.error("Error al consultar sucursales", error);
        return [];
    }
};

export const consultarSucursalesPorSolicitante = async (idUsuario: number): Promise<Sucursal[]> => {
    try {
        const data = await apiFetch<Sucursal[]>(`${API_URL}/solicitante/${idUsuario}`);
        return data || [];
    } catch (error) {
        console.error("Error al consultar sucursales por solicitante", error);
        return [];
    }
};

export const consultarSucursalesPorEmpresa = async (idEmpresa: number): Promise<Sucursal[]> => {
    try {
        const data = await apiFetch<Sucursal[]>(`${API_URL}/empresa/${idEmpresa}`);
        return data || [];
    } catch (error) {
        console.error("Error al consultar sucursales por empresa", error);
        return [];
    }
};

export const crearSucursal = async (sucursal: Omit<Sucursal, "idSucursal">, idUsuario?: number): Promise<Sucursal> => {
    try {
        let url = API_URL;
        if (idUsuario) {
            url += `?idUsuario=${idUsuario}`;
        }

        const data = await apiFetch<Sucursal>(url, {
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
