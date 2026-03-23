import React, { useState, useEffect } from 'react';
import Tabs from "../../../components/Tabs";
import { consultarCategorias, crearCategoria, actualizarCategoria } from "../../../services/Categoria";
import { Categoria } from "../../../interfaces/categoria.interface";
import CategoriasDetalle from "./CategoriasDetalle";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import Swal from 'sweetalert2';
import { DataTable, type Column } from "../../../components/DataTable";
import { SharedButton, PdfButton, ExcelButton } from "../../../components/SharedButton";
import StatusFilter from "../../../components/StatusFilter";
import { StatusBadge } from "../../../components/StatusBadge";

export const CategoriasGlobales: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState("lista");

    const [rowDataFiltrada, setRowDataFiltrada] = useState<Categoria[]>([]);
    const [filtroEstado, setFiltroEstado] = useState(true);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
    const [nombre, setNombre] = useState('');
    const [status, setStatus] = useState(true);

    useEffect(() => {
        consultarCategorias()
            .then((data: Categoria[]) => {
                setCategorias(data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar categorias:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let datosFiltrados = categorias || [];
        datosFiltrados = datosFiltrados.filter((item) => Boolean(item.status) === filtroEstado);
        setRowDataFiltrada(datosFiltrados);
    }, [filtroEstado, categorias]);

    const handleFiltrarEstado = (valor: boolean) => {
        setFiltroEstado(valor);
    };

    const handleRowClick = (c: Categoria) => {
        setCategoriaSeleccionada(c);
        setNombre(c.nombre);
        setStatus(c.status);
        setVista("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setCategoriaSeleccionada(null);
        setNombre("");
        setStatus(true);
        setVista("detalle");
    };

    const handleDelete = async (id: number, newStatus: boolean = false) => {
        try {
            const cat = categorias.find((c) => c.idCategoria === id);
            if (!cat) {
                await Swal.fire({ icon: 'error', title: 'No encontrado', text: 'Categoría no encontrada' });
                return;
            }
            const payload = { nombre: cat.nombre, status: newStatus };
            await actualizarCategoria(id, payload);
            setCategorias((prev) => prev.map((c) => (c.idCategoria === id ? { ...c, status: newStatus } : c)));
            await Swal.fire({
                icon: 'success',
                title: newStatus ? 'Categoría activada' : 'Categoría desactivada',
                text: newStatus ? 'La categoría se activó correctamente.' : 'La categoría se desactivó correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            setVista('lista');
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cambiar estado.' });
        }
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { nombre, status };
            if (categoriaSeleccionada) {
                await actualizarCategoria(categoriaSeleccionada.idCategoria, payload);
                setCategorias(prev => prev.map(p => p.idCategoria === categoriaSeleccionada.idCategoria ? { ...p, ...payload } : p));
                await Swal.fire({ icon: 'success', title: 'Actualizada', text: 'Se actualizó.', timer: 1500, showConfirmButton: false });
                setVista("lista");
            } else {
                const response: any = await crearCategoria(payload);
                if (response && response.idCategoria) {
                    setCategorias([...categorias, response]);
                    nuevoDesdeDetalle();
                    await Swal.fire({ icon: 'success', title: 'Creada', text: 'Se creó.', timer: 1500, showConfirmButton: false });
                } else if (response) {
                    setCategorias([...categorias, response]);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar la categoría");
        }
    };

    const columnDefs: Column<Categoria>[] = [
        {
            key: "idCategoria",
            label: "ID",
            sortable: true,
        },
        {
            key: "nombre",
            label: "Nombre",
            sortable: true,
        },
        {
            key: "fechaAlta",
            label: "Fecha",
            sortable: true,
        },
        {
            key: "status",
            label: "Estado",
            sortable: true,
            valueGetter: (item) => (item.status ? "1" : "0"),
            render: (_, item) => (
                <StatusBadge
                    status={item.status as boolean}
                    trueText="Activo"
                    falseText="Inactivo"
                />
            ),
        },
    ];

    const pestañas = [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList />,
            content: (
                <div className="w-full h-full relative">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-2xl transition-all duration-300">
                            <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-2" aria-hidden="true"></div>
                            <span className="text-xs font-medium text-slate-500" aria-live="polite">Cargando categorías…</span>
                        </div>
                    )}
                    <DataTable
                        data={rowDataFiltrada}
                        columns={columnDefs}
                        onRowClick={handleRowClick}
                        actionContent={
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <StatusFilter
                                    status={filtroEstado}
                                    onChange={handleFiltrarEstado}
                                />
                                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                                <PdfButton onClick={() => { }} />
                                <ExcelButton onClick={() => { }} />
                                <SharedButton
                                    onClick={() => {
                                        setVista("detalle");
                                        nuevoDesdeDetalle();
                                    }}
                                    variant="primary"
                                    size="icon"
                                    title="Nueva Categoría"
                                    aria-label="Nueva Categoría"
                                    icon={<IoMdAddCircle size={22} aria-hidden="true" />}
                                />
                            </div>
                        }
                    />
                </div>
            )
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription />,
            content: (
                <CategoriasDetalle
                    categoriaSeleccionada={categoriaSeleccionada}
                    nombre={nombre}
                    setNombre={setNombre}
                    status={status}
                    setStatus={setStatus}
                    manejarEnvio={manejarEnvio}
                    onDelete={handleDelete}
                    nuevoDesdeDetalle={nuevoDesdeDetalle}
                />
            )
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 p-2 relative h-[600px] overflow-hidden">
            <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
        </div>
    );
};
