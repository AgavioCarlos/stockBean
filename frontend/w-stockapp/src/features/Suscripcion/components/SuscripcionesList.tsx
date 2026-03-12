import React from "react";
import { SuscripcionAdmin } from "../suscripciones.interface";
import { DataTable, Column } from "../../../components/DataTable";

interface SuscripcionesListProps {
    data: SuscripcionAdmin[];
    columns: Column<SuscripcionAdmin>[];
    onRowClick: (item: SuscripcionAdmin) => void;
    loading?: boolean;
}

export const SuscripcionesList: React.FC<SuscripcionesListProps> = ({ data, columns, onRowClick, loading }) => {
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
