import { apiFetch } from "./Api";

export async function consultarProductos(signal?: AbortSignal) {
  console.log("Token en localStorage:", localStorage.getItem("token"));
  return apiFetch("/productos", { signal });
}

export async function crearProducto(payload: {
  nombre: string;
  descripcion: string;
  idCategoria: number | null;
  idUnidad: number | null;
  idMarca: number | null;
  imagenUrl: string;
  codigoBarras: string;
  status: boolean;
}) {
  return apiFetch("/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function actualizarProducto(id_producto: number, payload: {
  nombre: string;
  descripcion: string;
  idCategoria: number | null;
  idUnidad: number | null;
  idMarca: number | null;
  codigoBarras: string;
  imagenUrl: string;
  status: boolean;
}) {
  return apiFetch(`/productos/${id_producto}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}


export async function eliminarProducto(id: number) {
  return apiFetch(`/productos/${id}`, {
    method: "DELETE",
  });
}
