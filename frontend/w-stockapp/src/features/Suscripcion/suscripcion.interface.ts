export interface SuscripcionAdmin {
    idSuscripcion: number;
    idUsuario: number;
    nombreCompleto: string;
    email: string;
    idEmpresa?: number;
    nombreEmpresa?: string;
    planNombre: string;
    fechaInicio: string;
    fechaFin: string;
    statusSuscripcion: boolean;
}

export interface Sucursal {
    id_sucursal: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    status: boolean;
}
