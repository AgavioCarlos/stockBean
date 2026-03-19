import { apiFetch } from "./Api";

export interface EmpresaDiseno {
    idDiseno?: number;
    idEmpresa?: number;
    colorPrimario: string;
    colorSecundario: string;
    colorAcento: string;
    colorFondo: string;
    urlLogo?: string;
    urlFavicon?: string;
    fuenteFamilia: string;
    estiloBoton: string;
    redondeoComponentes: string;
    temaOscuroHabilitado: boolean;
}

/**
 * Obtiene la configuración de diseño de una empresa por su ID.
 * Si no existe, devuelve null o lanza un error 204.
 */
export async function getDisenoEmpresa(idEmpresa: number): Promise<EmpresaDiseno | null> {
    try {
        const response = await apiFetch<EmpresaDiseno>(`/empresas-diseno/empresa/${idEmpresa}`);
        return response;
    } catch (error) {
        console.error("Error al obtener el diseño de la empresa:", error);
        return null;
    }
}

/**
 * Guarda o actualiza la configuración de diseño de una empresa.
 */
export async function saveDisenoEmpresa(diseno: EmpresaDiseno): Promise<EmpresaDiseno | null> {
    const method = diseno.idDiseno ? "PUT" : "POST";
    const url = diseno.idDiseno 
        ? `/empresas-diseno/empresa/${diseno.idEmpresa}` 
        : "/empresas-diseno";

    return apiFetch<EmpresaDiseno>(url, {
        method,
        body: JSON.stringify(diseno),
    });
}

/**
 * Sube el archivo de logotipo para una empresa y retorna el nombre del archivo guardado.
 */
export async function uploadLogoEmpresa(idEmpresa: number, file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/empresas-diseno/empresa/${idEmpresa}/logo`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
                // No enviar 'Content-Type', fetch lo configura automáticamente con el boundary boundaries multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir el archivo");
        }

        return await response.text();
    } catch (error) {
        console.error("Error en uploadLogoEmpresa:", error);
        return null;
    }
}
