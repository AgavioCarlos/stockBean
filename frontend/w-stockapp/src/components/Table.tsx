import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, RowClickedEvent } from "ag-grid-community";

interface TableProps {
    rowData: any[];
    columnDefs: ColDef[];
    onRowClick?: (event: RowClickedEvent) => void;
    height?: string;
    rowHeight?: number;
    headerHeight?: number;
}

export default function Table({
    rowData,
    columnDefs,
    onRowClick,
    height = "auto",
    rowHeight = 40,
    headerHeight = 45
}: TableProps) {
    return (
        <div
            className={`ag-theme-alpine ${height === 'auto' ? '' : 'h-full'}`}
            style={{ height, width: '100%' }}
        >
            <AgGridReact
                theme="legacy"
                rowData={rowData}
                onRowClicked={onRowClick}
                rowSelection="single"
                domLayout={height === 'auto' ? 'autoHeight' : 'normal'}
                autoSizeStrategy={{
                    type: "fitGridWidth",
                    defaultMinWidth: 50,
                }}
                columnDefs={columnDefs}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                    editable: false,
                    floatingFilter: false,
                    flex: 1,
                }}
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                suppressHorizontalScroll={true}
                animateRows={true}
                enableCellTextSelection={true}
                ensureDomOrder={true}
                overlayNoRowsTemplate={
                    '<div class="p-4 text-gray-500">No hay datos para mostrar</div>'
                }
            />
        </div>
    );
}
