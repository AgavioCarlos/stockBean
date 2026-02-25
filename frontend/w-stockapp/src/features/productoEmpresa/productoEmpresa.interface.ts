import { Productos as IProducto } from "../producto/producto.interface";

export interface IProductoEmpresa {
    idProductoEmpresa?: number;
    producto?: IProducto;
    precioCompra: number;
    precioVenta: number;
    costoPromedio: number;
    manejaInventario: boolean;
    permiteVenta: boolean;
    permiteCompra: boolean;
    activo: boolean;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}
