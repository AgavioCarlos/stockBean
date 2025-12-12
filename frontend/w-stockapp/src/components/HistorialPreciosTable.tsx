import { HistorialPrecios } from "../interfaces/historialPrecios.interface";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Table from "./Table";

type Props = {
    datos: HistorialPrecios[];
    onRowClick?: (event: import("ag-grid-community").RowClickedEvent<HistorialPrecios>) => void;
};

export default function HistorialPreciosTable({
    datos,
    onRowClick,
}: Props) {
    const columnDefs: import("ag-grid-community").ColDef[] = [
        {
            field: "idHistorial",
            headerName: "ID",
            flex: 0.5,
            minWidth: 70,
        },
        {
            field: "producto.nombre",
            headerName: "Producto",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "precioAnterior",
            headerName: "Precio Anterior",
            flex: 0.8,
            minWidth: 120,
            valueFormatter: (params) => {
                return params.value ? `$${params.value.toFixed(2)}` : "$0.00";
            }
        },
        {
            field: "precioNuevo",
            headerName: "Precio Actual",
            flex: 0.8,
            minWidth: 120,
            valueFormatter: (params) => {
                return params.value ? `$${params.value.toFixed(2)}` : "$0.00";
            }
        },
        {
            field: "motivo",
            headerName: "Motivo",
            flex: 1.2,
            minWidth: 200,
        },
        {
            field: "fechaCambio",
            headerName: "Fecha Cambio",
            flex: 1,
            minWidth: 150,
            valueFormatter: (params) => {
                if (!params.value) return "";
                return new Date(params.value).toLocaleString();
            }
        }
    ];

    return (
        <Table
            rowData={datos}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
}
