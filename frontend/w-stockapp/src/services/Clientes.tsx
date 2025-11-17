import { apiFetch } from "./Api";
export async function consultarClientes() {
    return apiFetch("http://localhost:8080/clientes");
}
