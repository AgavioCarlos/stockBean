export interface Plan {
    id_plan?: number;
    nombre: string;
    descripcion?: string;
    precioMensual?: number;
    precioAnual?: number;
    caracteristicas?: string;
    status: boolean;
    fechaAlta?: string;
    fechaBaja?: string;
    fechaUltimaActualizacion?: string;
}
