import { apiFetch } from "./Api";
import type { IInventario } from "../interfaces/inventario.interface";

const ENDPOINT = "/inventario";

export const consultarInventario = async (idUsuario: number, idSucursal: number): Promise<IInventario[]> => {
    return await apiFetch<IInventario[]>(`${ENDPOINT}?idUsuario=${idUsuario}&idSucursal=${idSucursal}`) || [];
};

export const crearInventario = async (data: Partial<IInventario>, idUsuario: number): Promise<IInventario> => {
    // data.sucursal should be set, but we pass idUsuario in query param
    return await apiFetch<IInventario>(`${ENDPOINT}?idUsuario=${idUsuario}`, {
        method: "POST",
        body: JSON.stringify(data),
    }) as IInventario;
};

export const actualizarInventario = async (id: number, data: Partial<IInventario>, idUsuario: number): Promise<IInventario> => {
    // Ensure ID is in the payload for the backend to recognize it as an update
    const payload = { ...data, id_inventario: id };
    return await apiFetch<IInventario>(`${ENDPOINT}/${id}?idUsuario=${idUsuario}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    }) as IInventario;
};

export const eliminarInventario = async (id: number, idUsuario: number): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/${id}?idUsuario=${idUsuario}`, {
        method: "DELETE",
    });
};
