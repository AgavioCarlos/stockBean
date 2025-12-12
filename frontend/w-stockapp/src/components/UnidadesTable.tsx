import { Unidad } from "../interfaces/producto.interface";
import Table from "./Table";

interface UnidadesTableProps {
    unidades: Unidad[];
    onRowClick: (event: any) => void;
    onDelete?: (id: number) => void;
}

const UnidadesTable: React.FC<UnidadesTableProps> = ({ unidades, onRowClick }) => {
    const columnDefs = [
        {
            field: "idUnidad",
            headerName: "ID",
            flex: 0.5,
            minWidth: 70,
        },
        {
            field: "nombre",
            headerName: "Nombre",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "abreviatura",
            headerName: "Abreviatura",
            flex: 1,
            minWidth: 120,
        },
        // Action column removed to match Productos style
    ];

    return (
        <Table
            rowData={unidades}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
};

export default UnidadesTable;
