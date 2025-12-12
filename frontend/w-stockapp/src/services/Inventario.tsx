import { apiFetch } from "./Api";

export interface Inventario {
    id_inventario?: number;
    producto: {
        id_producto: number;
        nombre?: string;
        codigoBarras?: string;
    };
    sucursal: {
        idSucursal?: number;
        id_sucursal?: number; // Alias for safety
        nombre?: string;
    };
    stock_actual: number;
    stock_minimo: number;
    status: boolean;
}

const ENDPOINT = "/inventario";

export const consultarInventario = async (): Promise<Inventario[]> => {
    return await apiFetch<Inventario[]>(ENDPOINT) || [];
};

export const crearInventario = async (data: Partial<Inventario>): Promise<Inventario> => {
    return await apiFetch<Inventario>(ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
    }) as Inventario;
};

export const actualizarInventario = async (id: number, data: Partial<Inventario>): Promise<Inventario> => {
    // Ensure ID is in the payload for the backend to recognize it as an update
    const payload = { ...data, id_inventario: id };
    return await apiFetch<Inventario>(ENDPOINT, {
        method: "PUT",
        body: JSON.stringify(payload),
    }) as Inventario;
};

export const eliminarInventario = async (id: number): Promise<void> => {
    await apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: "DELETE",
    });
};
