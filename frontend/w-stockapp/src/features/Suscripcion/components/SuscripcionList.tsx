import React from "react";
import { SuscripcionAdmin } from "../suscripcion.interface";
import { DataTable, Column } from "../../../components/DataTable";

interface SuscripcionListProps {
    data: SuscripcionAdmin[];
    columns: Column<SuscripcionAdmin>[];
    onRowClick: (item: SuscripcionAdmin) => void;
    loading?: boolean;
}

export const SuscripcionList: React.FC<SuscripcionListProps> = ({ data, columns, onRowClick, loading }) => {
    return (
        <div className="p-4">
            <DataTable
                data={data}
                columns={columns}
                onRowClick={onRowClick}
                searchPlaceholder="Buscar por empresa o plan..."
                loading={loading}
            />
        </div>
    );
};
