import React, { useState, useEffect, useMemo } from 'react';
import { Categoria } from '../../../interfaces/categoria.interface';
import { consultarAsignadas, consultarDisponibles, asignarCategoria, desasignarCategoria } from '../EmpresaCategoriaService';
import { SearchableSelect } from '../../../components/SearchableSelect';
import { DataTable, Column } from '../../../components/DataTable';
import Swal from 'sweetalert2';
import { SharedButton } from '../../../components/SharedButton';
import { IoIosTrash } from 'react-icons/io';
import { MdLabel } from 'react-icons/md';

export const AsignacionCategorias: React.FC<{ idEmpresa: number }> = ({ idEmpresa }) => {
    const [asignadas, setAsignadas] = useState<Categoria[]>([]);
    const [disponibles, setDisponibles] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoria, setSelectedCategoria] = useState<number | string>("");

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
        } catch (error) {
            console.error("Error cargando categorías:", error);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudieron cargar las categorías' });
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
            Swal.fire({ icon: 'success', title: 'Agregada', text: 'Categoría asignada correctamente.', timer: 1500, showConfirmButton: false });
            setSelectedCategoria("");
            fetchData();
        } catch (error) {
            console.error("Error al asignar:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al asignar la categoría.' });
        }
    };

    const handleDesasignar = async (cat: Categoria) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se desvinculará la categoría "${cat.nombre}" de tu empresa.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, remover',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await desasignarCategoria(idEmpresa, cat.idCategoria);
                Swal.fire({ icon: 'success', title: 'Removida', text: 'La categoría fue removida.', timer: 1500, showConfirmButton: false });
                fetchData();
            } catch (error) {
                console.error("Error al remover:", error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo remover la categoría.' });
            }
        }
    };

    const options = useMemo(() => {
        return disponibles.map(d => ({
            value: d.idCategoria,
            label: d.nombre,
            description: `ID: ${d.idCategoria}`
        }));
    }, [disponibles]);

    const columnas = useMemo<Column<Categoria>[]>(() => [
        {
            key: "nombre",
            label: "Nombre de Categoría",
            sortable: true,
            render: (val) => (
                <div className="flex items-center gap-2">
                    <MdLabel className="text-blue-500" />
                    <span className="font-bold text-gray-800">{String(val)}</span>
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
        <div className="flex flex-col gap-8 h-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-800 tracking-tight">Mis Categorías</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Utiliza el buscador para agregar categorías maestras al inventario de tu empresa.
                    </p>
                </div>
                <div className="w-full lg:w-96">
                    <SearchableSelect
                        options={options}
                        value={selectedCategoria}
                        onChange={handleAsignar}
                        placeholder="Buscar nuevas categorías..."
                        loading={loading}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : null}

                {asignadas.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center h-full border border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4">
                            <MdLabel size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Sin Categorías</h3>
                        <p className="text-sm text-gray-500 max-w-sm mt-2">
                            Aún no has asignado ninguna categoría a tu empresa. Utiliza el buscador superior para agregar las que necesites.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        data={asignadas}
                        columns={columnas}
                        onRowClick={() => { }} // No edit action for enterprise
                    />
                )}
            </div>
        </div>
    );
};
