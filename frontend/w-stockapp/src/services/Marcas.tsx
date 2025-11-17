import { apiFetch} from "./Api";
export async function consultarMarcas() {
    return apiFetch("http://192.168.100.6:8080/marcas");
}
