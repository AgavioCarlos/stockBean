import React from 'react';
import { DataTable, Column } from '../../../components/DataTable';
import { SharedButton } from '../../../components/SharedButton';
import { IoMdAddCircle } from "react-icons/io";
import type { IPantalla } from '../pantalla.interface';

interface PantallaListProps {
    data: IPantalla[];
    columns: Column<IPantalla>[];
    onRowClick: (item: IPantalla) => void;
    onNew: () => void;
    loading?: boolean;
}

export const PantallaList: React.FC<PantallaListProps> = ({
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
                    <span className="text-xs font-medium text-slate-500" aria-live="polite">Actualizando pantallas…</span>
                </div>
            )}

            <DataTable
                data={data}
                columns={columns}
                onRowClick={onRowClick}
                actionContent={
                    <SharedButton
                        onClick={onNew}
                        variant="primary"
                        size="icon"
                        title="Nueva Pantalla"
                        aria-label="Nueva Pantalla"
                        icon={<IoMdAddCircle size={28} aria-hidden="true" />}
                    />
                }
            />
        </div>
    );
};
