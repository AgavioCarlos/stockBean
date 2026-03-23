export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Unidad {
  idUnidad: number;
  nombre: string;
  abreviatura?: string;
}

export interface Marca {
  idMarca: number;
  nombre: string;
}

export interface Productos {
  id_producto: number;
  nombre: string;
  descripcion: string;
  categoria?: Categoria;
  idCategoria?: number;
  unidad?: Unidad;
  idUnidad?: number;
  marca?: Marca;
  idMarca?: number;
  codigoBarras: string;
  imagenUrl: string;
  status: boolean;
  idEmpresa?: number;
  fechaAlta?: string | Date;
  fechaUltimaModificacion?: string | Date;
}