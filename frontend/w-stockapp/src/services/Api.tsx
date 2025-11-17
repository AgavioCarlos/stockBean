export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    
    
    const headers =  {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };

    console.log("Headers que se enviarán:", headers);
    
    const response = await fetch(url, {
        ...options,
        headers,
    });
    
    if (response.status === 401) {
        // localStorage.removeItem("token");
        // throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }
    
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

