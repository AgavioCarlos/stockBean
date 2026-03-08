export interface PermisoDetalle {
    idPermiso: number;
    nombre: string;
    asignado: boolean;
}

export interface JerarquiaPermiso {
    idPantalla: number;
    nombrePantalla: string;
    ruta?: string;
    clave?: string;
    icono?: string;
    permisos: PermisoDetalle[];
}

export interface PantallaAsignacion {
    idPantalla: number;
    nombre: string;
    ruta?: string;
    moduloPadre?: string;
    asignado: boolean;
}

export interface PermisoSistema {
    idPermiso: number;
    nombre: string;
    descripcion?: string;
}

export interface RolAsignacion {
    idRol: number;
    nombre: string;
    descripcion: string;
    asignado: boolean;
}
