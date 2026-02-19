/**
 * Servicio para gestionar planes y suscripciones
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Obtener todos los planes disponibles
 */
export async function consultarPlanes() {
    const response = await fetch(`${API_BASE_URL}/planes`);
    if (!response.ok) {
        throw new Error("Error al consultar planes");
    }
    return await response.json();
}

/**
 * Activar suscripción a un plan después de un pago exitoso
 * @param idPlan - ID del plan contratado
 * @param metodoPago - Método de pago utilizado (PayPal, Tarjeta, etc.)
 * @param ciclo - Ciclo de facturación (mensual o anual)
 */
export async function activarSuscripcion(
    idPlan: number,
    metodoPago: string,
    ciclo: 'monthly' | 'annual'
) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/suscripciones/activar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            id_plan: idPlan,
            metodo_pago: metodoPago,
            ciclo_facturacion: ciclo
        }),
    });

    if (!response.ok) {
        throw new Error("Error al activar suscripción");
    }

    return await response.json();
}

/**
 * Obtener suscripción activa del usuario
 */
export async function obtenerSuscripcionActiva() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/suscripciones/activa`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null; // No tiene suscripción activa
        }
        throw new Error("Error al obtener suscripción");
    }

    return await response.json();
}

/**
 * Cancelar suscripción activa
 */
export async function cancelarSuscripcion() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/suscripciones/cancelar`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error("Error al cancelar suscripción");
    }

    return await response.json();
}