import type { Empresa } from "./empresa.interface";

export interface Usuario {
    id_usuario: number;
    cuenta: string;
    password?: string;
    id_persona?: number;
    id_rol?: number;
    status?: boolean;
    fecha_alta?: string;
    fecha_baja?: string;
    fecha_ultima_modificacion?: string;
}

export interface EmpresaUsuario {
    idEmpresaUsuario: number;
    usuario: Usuario;
    empresa: Empresa;
    activo: boolean;
    fechaAlta: string;
}

export interface EmpresaUsuarioForm {
    idEmpresaUsuario: number;
    idUsuario: number;
    idEmpresa: number;
    activo: boolean;
    fechaAlta: string;
}