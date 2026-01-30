import { apiFetch } from "./Api";

export async function consultarRoles(signal?: AbortSignal) {
  return apiFetch("/roles", { signal });
}

export async function consultarProductos(signal?: AbortSignal) {
  console.log("Token en localStorage:", localStorage.getItem("token"));
  return apiFetch("/productos", { signal });
}

export async function crearRol(payload: { nombre: string; descripcion: string }) {
  return apiFetch("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


