export interface IPantalla {
    idPantalla?: number;
    clave?: string;
    nombre: string;
    ruta?: string;
    icono?: string;
    orden?: number;
    idPadre?: number | null;
    esMenu: boolean;
    esRoot: boolean;
    status: boolean;
}
