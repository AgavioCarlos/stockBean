import React from 'react';
import Table from './Table';
import { Proveedor } from '../services/Proveedores';

interface ProveedoresTableProps {
    proveedores: Proveedor[];
    onRowClick: (event: any) => void;
}

const ProveedoresTable: React.FC<ProveedoresTableProps> = ({ proveedores, onRowClick }) => {
    const columnDefs = [
        {
            field: "idProveedor",
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
            field: "direccion",
            headerName: "Dirección",
            flex: 1.5,
            minWidth: 200,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 150,
        },
        // No action column, similar to Productos/Unidades style
    ];

    return (
        <Table
            rowData={proveedores}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
};

export default ProveedoresTable;
