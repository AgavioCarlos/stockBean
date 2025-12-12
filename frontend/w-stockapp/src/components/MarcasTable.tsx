import { Marca } from "../interfaces/marca.interface";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Table from "./Table";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";

type Props = {
    marcas: Marca[];
    onRowClick?: (event: import("ag-grid-community").RowClickedEvent<Marca>) => void;
    onDelete?: (id: number) => void;
};

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
                    params.onDelete(params.data.idMarca);
                }
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

export default function MarcasTable({
    marcas,
    onRowClick,
    onDelete,
}: Props) {
    const columnDefs: import("ag-grid-community").ColDef[] = [
        {
            field: "idMarca",
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
            flex: 1.5,
            minWidth: 150,
        },
        {
            field: "fechaAlta",
            headerName: "Fecha",
            editable: false,
            filter: false,
            flex: 1,
            minWidth: 120,
        },
        {
            field: "status",
            headerName: "Activo",
            editable: true,
            filter: false,
            flex: 0.5,
            minWidth: 100,
            cellRenderer: (params: any) => (params.value ? "Sí" : "No"),
        },
        {
            headerName: "Acciones",
            field: "acciones",
            cellRenderer: DeleteButtonRenderer,
            cellRendererParams: {
                onDelete: onDelete,
            },
            flex: 0.5,
            minWidth: 100,
            sortable: false,
            filter: false,
            editable: false,
        },
    ];

    return (
        <Table
            rowData={marcas}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
}
