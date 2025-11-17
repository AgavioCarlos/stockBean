export interface LoginData {
  cuenta: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  id_usuario: number;
  cuenta: string;
  mensaje: string;
  token: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch("http://192.168.100.6:8080/auth/login", {
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
