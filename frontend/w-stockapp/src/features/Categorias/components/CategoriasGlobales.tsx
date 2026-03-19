import React, { useState, useEffect } from 'react';
import Pagination from "../../../components/Pagination";
import Tabs from "../../../components/Tabs";
import { consultarCategorias, crearCategoria, actualizarCategoria } from "../../../services/Categoria";
import { Categoria } from "../../../interfaces/categoria.interface";
import CategoriasTable from "../../../components/CategoriasTable";
import CategoriasDetalle from "../../../components/CategoriasDetalle";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import Swal from 'sweetalert2';

export const CategoriasGlobales: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState("lista");

    const [rowDataFiltrada, setRowDataFiltrada] = useState<Categoria[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState(true);

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
    const [nombre, setNombre] = useState('');
    const [status, setStatus] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        consultarCategorias()
            .then((data: Categoria[]) => {
                setCategorias(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar categorias:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let datosFiltrados = categorias;
        if (busqueda.trim() !== "") {
            datosFiltrados = datosFiltrados.filter((item) =>
                item.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }
        datosFiltrados = datosFiltrados.filter((item) => item.status === filtroEstado);
        setRowDataFiltrada(datosFiltrados);
        setCurrentPage(1);
    }, [busqueda, filtroEstado, categorias]);

    const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value);
    const handleFiltrarEstado = (valor: string) => setFiltroEstado(valor === "true");

    const handleRowClick = (event: any) => {
        const c = event.data;
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
            await Swal.fire({ icon: 'success', title: newStatus ? 'Categoría activada' : 'Categoría desactivada', text: newStatus ? 'La categoría se activó correctamente.' : 'La categoría se desactivó correctamente.', timer: 1500, showConfirmButton: false });
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

    const pestañas = [
        {
            key: "lista",
            label: "Lista Global",
            icon: <IoMdList />,
            content: (
                <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-2 mt-2">
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                onChange={handleBuscar}
                                className="border border-gray-300 rounded-lg px-3 py-2 w-60"
                            />
                            <select
                                value={String(filtroEstado)}
                                onChange={(e) => handleFiltrarEstado(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                        <button
                            className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                            type="button"
                            onClick={nuevoDesdeDetalle}
                        >
                            <IoMdAddCircle size={20} />
                            <span>Agregar al Catálogo</span>
                        </button>
                    </div>

                    <div className="flex-grow">
                        {loading ? (
                            <div className="text-center text-gray-500 mt-4">Cargando...</div>
                        ) : rowDataFiltrada && rowDataFiltrada.length > 0 ? (
                            <div>
                                <CategoriasTable
                                    categorias={rowDataFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                                    onRowClick={handleRowClick}
                                    onDelete={handleDelete}
                                />
                                <Pagination
                                    totalItems={rowDataFiltrada.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mt-4">No hay datos</div>
                        )}
                    </div>
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
