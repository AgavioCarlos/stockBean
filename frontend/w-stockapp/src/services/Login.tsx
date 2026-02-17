import { apiFetch } from "./Api";

export interface LoginData {
  cuenta: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  id_usuario: number;
  cuenta: string;
  id_rol: number;
  fecha_alta: string;
  id_persona?: number;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  email?: string;
  status?: boolean;
  mensaje: string;
  token: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  // Usamos apiFetch para respetar baseURL y añadir token si existe
  try {
    const result = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!result) {
      throw new Error("Respuesta vacía del servidor al iniciar sesión");
    }

    return result as LoginResponse;
  } catch (err) {
    // Re-lanzamos con mensaje genérico para que la UI lo muestre
    throw new Error((err as Error).message || "Error al iniciar sesión");
  }
};
