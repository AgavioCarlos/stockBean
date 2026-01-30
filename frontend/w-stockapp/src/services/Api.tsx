console.log("🔥 USANDO Api.ts");
// const BASE_URL = import.meta.env.VITE_URL || "http://10.225.16.248:8080"
const BASE_URL = import.meta.env.VITE_API_URL || "http://10.225.16.248:8080";


export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T | null> {
    const token = localStorage.getItem("token");

    const isAbsolute = url.startsWith("http://") || url.startsWith("https://");
    const finalUrl = isAbsolute ? url : `${BASE_URL}${url}`;

    const headers = {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };

    console.log("Headers que se enviarán:", headers);

    const response = await fetch(finalUrl, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // logout();
    }

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
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

