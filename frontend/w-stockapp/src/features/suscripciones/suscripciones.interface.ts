export interface SuscripcionAdmin {
    idSuscripcion: number;
    idEmpresa: number;
    razonSocial: string;
    nombreComercial: string;
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
