import { apiFetch } from "../../services/Api";
import { IPantalla } from "./pantalla.interface";

export async function consultarPantallas() {
    return apiFetch("/pantallas/todas");
}

export async function crearPantalla(data: Partial<IPantalla>): Promise<IPantalla> {
    return apiFetch<IPantalla>("/pantallas", {
        method: "POST",
        body: JSON.stringify(data),
    }) as Promise<IPantalla>;
}

export async function actualizarPantalla(id: number, data: Partial<IPantalla>): Promise<IPantalla> {
    return apiFetch<IPantalla>(`/pantallas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }) as Promise<IPantalla>;
}

export async function eliminarPantalla(id: number, _currentItem?: IPantalla, _newStatus?: boolean): Promise<IPantalla> {
    return apiFetch<IPantalla>(`/pantallas/${id}`, {
        method: "DELETE",
    }) as Promise<IPantalla>;
}
