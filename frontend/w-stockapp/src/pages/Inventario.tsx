import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdDelete } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import Breadcrumb from "../components/Breadcrumb";
import SearchInput from "../components/SearchInput";
import Swal from "sweetalert2";
import { consultarInventario, crearInventario, actualizarInventario, eliminarInventario } from "../services/Inventario";
import { consultarSucursalesPorEmpresa, consultarSucursales, consultarSucursalesPorSolicitante } from "../services/SucursalService";
import { consultarEmpresas } from "../services/Empresas";
// import type { Productos } from "../interfaces/producto.interface";
import { useLOVs } from "../hooks/useLOVs";
import { Sucursal } from "../interfaces/sucursal.interface";
import { IInventario } from "../interfaces/inventario.interface";

// AG Grid Imports
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";

export default function Inventario() {
    // ... state ...
    const [inventarioList, setInventarioList] = useState<IInventario[]>([]);

    // LOVs
    const { data: lovs, loading: loadingLovs } = useLOVs(["productos"]);
    const productosList = lovs.productos || [];
    // Initial Sucursales List from LOV (context-aware)
    const [sucursalesList, setSucursalesList] = useState<Sucursal[]>([]);

    const [empresasList, setEmpresasList] = useState<any[]>([]);

    // Selection state
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState<IInventario | null>(null);
    const [activeTab, setActiveTab] = useState("lista");
    const [isEditing, setIsEditing] = useState(false);

    // Context / Filters
    const [usuario, setUsuario] = useState<any>(null);
    const [idEmpresaSeleccionada, setIdEmpresaSeleccionada] = useState<number | "">("");
    const [idSucursalSeleccionada, setIdSucursalSeleccionada] = useState<number | "">("");

    // Form state details
    const [idProducto, setIdProducto] = useState<number | "">("");
    const [stockActual, setStockActual] = useState<number | "">("");
    const [stockMinimo, setStockMinimo] = useState<number | "">("");

    // Search
    const [busqueda, setBusqueda] = useState("");

    // Default ColDefs for AG Grid
    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    useEffect(() => {
        console.log("🔄 Inventario Component Mounted. checking localStorage...");
        const uDataStr = localStorage.getItem("usuario") || localStorage.getItem("user_data");
        if (uDataStr) {
            try {
                const u = JSON.parse(uDataStr);
                console.log("💾 User data found in localStorage:", u);
                setUsuario(u);
                cargarDatosIniciales(u);
            } catch (e) {
                console.error("❌ Error parsing user JSON from localStorage", e);
            }
        } else {
            console.error("⚠️ NO user data found in localStorage (usuario or user_data is missing)");
        }
    }, []);

    // Effect to toggle edit mode based on selection
    useEffect(() => {
        if (inventarioSeleccionado) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    }, [inventarioSeleccionado]);

    // Effect: Reload sucursales if empty when switching to Detalle
    useEffect(() => {
        if (activeTab === "detalle" && sucursalesList.length === 0 && usuario) {
            console.log("🔄 Tab changed to Detalle but sucursales list is empty. Reloading...");
            cargarDatosIniciales(usuario);
        }
    }, [activeTab]);

    const cargarDatosIniciales = async (u: any) => {
        // Pattern from Sucursales.tsx
        try {
            let sucs: Sucursal[] = [];

            // 1. Determine User ID (logic from Sucursales.tsx)
            // Sucursales.tsx uses: const idUsuario = userData.id_usuario || userData.id;
            const idUsuario = u.id_usuario || u.id || u.idUsuario;
            const idRol = Number(u.id_rol || u.idRol);

            console.log(`[Inventario] Loading for UserID: ${idUsuario}, Role: ${idRol}`);

            if (idUsuario) {
                // Always try fetching by solicitante first as it seems to be the working endpoint for users
                // unless strictly Admin who might want ALL.
                // Sucursales.tsx simply does: if (idUsuario) consultarSucursalesPorSolicitante(idUsuario);

                try {
                    sucs = await consultarSucursalesPorSolicitante(idUsuario);
                } catch (err) {
                    console.warn("Error fetching by solicitante, trying generic...");
                    sucs = await consultarSucursales();
                }
            } else {
                // Fallback
                sucs = await consultarSucursales();
            }

            console.log(`[Inventario] Sucursales Loaded: ${sucs?.length}`);
            setSucursalesList(sucs || []);

            // Auto-select logic
            if (sucs && sucs.length > 0) {
                if ((sucs.length === 1 || idRol === 4) && !idSucursalSeleccionada) {
                    const s = sucs[0];
                    const sId = (s as any).id_sucursal || (s as any).idSucursal;
                    if (sId) handleSucursalChangeImpl(sId, u);
                }
            }

            // Role 1: Sistemas -> Load Companies (keep this as it is specific to Inventario)
            if (idRol === 1 && empresasList.length === 0) {
                const empresas = await consultarEmpresas();
                setEmpresasList(empresas || []);
            }

        } catch (error) {
            console.error("[Inventario] Error loading data:", error);
            Swal.fire("Error", "No se pudieron cargar los datos", "error");
        }
    };

    const handleEmpresaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const idEmp = val ? Number(val) : "";
        setIdEmpresaSeleccionada(idEmp);
        setIdSucursalSeleccionada("");
        setInventarioList([]);
        setSucursalesList([]);

        if (idEmp) {
            try {
                const sucs = await consultarSucursalesPorEmpresa(Number(idEmp));
                setSucursalesList(sucs);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSucursalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const idSuc = val ? Number(val) : "";
        handleSucursalChangeImpl(idSuc, usuario);
    };

    const handleSucursalChangeImpl = async (idSuc: number | "", u: any) => {
        console.log("handleSucursalChangeImpl", idSuc, u);

        let targetIdSuc = idSuc;

        // If empty ID passed but user is restricted (e.g. Gerente), force their branch logic if needed
        // But here we rely on the selector. 

        setIdSucursalSeleccionada(targetIdSuc);

        if (targetIdSuc && u) {
            try {
                // Determine user ID to use for fetching
                const userId = u.id_usuario || u.id || u.idUsuario;
                console.log("consultarInventario calling with", userId, targetIdSuc);

                const data = await consultarInventario(userId, Number(targetIdSuc));
                setInventarioList(data);
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Error al cargar inventario", "error");
            }
        } else {
            setInventarioList([]);
        }
    };

    const refrescarInventario = async () => {
        if (idSucursalSeleccionada && usuario) {
            const data = await consultarInventario(usuario.id_usuario, Number(idSucursalSeleccionada));
            setInventarioList(data);
        }
    };

    const handleRowClick = (event: any) => {
        const item = event.data as IInventario;
        setInventarioSeleccionado(item);

        setIdProducto(item.producto?.id_producto || "");

        // Populate inputs
        setStockActual(item.stock_actual);
        setStockMinimo(item.stock_minimo);

        // Update selected branch to match item
        if (item.sucursal) {
            const itemColBranchId = item.sucursal.id_sucursal || item.sucursal.idSucursal;
            if (itemColBranchId) setIdSucursalSeleccionada(itemColBranchId);
        }

        setIsEditing(false); // When selecting an item, default to view mode
        setActiveTab("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setInventarioSeleccionado(null);
        setIdProducto("");
        setStockActual("");
        setStockMinimo("");
        setIsEditing(true); // When creating new, default to edit mode
        setActiveTab("detalle");
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idSucursalSeleccionada) {
            Swal.fire("Atención", "Debe seleccionar una sucursal para operar", "warning");
            return;
        }

        if (idProducto === "" || stockActual === "" || stockMinimo === "") {
            Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
            return;
        }

        const payload: Partial<IInventario> = {
            producto: { id_producto: Number(idProducto) },
            sucursal: { idSucursal: Number(idSucursalSeleccionada) },
            stock_actual: Number(stockActual),
            stock_minimo: Number(stockMinimo),
            status: true
        };

        try {
            if (inventarioSeleccionado && inventarioSeleccionado.id_inventario) {
                await actualizarInventario(inventarioSeleccionado.id_inventario, payload, usuario.id_usuario);
                Swal.fire("Éxito", "Inventario actualizado correctamente", "success");
            } else {
                await crearInventario(payload, usuario.id_usuario);
                Swal.fire("Éxito", "Inventario creado correctamente", "success");
            }
            await refrescarInventario();
            setActiveTab("lista");
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire("Error", "Ocurrió un error al guardar", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (!usuario) return;
        try {
            await eliminarInventario(id, usuario.id_usuario);
            Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
            await refrescarInventario();
            if (inventarioSeleccionado?.id_inventario === id) {
                nuevoDesdeDetalle();
                setActiveTab("lista");
            }
        } catch (error) {
            console.error("Error el eliminar", error);
            Swal.fire("Error", "No se pudo eliminar el registro", "error");
        }
    };

    const filteredData = inventarioList.filter(item => {
        const term = busqueda.toLowerCase();
        const prod = item.producto?.nombre?.toLowerCase() || "";
        const codigo = item.producto?.codigoBarras?.toLowerCase() || "";
        return prod.includes(term) || codigo.includes(term);
    });

    const ActionsRenderer = (params: any) => {
        const handleDeleteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Estás seguro de que deseas eliminar este registro de inventario para "${params.data.producto?.nombre}"?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(params.data.id_inventario);
                }
            });
        };

        return (
            <div className="flex gap-2 justify-center items-center h-full">
                <button
                    onClick={handleDeleteClick}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center title='Eliminar'"
                >
                    <MdDelete />
                </button>
            </div>
        );
    }

    const columnDefs: ColDef[] = [
        {
            field: "id_inventario",
            headerName: "ID",
            width: 70,
            sortable: true,
            filter: true
        },
        {
            headerName: "Producto",
            field: "producto.nombre",
            flex: 2,
            sortable: true,
            filter: true,
            valueGetter: (params) => params.data?.producto?.nombre || ""
        },
        {
            headerName: "Sucursal",
            field: "sucursal.nombre",
            flex: 1,
            sortable: true,
            filter: true,
            valueGetter: (params) => params.data?.sucursal?.nombre || ""
        },
        {
            headerName: "Stock Actual",
            field: "stock_actual",
            flex: 1,
            sortable: true,
            filter: true
        },
        {
            headerName: "Stock Mínimo",
            field: "stock_minimo",
            flex: 1,
            sortable: true,
            filter: true
        },
        {
            headerName: "Acciones",
            width: 100,
            cellRenderer: ActionsRenderer,
            sortable: false,
            filter: false,
            cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
        },
    ];

    const items = [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList />,
            content: (
                <div className="flex flex-col h-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        {/* Filters Section */}
                        <div className="flex flex-wrap gap-4 w-full md:w-auto items-center">
                            {usuario?.id_rol === 1 && (
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 mb-1">Empresa</label>
                                    <select
                                        className="border rounded p-2 text-sm min-w-[200px]"
                                        value={idEmpresaSeleccionada}
                                        onChange={handleEmpresaChange}
                                    >
                                        <option value="">Seleccione Empresa...</option>
                                        {empresasList.map((emp: any) => (
                                            <option key={emp.idEmpresa} value={emp.idEmpresa}>
                                                {emp.nombreComercial || emp.razonSocial}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Sucursal Selector (Visible for all, but for Rol 4 it might be fixed or single) */}
                            {(usuario?.id_rol === 1 || usuario?.id_rol === 3 || usuario?.id_rol === 4) && (
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 mb-1">Sucursal</label>
                                    <select
                                        className="border rounded p-2 text-sm min-w-[200px]"
                                        value={idSucursalSeleccionada}
                                        onChange={handleSucursalChange}
                                        disabled={usuario?.id_rol === 4 && sucursalesList.length === 1}
                                    >
                                        <option value="">
                                            {sucursalesList.length === 0 ? "Sin sucursales" : "Seleccione Sucursal..."}
                                        </option>
                                        {sucursalesList.map(suc => (
                                            <option key={suc.id_sucursal || suc.idSucursal} value={suc.id_sucursal || suc.idSucursal}>
                                                {suc.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col flex-1 min-w-[200px]">
                                <label className="text-xs font-semibold text-gray-500 mb-1">Buscar</label>
                                <SearchInput
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Producto / Código..."
                                />
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={nuevoDesdeDetalle}
                                disabled={!idSucursalSeleccionada}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium ${!idSucursalSeleccionada
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                <IoMdAddCircle size={20} />
                                <span>Nuevo</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto ag-theme-alpine w-full h-full">
                        <div style={{ height: '100%', width: '100%' }}>
                            <AgGridReact
                                rowData={filteredData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                rowSelection="single"
                                onRowClicked={handleRowClick}
                                pagination={true}
                                paginationPageSize={20}
                                suppressCellFocus={true}
                                animateRows={true}
                            />
                        </div>
                    </div>
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
                        {/* Header */}
                        <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {inventarioSeleccionado ? "Detalle de Inventario" : "Nuevo Inventario"}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                {!isEditing && inventarioSeleccionado && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-1.5 text-blue-600 text-sm font-medium rounded-md border border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <span>Editar</span>
                                    </button>
                                )}

                                {isEditing && (
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <IoIosSave size={18} />
                                        <span>Guardar</span>
                                    </button>
                                )}

                                {!isEditing && (
                                    <button
                                        type="button"
                                        onClick={nuevoDesdeDetalle}
                                        className="px-4 py-1.5 text-gray-600 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                                    >
                                        Nuevo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Content Form */}
                        <div className="flex-1 p-6 overflow-hidden">
                            <div className="flex gap-8 h-full">
                                {/* Single Column for Simplicity */}
                                <div className="w-full max-w-2xl flex flex-col gap-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Producto</label>
                                            <select
                                                value={idProducto}
                                                onChange={(e) => setIdProducto(e.target.value === "" ? "" : Number(e.target.value))}
                                                disabled={!isEditing}
                                                className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                                            >
                                                <option value="">Seleccionar Producto...</option>
                                                {productosList.map((p: any) => (
                                                    <option key={p.id_producto} value={p.id_producto}>
                                                        {p.nombre} ({p.codigoBarras})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex justify-between">
                                                <span>Sucursal</span>
                                                <button
                                                    type="button"
                                                    onClick={() => usuario && cargarDatosIniciales(usuario)}
                                                    className="text-blue-500 hover:text-blue-700 text-[10px] underline"
                                                >
                                                    Recargar ({sucursalesList.length})
                                                </button>
                                            </label>
                                            <select
                                                value={idSucursalSeleccionada}
                                                onChange={(e) => setIdSucursalSeleccionada(e.target.value === "" ? "" : Number(e.target.value))}
                                                disabled={!isEditing}
                                                className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                            >
                                                <option value="">Seleccionar Sucursal...</option>
                                                {sucursalesList.map((s: any) => (
                                                    <option key={s.id_sucursal || s.idSucursal} value={s.id_sucursal || s.idSucursal}>
                                                        {s.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Actual</label>
                                            <input
                                                type="number"
                                                value={stockActual}
                                                onChange={(e) => setStockActual(e.target.value === "" ? "" : Number(e.target.value))}
                                                disabled={!isEditing}
                                                className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Mínimo</label>
                                            <input
                                                type="number"
                                                value={stockMinimo}
                                                onChange={(e) => setStockMinimo(e.target.value === "" ? "" : Number(e.target.value))}
                                                disabled={!isEditing}
                                                className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 text-center text-xs text-gray-400">
                                        {isEditing
                                            ? "Edita los campos y guarda los cambios."
                                            : "Modo visualización. Click en Editar para modificar."
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    ];

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            { label: "Home", icon: <FaHome /> },
                            { label: "Operaciones" },
                            { label: "Inventario" },
                        ]}
                    />
                </div>

                <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
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
