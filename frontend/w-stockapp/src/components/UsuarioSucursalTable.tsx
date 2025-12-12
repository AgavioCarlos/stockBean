import React from "react";
import { UsuarioSucursal } from "../services/UsuarioSucursalService";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import Table from "./Table";
import Swal from "sweetalert2";

interface UsuarioSucursalTableProps {
    data: UsuarioSucursal[];
    onRowClick: (event: RowClickedEvent) => void;
    onDelete: (id: number) => void;
}

const UsuarioSucursalTable: React.FC<UsuarioSucursalTableProps> = ({ data, onRowClick, onDelete }) => {

    const ActionsRenderer = (params: any) => {
        const { data } = params;
        const handleDeleteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Estás seguro de que deseas eliminar la asignación?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    onDelete(data.idUsuarioSucursal);
                }
            });
        };

        return (
            <div className="flex gap-2 justify-center items-center h-full">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRowClick({ data } as any);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    title="Editar"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={handleDeleteClick}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    title="Eliminar"
                >
                    <MdDelete />
                </button>
            </div>
        );
    };

    const StatusRenderer = (params: any) => {
        return params.value ? (
            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded flex items-center w-fit gap-1">
                <FaCheck size={10} /> Activo
            </span>
        ) : (
            <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded flex items-center w-fit gap-1">
                <FaTimes size={10} /> Inactivo
            </span>
        );
    };

    const columnDefs: ColDef[] = [
        { field: "idUsuarioSucursal", headerName: "ID", width: 70, sortable: true, filter: true },
        {
            headerName: "Usuario",
            field: "usuario.cuenta",
            valueGetter: (params) => {
                const u = params.data?.usuario;
                if (!u) return "";
                return `${u.persona.nombre} ${u.persona.apellidoPaterno} (${u.cuenta})`;
            },
            flex: 2,
            sortable: true,
            filter: true
        },
        {
            headerName: "Sucursal",
            field: "sucursal.nombre",
            flex: 1,
            sortable: true,
            filter: true
        },
        { field: "status", headerName: "Estado", width: 120, cellRenderer: StatusRenderer },
        {
            headerName: "Acciones",
            width: 150,
            cellRenderer: ActionsRenderer,
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
};

export default UsuarioSucursalTable;
