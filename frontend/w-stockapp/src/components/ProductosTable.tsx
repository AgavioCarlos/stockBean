import { AgGridReact } from "ag-grid-react";
import { MdDelete } from "react-icons/md";
import type { Productos } from "../interfaces/producto.interface";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Swal from "sweetalert2";

type Props = {
  productos: Productos[];
  onRowClick?: (event: import("ag-grid-community").RowClickedEvent<Productos>) => void;
  onDelete?: (id: number) => void;
};

// Renderer component for the delete button
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

export default function ProductosTable({ productos, onRowClick, onDelete }: Props) {
  return (
    <div className="ag-theme-alpine w-full h-[80vh] bg-white rounded-xl shadow-md p-4  ml-5">
      <AgGridReact
        theme="legacy"
        rowData={productos}
        onRowClicked={onRowClick}
        rowSelection="single"
        columnDefs={[
          {
            field: "id_producto",
            headerName: "ID",
            editable: false,
            filter: false,
          },
          {
            field: "nombre",
            headerName: "Nombre",
            editable: true,
            filter: false,
          },
          {
            field: "descripcion",
            headerName: "Descripcion",
            editable: false,
            filter: false,
          },
          {
            field: "Categoria",
            headerName: "Categoria",
            editable: false,
            filter: false,
          },
          // {
          //   field: "unidad",
          //   headerName: "Unidad",
          //   editable: false,
          //   filter: false,
          // },
          {
            field: "Marca",
            headerName: "Marca",
            editable: false,
            filter: false,
          },
          // {
          //   field: "codigoBarras",
          //   headerName: "Codigo",
          //   editable: false,
          //   filter: false,
          // },
          // {
          //   field: "status",
          //   headerName: "Status",
          //   editable: false,
          //   filter: false,
          // },
          // {
          //   headerName: "",
          //   cellRenderer: DeleteButtonRenderer,
          //   cellRendererParams: {
          //     onDelete: onDelete,
          //   },
          //   width: 120,
          //   editable: false,
          //   filter: false,
          // },
        ]}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: false,
          editable: true,
          floatingFilter: false,
        }}
      />
    </div>
  );
}