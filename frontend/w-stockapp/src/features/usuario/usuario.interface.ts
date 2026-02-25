export interface IPersona {
    id_persona?: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    status: boolean;
    fecha_alta?: string;
}

export interface IUsuario {
    id_usuario?: number;
    persona: IPersona;
    cuenta: string;
    id_rol: number;
    status: boolean;
    password?: string;
}
