export interface Categoria {
  idCategoria: number;
  nombre: string;
}

export interface Unidad {
  idUnidad: number;
  nombre: string;
  abreviatura: string;
  fechaAlta: Date;
  fechaBaja: Date;
  fechaUltimaModificacion: Date;
}

export interface Marca {
  idMarca: number;
  nombre: string;
}

export interface Productos {
  id_producto: number;
  nombre: string;
  descripcion: string;
  Categoria: Categoria[];
  Unidad: Unidad[];
  Marca: Marca[];
  codigoBarras: string;
  imagenUrl: string;
  status: boolean;
}