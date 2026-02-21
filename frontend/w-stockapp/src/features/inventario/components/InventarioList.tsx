import React from 'react';
import { DataTable, Column } from '../../../components/DataTable';
import { BranchFilter } from '../../../components/BranchFilter';
import { IoMdAddCircle } from "react-icons/io";
import { IInventario } from '../inventario.interface';
import { StatusBadge, StockBadge } from '../../../components/StatusBadge';

interface InventarioListProps {
    data: IInventario[];
    columns: Column<IInventario>[];
    onRowClick: (item: IInventario) => void;
    onNew: () => void;
    idSucursal: number | "";
    onBranchChange: (id: number | "") => void;
    loading?: boolean;
}

export const InventarioList: React.FC<InventarioListProps> = ({
    data,
    columns,
    onRowClick,
    onNew,
    idSucursal,
    onBranchChange,
    loading
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <BranchFilter
                    onBranchChange={onBranchChange}
                    value={idSucursal}
                />

                <div className="mt-4 md:mt-0">
                    <button
                        onClick={onNew}
                        disabled={!idSucursal}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium ${!idSucursal
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        <IoMdAddCircle size={20} />
                        <span>Nuevo</span>
                    </button>
                </div>
            </div>

            <div className="mt-2 relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-lg transition-all duration-300">
                        <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                        <span className="text-xs font-medium text-slate-500">Actualizando inventario…</span>
                    </div>
                )}
                <DataTable
                    data={data}
                    columns={columns}
                    title="Listado de Stock"
                    onRowClick={onRowClick}
                />
            </div>
        </div>
    );
};
