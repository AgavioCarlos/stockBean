import { apiFetch } from "../../services/Api";
import type { IUsuario } from "./usuario.interface";

const ENDPOINT = "/usuarios";

export const consultarUsuarios = async (): Promise<IUsuario[]> => {
    return await apiFetch<IUsuario[]>(`${ENDPOINT}/mis-usuarios`) || [];
};

export const consultarUsuario = async (id: number): Promise<IUsuario> => {
    return await apiFetch<IUsuario>(`${ENDPOINT}/${id}`) as IUsuario;
};

export const crearUsuario = async (data: Partial<IUsuario>): Promise<IUsuario> => {
    return await apiFetch<IUsuario>(`${ENDPOINT}/crear`, {
        method: "POST",
        body: JSON.stringify(data),
    }) as IUsuario;
};

export const actualizarUsuario = async (id: number, data: Partial<IUsuario>): Promise<IUsuario> => {
    return await apiFetch<IUsuario>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }) as IUsuario;
};

export const eliminarUsuario = async (id: number, currentUsuario: IUsuario, newStatus: boolean): Promise<IUsuario> => {
    return await apiFetch<IUsuario>(`${ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...currentUsuario, status: newStatus }),
    }) as IUsuario;
};
