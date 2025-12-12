import type { Inventario } from "../services/Inventario";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Swal from "sweetalert2";
import Table from "./Table";
import { MdDelete } from "react-icons/md";

type Props = {
    data: Inventario[];
    onRowClick?: (event: import("ag-grid-community").RowClickedEvent<Inventario>) => void;
    onDelete?: (id: number) => void;
};

// Renderer component for the delete button (internal)
const ActionsRenderer = (params: any) => {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Estás seguro de que deseas eliminar este registro de inventario para "${params.data.producto?.nombre}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                if (params.onDelete) {
                    params.onDelete(params.data.id_inventario);
                }
            }
        });
    };

    return (
        <div className="flex gap-2 justify-center items-center h-full">
            <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center title='Eliminar'"
            >
                <MdDelete />
            </button>
        </div>
    );
};

export default function InventarioTable({
    data,
    onRowClick,
    onDelete,
}: Props) {
    const columnDefs: import("ag-grid-community").ColDef[] = [
        {
            field: "id_inventario",
            headerName: "ID",
            width: 70,
            sortable: true,
            filter: true
        },
        {
            headerName: "Producto",
            field: "producto.nombre",
            flex: 2,
            sortable: true,
            filter: true,
            valueGetter: (params) => {
                return params.data?.producto?.nombre || "";
            }
        },
        {
            headerName: "Sucursal",
            field: "sucursal.nombre",
            flex: 1,
            sortable: true,
            filter: true,
            valueGetter: (params) => {
                return params.data?.sucursal?.nombre || "";
            }
        },
        {
            headerName: "Stock Actual",
            field: "stock_actual",
            flex: 1,
            sortable: true,
            filter: true
        },
        {
            headerName: "Stock Mínimo",
            field: "stock_minimo",
            flex: 1,
            sortable: true,
            filter: true
        },
        {
            headerName: "Acciones",
            width: 100,
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onDelete: onDelete
            },
            sortable: false,
            filter: false,
            cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
        },
    ];

    return (
        <Table
            rowData={data}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
}
