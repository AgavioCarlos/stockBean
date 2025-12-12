import React, { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { Unidad } from "../interfaces/producto.interface";
import { consultarUnidades, crearUnidad, actualizarUnidad, eliminarUnidad } from "../services/Unidad";
import UnidadesTable from "../components/UnidadesTable";
import UnidadesDetalle from "../components/UnidadesDetalle";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";
import SearchInput from "../components/SearchInput";

function Unidades() {
    const [vista, setVista] = useState("lista");
    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [loading, setLoading] = useState(true);

    // State for filtering
    const [rowDataFiltrada, setRowDataFiltrada] = useState<Unidad[]>([]);
    const [busqueda, setBusqueda] = useState("");

    // State for selection/editing
    const [unidadSeleccionada, setUnidadSeleccionada] = useState<Unidad | null>(null);

    // Form state
    const [nombre, setNombre] = useState("");
    const [abreviatura, setAbreviatura] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        consultarUnidades()
            .then((data: Unidad[]) => {
                setUnidades(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar unidades:", error);
                setLoading(false);
            });
    }, []);

    // Filter logic
    useEffect(() => {
        let datosFiltrados = unidades;

        if (busqueda.trim() !== "") {
            datosFiltrados = datosFiltrados.filter((item) =>
                item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                item.abreviatura.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setRowDataFiltrada(datosFiltrados);
        setCurrentPage(1);
    }, [busqueda, unidades]);

    const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const handleRowClick = (event: any) => {
        const u = event.data;
        setUnidadSeleccionada(u);
        setNombre(u.nombre);
        setAbreviatura(u.abreviatura);
        setVista("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setUnidadSeleccionada(null);
        setNombre("");
        setAbreviatura("");
        setVista("detalle");
    };

    const handleDelete = async (id: number) => {
        try {
            await eliminarUnidad(id);
            setUnidades((prev) => prev.filter((u) => u.idUnidad !== id));
            await Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Unidad eliminada correctamente.', timer: 1500, showConfirmButton: false });
        } catch (error) {
            console.error("Error al eliminar unidad:", error);
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar la unidad.' });
        }
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { nombre, abreviatura };

            if (unidadSeleccionada) {
                await actualizarUnidad(unidadSeleccionada.idUnidad, payload);
                setUnidades((prev) => prev.map((u) => u.idUnidad === unidadSeleccionada.idUnidad ? { ...u, ...payload } : u));
                await Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Unidad actualizada correctamente.', timer: 1500, showConfirmButton: false });
                setVista("lista");
            } else {
                const nueva = await crearUnidad(payload);
                // Assuming backend returns the object
                if (nueva) setUnidades([...unidades, nueva]);
                // If not returning object immediately, might need fetch
                setNombre("");
                setAbreviatura("");
                await Swal.fire({ icon: 'success', title: 'Creado', text: 'Unidad creada correctamente.', timer: 1500, showConfirmButton: false });
            }
        } catch (error) {
            console.error(error);
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar la unidad.' });
        }
    };

    const pestañas = [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList />,
            content: (
                <div>
                    <div className="flex justify-between items-center mb-2 mt-2">
                        <div className="flex gap-4 items-center">
                            <SearchInput
                                value={busqueda}
                                onChange={handleBuscar}
                                placeholder="Buscar unidad..."
                                className="w-80"
                            />
                        </div>
                        <button
                            className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                            type="button"
                            onClick={nuevoDesdeDetalle}
                        >
                            <IoMdAddCircle size={20} />
                            <span>Agregar</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 mt-4">
                            Cargando...
                        </div>
                    ) : rowDataFiltrada.length > 0 ? (
                        <div>
                            <UnidadesTable
                                unidades={rowDataFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
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
                        <div className="text-center text-gray-500 mt-4">
                            No hay datos para mostrar
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription />,
            content: (
                <UnidadesDetalle
                    unidadSeleccionada={unidadSeleccionada}
                    nombre={nombre}
                    setNombre={setNombre}
                    abreviatura={abreviatura}
                    setAbreviatura={setAbreviatura}
                    manejarEnvio={manejarEnvio}
                    nuevoDesdeDetalle={() => setVista("lista")}
                />
            ),
        },
    ];

    return (
        <MainLayout>
            <div>
                <Breadcrumb
                    items={[
                        { label: "Proyectos", onClick: () => { } },
                        { label: "Catálogo", onClick: () => { } },
                        { label: "Unidades" }
                    ]}
                    onBack={() => console.log("Back")}
                />
                <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
            </div>
        </MainLayout>
    );
}

export default Unidades;