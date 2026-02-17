export async function consultarPlanes(){
    const response = await fetch("http://10.225.16.51:8080/planes")
    if(!response.ok) {
        throw new Error("Error al consultar planes");
    }
    return await response.json();
}