import { apiFetch } from "../../services/Api";
import { Plan } from "../../interfaces/plan.interface";

export async function consultarPlanes(signal?: AbortSignal) {
    return apiFetch("/planes", { signal });
}

export async function crearPlan(payload: {
    nombre: string;
    descripcion?: string;
    precioMensual: number;
    precioAnual: number;
    caracteristicas?: string;
    status: boolean;
}) {
    return apiFetch("/planes", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function actualizarPlan(id_plan: number, payload: {
    nombre: string;
    descripcion?: string;
    precioMensual: number;
    precioAnual: number;
    caracteristicas?: string;
    status: boolean;
}) {
    return apiFetch(`/planes/${id_plan}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function eliminarPlan(id: number, currentItem: any, newStatus: boolean) {
    return actualizarPlan(id, { ...currentItem, status: newStatus });
}
