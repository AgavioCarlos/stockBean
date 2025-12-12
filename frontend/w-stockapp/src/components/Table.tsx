import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, RowClickedEvent } from "ag-grid-community";

interface TableProps {
    rowData: any[];
    columnDefs: ColDef[];
    onRowClick?: (event: RowClickedEvent) => void;
    height?: string;
}

export default function Table({
    rowData,
    columnDefs,
    onRowClick,
    height = "auto",
}: TableProps) {
    return (
        <div
            className={`ag-theme-material ${height === 'auto' ? '' : 'h-full'}`}
            style={{ height }}
        >
            <AgGridReact
                theme="legacy"
                rowData={rowData}
                onRowClicked={onRowClick}
                rowSelection="single"
                domLayout="autoHeight"
                autoSizeStrategy={{
                    type: "fitGridWidth",
                    defaultMinWidth: 50,
                }}
                columnDefs={columnDefs}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                    editable: true,
                    floatingFilter: false,
                }}
                overlayNoRowsTemplate={
                    '<div class="p-4 text-gray-500">No hay datos para mostrar</div>'
                }
            />
        </div>
    );
}
