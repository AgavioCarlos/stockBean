export async function consultarPersonas(signal?: AbortSignal) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://192.168.100.6:8080/personas", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
    });
     if (response.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
  }
    if (!response.ok) {
        const msg = await response.text().catch(() => "");
        throw new Error(msg || "Error al consultar categorías");
    }
  return response.json();
}

export async function consultarPersona() {
    const id = localStorage.getItem('id_persona');
    if (!id) {
        throw new Error('id_persona no encontrado en localStorage');
    }

    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/persona/${id}`, { headers });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Error al consultar persona: ${response.status} ${body}`);
    }
    return await response.json();
}
