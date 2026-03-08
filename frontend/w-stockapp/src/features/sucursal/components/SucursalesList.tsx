import React from 'react';
import { DataTable, Column } from '../../../components/DataTable';
import { SharedButton } from '../../../components/SharedButton';
import { WithPermission } from '../../../components/WithPermission';
import { IoMdAddCircle } from "react-icons/io";
import { Sucursal } from '../../../interfaces/sucursal.interface';

interface SucursalesListProps {
    data: Sucursal[];
    columns: Column<Sucursal>[];
    onRowClick: (item: Sucursal) => void;
    onNew: () => void;
    loading?: boolean;
}

export const SucursalesList: React.FC<SucursalesListProps> = ({
    data,
    columns,
    onRowClick,
    onNew,
    loading
}) => {
    return (
        <div className="flex flex-col h-full w-full relative">
            {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-2xl transition-all duration-300">
                    <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-2" aria-hidden="true"></div>
                    <span className="text-xs font-medium text-slate-500" aria-live="polite">Actualizando sucursales…</span>
                </div>
            )}

            <DataTable
                data={data}
                columns={columns}
                onRowClick={onRowClick}
                actionContent={
                    <WithPermission screen="sucursales" action="create">
                        <SharedButton
                            onClick={onNew}
                            variant="primary"
                            size="icon"
                            title="Nueva Sucursal"
                            aria-label="Nueva Sucursal"
                            icon={<IoMdAddCircle size={28} aria-hidden="true" />}
                        />
                    </WithPermission>
                }
            />
        </div>
    );
};
