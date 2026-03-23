import React, { useState, useEffect, useMemo } from 'react';
import { Categoria } from '../../../interfaces/categoria.interface';
import { consultarAsignadas, consultarDisponibles, asignarCategoria, desasignarCategoria } from '../EmpresaCategoriaService';
import { SearchableSelect } from '../../../components/SearchableSelect';
import { DataTable, Column } from '../../../components/DataTable';
import { SharedButton } from '../../../components/SharedButton';
import { useNotifications } from '../../../hooks/useNotifications';
import { SectionHeader, EmptyState, LoadingOverlay } from '../../../components/ui';
import { IoIosTrash } from 'react-icons/io';
import { MdLabel } from 'react-icons/md';

/**
 * Componente para asignar categorías maestras a una empresa específica.
 * ⚠️ Componente HIJO — no usa PageContainer porque el layout
 * ya está provisto por Categorias.tsx (su componente padre).
 */
export const AsignacionCategoria: React.FC<{ idEmpresa: number }> = ({ idEmpresa }) => {
    const [asignadas, setAsignadas] = useState<Categoria[]>([]);
    const [disponibles, setDisponibles] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoria, setSelectedCategoria] = useState<number | string>("");

    const { success, error, confirm, notifyError } = useNotifications();

    const fetchData = async () => {
        if (!idEmpresa) return;
        setLoading(true);
        try {
            const [asig, disp] = await Promise.all([
                consultarAsignadas(idEmpresa),
                consultarDisponibles(idEmpresa)
            ]);
            setAsignadas(asig);
            setDisponibles(disp);
        } catch (err) {
            console.error("Error cargando categorías:", err);
            notifyError('No se pudieron cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idEmpresa) fetchData();
    }, [idEmpresa]);

    const handleAsignar = async (value: string | number) => {
        if (!value) return;
        try {
            await asignarCategoria(idEmpresa, Number(value));
            success('Agregada', 'Categoría asignada correctamente.');
            setSelectedCategoria("");
            fetchData();
        } catch (err) {
            console.error("Error al asignar:", err);
            error('Error', 'Ocurrió un error al asignar la categoría.');
        }
    };

    const handleDesasignar = async (cat: Categoria) => {
        const isConfirmed = await confirm(
            '¿Estás seguro?',
            `Se desvinculará la categoría "${cat.nombre}" de tu empresa.`,
            'Sí, remover',
            'No, cancelar'
        );

        if (isConfirmed) {
            try {
                await desasignarCategoria(idEmpresa, cat.idCategoria);
                success('Removida', 'La categoría fue removida.');
                fetchData();
            } catch (err) {
                console.error("Error al remover:", err);
                error('Error', 'No se pudo remover la categoría.');
            }
        }
    };

    const options = useMemo(() =>
        disponibles.map(d => ({
            value: d.idCategoria,
            label: d.nombre,
            description: `ID: ${d.idCategoria}`
        })),
        [disponibles]
    );

    const columnas = useMemo<Column<Categoria>[]>(() => [
        {
            key: "nombre",
            label: "Nombre de Categoría",
            sortable: true,
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-empresa-primario/10 text-empresa-primario flex items-center justify-center">
                        <MdLabel size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{String(val)}</span>
                </div>
            )
        },
        {
            key: "idCategoria",
            label: "Acciones",
            render: (_, item) => (
                <SharedButton
                    variant="danger"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleDesasignar(item); }}
                    icon={<IoIosTrash size={20} />}
                    title="Remover categoría"
                />
            )
        }
    ], [idEmpresa]);

    return (
        <div className="bg-white rounded-card shadow-card border border-empresa overflow-hidden flex flex-col">
            <SectionHeader
                title="Categorías de la Empresa"
                subtitle="Gestiona las categorías de productos disponibles para tu sucursal."
                className="px-6 pt-6 border-none mb-0"
                actions={
                    <div className="w-full lg:w-80">
                        <SearchableSelect
                            options={options}
                            value={selectedCategoria}
                            onChange={handleAsignar}
                            placeholder="Buscar nuevas categorías..."
                            loading={loading}
                        />
                    </div>
                }
            />

            <div className="flex-1 overflow-hidden relative min-h-[400px] p-6 pt-2">
                {loading && <LoadingOverlay message="Actualizando categorías..." />}

                {!loading && asignadas.length === 0 ? (
                    <EmptyState
                        icon={<MdLabel size={32} />}
                        title="Sin Categorías"
                        description="Aún no tienes categorías asignadas a tu empresa. Utiliza el buscador superior para agregar una."
                    />
                ) : (
                    <DataTable
                        data={asignadas}
                        columns={columnas}
                        onRowClick={() => { }}
                    />
                )}
            </div>
        </div>
    );
};
