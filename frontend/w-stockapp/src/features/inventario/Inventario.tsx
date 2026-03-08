import React, { useEffect, useState, useMemo, useCallback } from "react";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdDelete } from "react-icons/md";
import Breadcrumb from "../../components/Breadcrumb";
import { useAlerts } from "../../hooks/useAlerts";
import { consultarInventario, crearInventario, actualizarInventario, eliminarInventario } from "./InventarioService";
import { useLOVs } from "../../hooks/useLOVs";
import { IInventario } from "./inventario.interface";
import { Column } from "../../components/DataTable";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { StatusBadge, StockBadge } from "../../components/StatusBadge";
import { InventarioList } from "./components/InventarioList";
import { InventarioForm } from "./components/InventarioForm";

export default function Inventario() {
    const [inventarioList, setInventarioList] = useState<IInventario[]>([]);
    const { data: lovs, loading: loadingLovs } = useLOVs(["productos", "tipo_precios"]);
    const productosList = lovs.productos || [];
    const tipoPreciosList = lovs.tipo_precios || [];
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState<IInventario | null>(null);
    const [activeTab, setActiveTab] = useState("lista");
    const [isEditing, setIsEditing] = useState(false);
    const [loadingInventario, setLoadingInventario] = useState(false);
    const { user } = useAuth();
    const [idSucursalSeleccionada, setIdSucursalSeleccionada] = useState<number | "">("");

    const { values, handleChange, setValues, resetForm } = useForm({
        idProducto: "" as number | "",
        stockActual: "" as number | "",
        stockMinimo: "" as number | "",
        precioNuevo: "" as number | "",
        idTipoPrecio: "" as number | "",
        motivo: "" as string
    });

    const { success, error: showError, warning, confirm, info } = useAlerts();

    const handleRowClick = useCallback((item: IInventario) => {
        setInventarioSeleccionado(item);
        setValues({
            idProducto: item.producto?.id_producto || "",
            stockActual: item.stock_actual,
            stockMinimo: item.stock_minimo,
            precioNuevo: item.precioNuevo || "",
            idTipoPrecio: item.idTipoPrecio || "",
            motivo: item.motivo || ""
        });

        if (item.sucursal) {
            const itemColBranchId = item.sucursal.id_sucursal || item.sucursal.idSucursal;
            if (itemColBranchId) setIdSucursalSeleccionada(itemColBranchId);
        }
        setIsEditing(false);
        setActiveTab("detalle");
    }, [setValues]);

    const nuevoDesdeDetalle = useCallback(() => {
        setInventarioSeleccionado(null);
        resetForm();
        setIsEditing(true);
        setActiveTab("detalle");
    }, [resetForm]);

    const refrescarInventario = useCallback(async () => {
        if (idSucursalSeleccionada && user) {
            setLoadingInventario(true);
            try {
                const data = await consultarInventario(Number(idSucursalSeleccionada));
                setInventarioList(data);
            } finally {
                setLoadingInventario(false);
            }
        }
    }, [idSucursalSeleccionada, user]);

    const manejarEnvio = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (idSucursalSeleccionada === "" || !user) {
            warning("Atención", "Debe seleccionar una sucursal para operar");
            return;
        }

        const { idProducto, stockActual, stockMinimo, precioNuevo, motivo } = values;

        if (idProducto === "" || stockActual === "" || stockMinimo === "") {
            warning("Atención", "Todos los campos básicos son obligatorios");
            return;
        }

        // Final check for duplicates when creating a new record
        if (!inventarioSeleccionado) {
            const alreadyExists = inventarioList.some(
                item => Number(item.producto?.id_producto) === Number(idProducto)
            );
            if (alreadyExists) {
                warning("Atención", "Este producto ya está registrado en el inventario de esta sucursal. Por favor, edite el registro existente.");
                return;
            }
        }

        const payload: Partial<IInventario> = {
            producto: { id_producto: Number(idProducto) },
            sucursal: { id_sucursal: Number(idSucursalSeleccionada) },
            stock_actual: Number(stockActual),
            stock_minimo: Number(stockMinimo),
            status: true,
            precioNuevo: precioNuevo !== "" ? Number(precioNuevo) : undefined,
            idTipoPrecio: values.idTipoPrecio ? Number(values.idTipoPrecio) : undefined,
            motivo: motivo !== "" ? motivo : undefined
        };

        try {
            if (inventarioSeleccionado && inventarioSeleccionado.id_inventario) {
                await actualizarInventario(inventarioSeleccionado.id_inventario, payload);
                success("Éxito", "Inventario actualizado correctamente");
            } else {
                await crearInventario(payload);
                success("Éxito", "Inventario creado correctamente");
            }
            await refrescarInventario();
            setActiveTab("lista");
        } catch (err) {
            console.error("Error al guardar:", err);
            showError("Error", "Ocurrió un error al guardar");
        }
    }, [idSucursalSeleccionada, values, user, inventarioSeleccionado, inventarioList, refrescarInventario, warning, success, info, showError]);

    const handleDelete = useCallback(async (id: number) => {
        if (!user) return;
        try {
            await eliminarInventario(id);
            success("Eliminado", "Registro eliminado correctamente");
            await refrescarInventario();
            if (inventarioSeleccionado?.id_inventario === id) {
                nuevoDesdeDetalle();
                setActiveTab("lista");
            }
        } catch (err) {
            console.error("Error el eliminar", err);
            showError("Error", "No se pudo eliminar el registro");
        }
    }, [user, refrescarInventario, inventarioSeleccionado, nuevoDesdeDetalle, success, showError]);

    // Side effects
    useEffect(() => {
        if (idSucursalSeleccionada && user) {
            setLoadingInventario(true);
            console.log("🔄 Branch selected, fetching inventory list…");
            consultarInventario(Number(idSucursalSeleccionada))
                .then(setInventarioList)
                .catch(err => {
                    console.error(err);
                    showError("Error", "Error al cargar inventario");
                })
                .finally(() => setLoadingInventario(false));
        } else {
            setInventarioList([]);
        }
    }, [idSucursalSeleccionada, user, showError]);

    useEffect(() => {
        setIsEditing(!inventarioSeleccionado);
    }, [inventarioSeleccionado]);

    useEffect(() => {
        if (!inventarioSeleccionado && values.idProducto && inventarioList.length > 0) {
            const existing = inventarioList.find(
                item => Number(item.producto?.id_producto) === Number(values.idProducto)
            );

            if (existing) {
                handleRowClick(existing);
                info("Producto Detectado", "Este producto ya cuenta con un registro en el inventario. Cargando datos para actualizar.");
            }
        }
    }, [values.idProducto, inventarioSeleccionado, inventarioList, handleRowClick, info]);

    const columnas = useMemo<Column<IInventario>[]>(() => [
        {
            key: "id_inventario",
            label: "ID",
            sortable: true
        },
        {
            key: "producto",
            label: "Producto",
            render: (p) => <div className="flex flex-col"><span className="font-medium text-gray-900">{p?.nombre || "N/A"}</span><span className="text-xs text-gray-400">{p?.codigoBarras}</span></div>
        },
        {
            key: "stock_actual",
            label: "Stock",
            render: (stock, item) => (
                <StockBadge current={stock} min={item.stock_minimo} showText={false} />
            )
        },
        {
            key: "stock_minimo",
            label: "Mínimo",
            render: (val) => <span className="text-gray-400 font-medium">{val}</span>
        },
        {
            key: "id_inventario",
            label: "Estado",
            sortable: true,
            valueGetter: (item) => item.stock_actual <= item.stock_minimo ? "A-Bajo" : "Z-Normal",
            render: (_, item) => (
                <StatusBadge
                    status={item.stock_actual > item.stock_minimo}
                    trueText="Óptimo"
                    falseText="Bajo"
                />
            )
        },
        {
            key: "id_inventario",
            label: "Acciones",
            sortable: false,
            render: (_, item) => (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            confirm(
                                "¿Estás seguro?",
                                `¿Estás seguro de que deseas eliminar este registro de inventario para "${item.producto?.nombre}"?`,
                                "Sí, eliminar"
                            ).then((isConfirmed) => {
                                if (isConfirmed) {
                                    handleDelete(item.id_inventario!);
                                }
                            });
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Eliminar"
                    >
                        <MdDelete size={16} />
                    </button>
                </div>
            )
        }
    ], [confirm, handleDelete]);


    const items = useMemo(() => [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList />,
            content: (
                <InventarioList data={inventarioList} columns={columnas} onRowClick={handleRowClick} onNew={nuevoDesdeDetalle} idSucursal={idSucursalSeleccionada} onBranchChange={setIdSucursalSeleccionada} loading={loadingInventario} />
            )
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription />,
            content: (
                <InventarioForm values={values} handleChange={handleChange} isEditing={isEditing} setIsEditing={setIsEditing} onSave={manejarEnvio} onNew={nuevoDesdeDetalle}
                    selection={inventarioSeleccionado} productosList={productosList} tipoPreciosList={tipoPreciosList} loadingLovs={loadingLovs} idSucursal={idSucursalSeleccionada} onBranchChange={setIdSucursalSeleccionada}
                />
            )
        }
    ], [
        inventarioList, columnas, handleRowClick, nuevoDesdeDetalle, idSucursalSeleccionada, values, handleChange, isEditing, manejarEnvio, inventarioSeleccionado, productosList, tipoPreciosList, loadingLovs, loadingInventario
    ]);

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            { label: "Home", icon: <FaHome /> },
                            { label: "Inventario" },
                        ]}
                    />
                </div>

                <div className="flex-1 overflow-visible bg-white rounded-xl shadow-sm border border-gray-200 relative">
                    <Tabs
                        tabs={items}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
