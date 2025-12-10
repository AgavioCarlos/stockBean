import type { Productos } from "../interfaces/producto.interface";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Swal from "sweetalert2";
import Table from "./Table";
import { MdDelete } from "react-icons/md";


type Props = {
  productos: Productos[];
  onRowClick?: (event: import("ag-grid-community").RowClickedEvent<Productos>) => void;
  onDelete?: (id: number) => void;
  categorias?: any[];
  marcas?: any[];
  unidades?: any[];
};

// Renderer component for the delete button (código sin cambios)
const DeleteButtonRenderer = (params: any) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Estás seguro de que quieres eliminar "${params.data.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (params.onDelete) {
          params.onDelete(params.data.id_producto);
        }
        Swal.fire({
          title: "Eliminado",
          text: `"${params.data.nombre}" ha sido eliminado correctamente.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
      type="button"
      onClick={handleClick}
    >
      <MdDelete />
    </button>
  );
};

export default function ProductosTable({
  productos,
  onRowClick,
  onDelete,
  categorias = [],
  marcas = [],
  unidades = [],
}: Props) {
  const columnDefs: import("ag-grid-community").ColDef[] = [
    {
      field: "id_producto",
      headerName: "ID",
      editable: false,
      filter: false,
      flex: 0.5,
      minWidth: 70,
    },
    {
      field: "nombre",
      headerName: "Nombre",
      editable: true,
      filter: false,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      editable: false,
      filter: false,
      flex: 1.2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: "Categoria",
      headerName: "Categoria",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        // Try to get from nested object first (if backend returns populate)
        if (params.data.Categoria && params.data.Categoria.length > 0) return params.data.Categoria[0].nombre;

        // Otherwise look up ID in catalogo list
        const id = typeof params.data.categoria === 'number' ? params.data.categoria : params.data.idCategoria;
        if (!id) return "";
        const cat = categorias.find((c: any) => c.id_categoria === id || c.id === id);
        return cat ? cat.nombre : "";
      }
    },
    {
      field: "Marca",
      headerName: "Marca",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        if (params.data.Marca && params.data.Marca.length > 0) return params.data.Marca[0].nombre;

        const id = typeof params.data.marca === 'number' ? params.data.marca : params.data.idMarca;
        if (!id) return "";
        const marcaItem = marcas.find((m: any) => m.id_marca === id || m.id === id);
        return marcaItem ? marcaItem.nombre : "";
      }
    },
    {
      field: "Unidad",
      headerName: "Unidad",
      editable: false,
      filter: false,
      flex: 0.8,
      minWidth: 120,
      valueGetter: (params: any) => {
        if (!params.data) return "";
        if (params.data.Unidad && params.data.Unidad.length > 0) return params.data.Unidad[0].nombre;

        const id = typeof params.data.unidad === 'number' ? params.data.unidad : params.data.idUnidad;
        if (!id) return "";
        const u = unidades.find((item: any) => item.id_unidad === id || item.id === id);
        return u ? u.nombre : "";
      }
    },
  ];

  return (
    <Table
      rowData={productos}
      columnDefs={columnDefs}
      onRowClick={onRowClick}
    />
  );
}