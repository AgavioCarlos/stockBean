import React from "react";
import { Sucursal } from "../services/SucursalService";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ColDef, RowClickedEvent } from "ag-grid-community"; // Import types directly
import Table from "./Table";
import Swal from "sweetalert2";

interface SucursalesTableProps {
    sucursales: Sucursal[];
    onRowClick: (event: RowClickedEvent) => void;
    onDelete: (id: number, status: boolean) => void;
}

const SucursalesTable: React.FC<SucursalesTableProps> = ({ sucursales, onRowClick, onDelete }) => {

    const ActionsRenderer = (params: any) => {
        const { data } = params;

        const handleDeleteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Estás seguro de que quieres ${data.status ? "desactivar" : "activar"} "${data.nombre}"?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: data.status ? "Sí, desactivar" : "Sí, activar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = data.idSucursal ?? data.id_sucursal;
                    if (id !== undefined) {
                        onDelete(id, !data.status);
                    } else {
                        Swal.fire('Error', 'No se pudo identificar la sucursal.', 'error');
                    }
                }
            });
        };

        return (
            <div className="flex gap-2 justify-center items-center h-full">
                {/* Use generic button style if needed, but keeping edit as simple icon for now or matching delete style?
                   ProductosTable only has Delete. I will style both to look button-like for consistency. */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Call the original onRowClick passed to the Table
                        // But since we are inside a renderer, params.api etc are available.
                        // Ideally we trigger the row click action.
                        // The parent passes onRowClick which expects an event.
                        // We can just simulate it or call a different prop for edit?
                        // For now staying consistent with existing logic: row click opens detail.
                        // So this button just prevents propagation and triggers detail.
                        onRowClick({ data } as any);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    title="Editar"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={handleDeleteClick}
                    className={`${data.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center`}
                    title={data.status ? "Desactivar" : "Activar"}
                >
                    {data.status ? <MdDelete /> : <FaCheck />}
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
        { field: "idSucursal", headerName: "ID", width: 70, sortable: true, filter: true },
        { field: "nombre", headerName: "Nombre", flex: 1, sortable: true, filter: true },
        { field: "direccion", headerName: "Dirección", flex: 2, sortable: true, filter: true },
        { field: "telefono", headerName: "Teléfono", width: 150, sortable: true, filter: true },
        { field: "email", headerName: "Email", width: 200, sortable: true, filter: true },
        { field: "status", headerName: "Estado", width: 120, cellRenderer: StatusRenderer },
        {
            headerName: "Acciones",
            width: 150,
            cellRenderer: ActionsRenderer,
            sortable: false,
            filter: false,
            // Make sure the cell content is centered for buttons
            cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }

        },
    ];

    return (
        <Table
            rowData={sucursales}
            columnDefs={columnDefs}
            onRowClick={onRowClick}
        />
    );
};

export default SucursalesTable;
