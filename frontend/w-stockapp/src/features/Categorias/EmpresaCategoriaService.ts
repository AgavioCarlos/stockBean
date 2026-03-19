import { apiFetch } from "../../services/Api";
import { Categoria } from "../../interfaces/categoria.interface";

export async function consultarAsignadas(idEmpresa: number): Promise<Categoria[]> {
    const res = await apiFetch<Categoria[]>(`/empres-categorias/asignacion?idEmpresa=${idEmpresa}`);
    return res || [];
}

export async function consultarDisponibles(idEmpresa: number): Promise<Categoria[]> {
    const res = await apiFetch<Categoria[]>(`/empres-categorias/disponibles?idEmpresa=${idEmpresa}`);
    return res || [];
}

export async function asignarCategoria(idEmpresa: number, idCategoria: number): Promise<Categoria> {
    const res = await apiFetch<Categoria>("/empres-categorias/asignar", {
        method: "POST",
        body: JSON.stringify({ idEmpresa, idCategoria }),
    });
    if (!res) throw new Error("No response from server");
    return res;
}

export async function desasignarCategoria(idEmpresa: number, idCategoria: number): Promise<void> {
    await apiFetch<void>("/empres-categorias/desasignar", {
        method: "POST",
        body: JSON.stringify({ idEmpresa, idCategoria }),
    });
}
