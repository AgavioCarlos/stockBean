const BASE_URL = import.meta.env.VITE_URL || "http://10.225.16.51:8080"

export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T | null> {
    const token = localStorage.getItem("token");

    const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
    const finalUrl = isAbsolute ? url : `${BASE_URL}${url}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    // Añadir Authorization solo si existe token
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(finalUrl, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

