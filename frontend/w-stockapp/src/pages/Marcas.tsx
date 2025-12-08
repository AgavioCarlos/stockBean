import React, { useState, useEffect } from 'react';
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from '../components/Tabs';
import { consultarMarcas, crearMarca, actualizarMarca } from "../services/Marcas";
import { Marca } from "../interfaces/marca.interface";
import MarcasTable from "../components/MarcasTable";
import MarcasDetalle from "../components/MarcasDetalle";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import Swal from 'sweetalert2';

const Marcas: React.FC = () => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState("lista");

    // State for filtering
    const [rowDataFiltrada, setRowDataFiltrada] = useState<Marca[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState(true);

    // State for selection/editing
    const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);

    // State for form
    const [nombre, setNombre] = useState('');
    const [status, setStatus] = useState(true);

    // Load data
    useEffect(() => {
        consultarMarcas()
            .then((data: Marca[]) => {
                setMarcas(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar marcas:", error);
                setLoading(false);
            });
    }, []);

    // Filter logic
    useEffect(() => {
        let datosFiltrados = marcas;

        if (busqueda.trim() !== "") {
            datosFiltrados = datosFiltrados.filter((item) =>
                item.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        datosFiltrados = datosFiltrados.filter((item) => item.status === filtroEstado);

        setRowDataFiltrada(datosFiltrados);
    }, [busqueda, filtroEstado, marcas]);

    const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const handleFiltrarEstado = (valor: string) => {
        setFiltroEstado(valor === "true");
    };

    const handleRowClick = (event: any) => {
        const m = event.data;
        setMarcaSeleccionada(m);
        setNombre(m.nombre);
        setStatus(m.status);
        setVista("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setMarcaSeleccionada(null);
        setNombre("");
        setStatus(true);
        setVista("detalle");
    };

    const handleDelete = async (id: number, newStatus: boolean = false) => {
        try {
            const marca = marcas.find((m) => m.idMarca === id);
            if (!marca) {
                await Swal.fire({ icon: 'error', title: 'No encontrado', text: 'Marca no encontrada' });
                return;
            }

            const payload = {
                nombre: marca.nombre,
                status: newStatus
            };

            await actualizarMarca(id, payload);

            setMarcas((prev) => prev.map((m) => (m.idMarca === id ? { ...m, status: newStatus } : m)));
            await Swal.fire({ icon: 'success', title: newStatus ? 'Marca activada' : 'Marca desactivada', text: newStatus ? 'La marca se activó correctamente.' : 'La marca se desactivó correctamente.', timer: 1500, showConfirmButton: false });
            setVista('lista');

        } catch (error) {
            console.error("Error al cambiar estado:", error);
            await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cambiar el estado de la marca.' });
        }
    };

    // POST/PUT to backend
    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nombre,
                status
            };

            if (marcaSeleccionada) {
                // Update
                await actualizarMarca(marcaSeleccionada.idMarca, payload);

                setMarcas(prev => prev.map(m => m.idMarca === marcaSeleccionada.idMarca ? { ...m, ...payload } : m));

                await Swal.fire({ icon: 'success', title: 'Marca actualizada', text: 'La marca se actualizó correctamente.', timer: 1500, showConfirmButton: false });
                setVista("lista");

            } else {
                // Create
                const response: any = await crearMarca(payload);
                if (response && response.idMarca) {
                    setMarcas([...marcas, response]);
                    nuevoDesdeDetalle(); // Clear form
                    await Swal.fire({ icon: 'success', title: 'Marca creada', text: 'La marca se creó correctamente.', timer: 1500, showConfirmButton: false });
                } else if (response) {
                    // If direct object is returned
                    setMarcas([...marcas, response]);
                    nuevoDesdeDetalle();
                    await Swal.fire({ icon: 'success', title: 'Marca creada', text: 'La marca se creó correctamente.', timer: 1500, showConfirmButton: false });
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar la marca");
        }
    };

    const pestañas = [
        {
            key: "lista",
            label: "Lista",
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
                            <span>Agregar</span>
                        </button>
                    </div>

                    <div className="flex-grow">
                        {loading ? (
                            <div className="text-center text-gray-500 mt-4">
                                Cargando...
                            </div>
                        ) : rowDataFiltrada && rowDataFiltrada.length > 0 ? (
                            <MarcasTable
                                marcas={rowDataFiltrada}
                                onRowClick={handleRowClick}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <div className="text-center text-gray-500 mt-4">
                                No hay datos para mostrar
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription />,
            content: (
                <MarcasDetalle
                    marcaSeleccionada={marcaSeleccionada}
                    nombre={nombre}
                    setNombre={setNombre}
                    status={status}
                    setStatus={setStatus}
                    manejarEnvio={manejarEnvio}
                    onDelete={handleDelete}
                    nuevoDesdeDetalle={nuevoDesdeDetalle}
                />
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="p-4 h-full">
                <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
            </div>
        </MainLayout>
    );
};

export default Marcas;