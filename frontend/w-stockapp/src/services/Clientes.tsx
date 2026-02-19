import { apiFetch } from "./Api";
export async function consultarClientes() {
    return apiFetch("/clientes");
}
