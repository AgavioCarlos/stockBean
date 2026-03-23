import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription, MdDelete } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { TipoPrecio, consultarTipoPrecios, crearTipoPrecio, actualizarTipoPrecio } from "./TipoPrecioService";
import Breadcrumb from "../../components/Breadcrumb";
import { DataTable, type Column } from "../../components/DataTable";
import { SharedButton, PdfButton, ExcelButton } from "../../components/SharedButton";
import { SharedInput } from "../../components/SharedInput";
import { useAlerts } from "../../hooks/useAlerts";
import { StatusBadge } from "../../components/StatusBadge";
import StatusFilter from "../../components/StatusFilter";

function TipoPrecioFeature() {
    const navigate = useNavigate();
    const { success, error, confirm } = useAlerts();

    const [vista, setVista] = useState("lista");
    const [tiposPrecio, setTiposPrecio] = useState<TipoPrecio[]>([]);
    const [loading, setLoading] = useState(true);

    const [rowDataFiltrada, setRowDataFiltrada] = useState<TipoPrecio[]>([]);
    const [filtroEstado, setFiltroEstado] = useState(true);

    const [seleccionado, setSeleccionado] = useState<TipoPrecio | null>(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [status, setStatus] = useState(true);

    useEffect(() => {
        let mounted = true;
        consultarTipoPrecios()
            .then((data) => {
                if(mounted) {
                   setTiposPrecio(data || []);
                   setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error al consultar tipos de precio:", err);
                if(mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let filtrados = tiposPrecio || [];
        filtrados = filtrados.filter((item) => {
             const isActivo = Boolean(item.status);
             return isActivo === filtroEstado;
        });
        setRowDataFiltrada(filtrados);
    }, [filtroEstado, tiposPrecio]);

    const handleRowClick = (item: TipoPrecio) => {
        setSeleccionado(item);
        setNombre(item.nombre || "");
        setDescripcion(item.descripcion || "");
        setStatus(Boolean(item.status));
        setVista("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setSeleccionado(null);
        setNombre("");
        setDescripcion("");
        setStatus(true);
        setVista("detalle");
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: Partial<TipoPrecio> = { 
               nombre, 
               descripcion,
               status
            };

            if (seleccionado) {
                const actualizado = await actualizarTipoPrecio(seleccionado.idTipoPrecio, payload);
                setTiposPrecio((prev) => prev.map((t) => t.idTipoPrecio === seleccionado.idTipoPrecio ? { ...t, ...actualizado } : t));
                success('Tipo de Precio actualizado', 'Los cambios se guardaron correctamente.');
                setVista("lista");
            } else {
                const nuevo = await crearTipoPrecio(payload);
                if (nuevo && nuevo.idTipoPrecio) {
                    setTiposPrecio([...tiposPrecio, nuevo]);
                } else if(nuevo) {
                    setTiposPrecio([...tiposPrecio, nuevo as any]);
                }
                nuevoDesdeDetalle();
                success('Tipo de Precio creado', 'Se registró correctamente.');
                setVista("lista");
            }
        } catch (err) {
            console.error(err);
            error('Error al guardar', 'Ocurrió un error inesperado al procesar la solicitud.');
        }
    };

    const columnDefs: Column<TipoPrecio>[] = [
        {
            key: "idTipoPrecio",
            label: "ID",
            sortable: true
        },
        {
            key: "nombre",
            label: "Nombre",
            sortable: true
        },
        {
            key: "descripcion",
            label: "Descripción",
            sortable: true
        },
        {
            key: "status",
            label: "Estado",
            sortable: true,
            valueGetter: (item) => Boolean(item.status) ? "1" : "0",
            render: (_, item) => (
               <StatusBadge
                   status={Boolean(item.status)}
                   trueText="Activo"
                   falseText="Inactivo"
               />
            )
        }
    ];

    return (
        <MainLayout>
            <div>
                <Breadcrumb
                    items={[
                        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
                        { label: "Catálogos", onClick: () => navigate("/catalogos") },
                        { label: "Tipos de Precio" }
                    ]}
                    onBack={() => navigate(-1)}
                />
                <Tabs
                    activeTab={vista}
                    onChange={setVista}
                    tabs={[
                        {
                            key: "lista",
                            label: "Lista",
                            icon: <IoMdList />,
                            content: (
                                <div className="w-full h-full relative">
                                    {loading && (
                                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-2xl transition-all duration-300">
                                            <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-2" aria-hidden="true"></div>
                                            <span className="text-xs font-medium text-slate-500" aria-live="polite">Cargando...</span>
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
                                                    onChange={setFiltroEstado}
                                                />
                                                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                                                <PdfButton onClick={() => {}} />
                                                <ExcelButton onClick={() => {}} />
                                                <SharedButton
                                                    onClick={() => {
                                                        nuevoDesdeDetalle();
                                                        setVista("detalle");
                                                    }}
                                                    variant="primary"
                                                    size="icon"
                                                    title="Nuevo Tipo De Precio"
                                                    aria-label="Nuevo Tipo De Precio"
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
                                <div className="w-full h-full flex flex-col">
                                  <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
                                    <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                          {seleccionado ? "Detalle" : "Nuevo Tipo de Precio"}
                                        </h3>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {seleccionado ? (
                                          <>
                                            <SharedButton
                                                type="button"
                                                variant={status ? "danger" : "success"}
                                                size="icon"
                                                onClick={async () => {
                                                    try {
                                                        const p = { ...seleccionado, status: !status };
                                                        await actualizarTipoPrecio(seleccionado.idTipoPrecio, p);
                                                        setTiposPrecio((prev) => prev.map((t) => t.idTipoPrecio === seleccionado.idTipoPrecio ? { ...t, status: p.status } : t));
                                                        success('Estado actualizado', 'El estado del tipo de precio cambió.');
                                                        // Toggle locally
                                                        setStatus(!status);
                                                        setVista("lista");
                                                    } catch(e) {
                                                        error("Error", "No se pudo cambiar el estado.");
                                                    }
                                                }}
                                                title={status ? "Desactivar" : "Reactivar"}
                                                icon={<MdDelete size={22} aria-hidden="true" />}
                                            />
                                            <SharedButton
                                                type="submit"
                                                variant="success"
                                                size="icon"
                                                title="Guardar"
                                                icon={<IoIosSave size={22} aria-hidden="true" />}
                                            />
                                            <SharedButton
                                                type="button"
                                                variant="secondary"
                                                size="icon"
                                                onClick={() => nuevoDesdeDetalle()}
                                                title="Nuevo"
                                                icon={<IoMdAddCircle size={24} aria-hidden="true" />}
                                            />
                                          </>
                                        ) : (
                                          <SharedButton
                                              type="submit"
                                              variant="success"
                                              size="icon"
                                              title="Guardar"
                                              icon={<IoIosSave size={22} aria-hidden="true" />}
                                          />
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex-1 p-6 pb-40 overflow-visible">
                                      <div className="max-w-4xl mx-auto flex flex-col gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <SharedInput
                                                label="Nombre"
                                                id="nombre"
                                                name="nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                isEditing={true}
                                                required
                                            />
                                            <SharedInput
                                                label="Descripción"
                                                id="descripcion"
                                                name="descripcion"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                isEditing={true}
                                            />
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <label className="inline-flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm text-gray-700">Activo</span>
                                            <div className="relative">
                                                <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={status}
                                                onChange={(e) => setStatus(e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-200"></div>
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                                            </div>
                                            </label>
                                        </div>
                                        <div className="mt-4 text-center text-xs text-gray-400">
                                            {seleccionado
                                              ? "Edita los campos y guarda los cambios."
                                              : "Registra un nuevo tipo de precio."}
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </MainLayout>
    );
}

export default TipoPrecioFeature;
