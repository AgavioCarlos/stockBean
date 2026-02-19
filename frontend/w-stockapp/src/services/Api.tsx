console.log("🔥 USANDO Api.ts");
// const BASE_URL = import.meta.env.VITE_URL || "http://10.225.16.248:8080"
const BASE_URL = import.meta.env.VITE_API_URL || "";


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
        // logout();
    }

    if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.mensaje) {
                errorMessage = errorBody.mensaje;
            }
        } catch (e) {
            // Ignorar error de parsing, usar mensaje por defecto
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

