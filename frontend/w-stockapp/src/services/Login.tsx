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
  const response = await fetch("http://10.225.16.248:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  const result: LoginResponse = await response.json();
  return result;
};
