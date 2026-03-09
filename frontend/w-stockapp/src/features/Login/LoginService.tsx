import { apiFetch } from "../../services/Api";
import { LoginData, LoginResponse } from "./login.interface";

export const login = async (data: LoginData): Promise<LoginResponse> => {
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
    throw new Error((err as Error).message || "Error al iniciar sesión");
  }
};
