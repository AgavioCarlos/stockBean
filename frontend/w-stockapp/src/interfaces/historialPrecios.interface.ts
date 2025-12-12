import { Productos } from "./producto.interface";

export interface HistorialPrecios {
    idHistorial?: number;
    producto: Productos;
    precioAnterior: number;
    precioNuevo: number;
    idTipoPrecio: number;
    usuario?: any; // Define Usuario interface if available, or keep as any for now
    motivo: string;
    fechaCambio?: string;
    fechaAlta?: string;
    fechaBaja?: string;
    fechaUltimaModificacion?: string;
}
