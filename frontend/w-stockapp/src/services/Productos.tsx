import { apiFetch } from "./Api";

export async function consultarProductos(signal?: AbortSignal) {
  console.log("Token en localStorage:", localStorage.getItem("token"));
  return apiFetch("http://192.168.100.6:8080/productos", { signal });
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
  return apiFetch("http://192.168.100.6:8080/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function eliminarProducto(id: number) {
  return apiFetch(`http://192.168.100.6:8080/productos/${id}`, {
    method: "DELETE",
  });
}
