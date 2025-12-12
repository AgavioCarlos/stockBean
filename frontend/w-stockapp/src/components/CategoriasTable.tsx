import { Categoria } from "../interfaces/categoria.interface";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Table from "./Table";

type Props = {
    categorias: Categoria[];
    onRowClick?: (event: import("ag-grid-community").RowClickedEvent<Categoria>) => void;
    onDelete?: (id: number) => void;
};



export default function CategoriasTable({
    categorias,
    onRowClick,
    onDelete,
}: Props) {
    const columnDefs: import("ag-grid-community").ColDef[] = [
        {
            field: "idCategoria",
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
    ];

    return (
        <Table
            rowData={categorias}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
}
