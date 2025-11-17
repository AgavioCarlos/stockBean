export async function consultarPlanes(){
    const response = await fetch("http://192.168.100.6:8080/planes")
    if(!response.ok) {
        throw new Error("Error al consultar planes");
    }
    return await response.json();
}