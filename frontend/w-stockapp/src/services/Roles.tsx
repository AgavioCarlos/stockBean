import { apiFetch } from "./Api";

export async function consultarRoles() {
  return apiFetch("http://localhost:8080/roles");
}

export async function crearRol(payload: { nombre: string; descripcion: string }) {
  return apiFetch("http://localhost:8080/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


