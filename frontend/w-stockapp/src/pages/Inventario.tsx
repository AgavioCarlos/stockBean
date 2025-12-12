import React, { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import { IoMdAddCircle, IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import Breadcrumb from "../components/Breadcrumb";
import SearchInput from "../components/SearchInput";
import Swal from "sweetalert2";

import { Inventario, consultarInventario, crearInventario, actualizarInventario, eliminarInventario } from "../services/Inventario";
import { consultarProductos } from "../services/Productos";
import { consultarSucursales, Sucursal } from "../services/SucursalService";
import type { Productos } from "../interfaces/producto.interface";

import InventarioTable from "../components/InventarioTable";
import InventarioDetalle from "../components/InventarioDetalle";

export default function InventarioPage() {
    // ... state ...
    const [inventarioList, setInventarioList] = useState<Inventario[]>([]);
    const [productosList, setProductosList] = useState<Productos[]>([]);
    const [sucursalesList, setSucursalesList] = useState<Sucursal[]>([]);

    // Selection state
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState<Inventario | null>(null);
    const [activeTab, setActiveTab] = useState("lista");

    // Form state
    const [idProducto, setIdProducto] = useState<number | "">("");
    const [idSucursal, setIdSucursal] = useState<number | "">("");
    const [stockActual, setStockActual] = useState<number | "">("");
    const [stockMinimo, setStockMinimo] = useState<number | "">("");

    // Search
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [inv, prod, suc] = await Promise.all([
                consultarInventario(),
                consultarProductos(),
                consultarSucursales()
            ]);
            setInventarioList(inv);
            setProductosList(prod);
            setSucursalesList(suc);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            Swal.fire("Error", "No se pudieron cargar los datos", "error");
        }
    };

    const handleRowClick = (event: any) => {
        const item = event.data as Inventario;
        setInventarioSeleccionado(item);

        // Populate form
        setIdProducto(item.producto?.id_producto || "");
        setIdSucursal(item.sucursal?.idSucursal || item.sucursal?.id_sucursal || "");
        setStockActual(item.stock_actual);
        setStockMinimo(item.stock_minimo);

        setActiveTab("detalle");
    };

    const nuevoDesdeDetalle = () => {
        setInventarioSeleccionado(null);
        setIdProducto("");
        setIdSucursal("");
        setStockActual("");
        setStockMinimo("");
        setActiveTab("detalle");
    };

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();

        if (idProducto === "" || idSucursal === "" || stockActual === "" || stockMinimo === "") {
            Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
            return;
        }

        // Construct payload with minimal required references for backend association
        const payload: Partial<Inventario> = {
            producto: { id_producto: Number(idProducto) },
            sucursal: { idSucursal: Number(idSucursal) },
            stock_actual: Number(stockActual),
            stock_minimo: Number(stockMinimo),
            status: true
        };

        try {
            if (inventarioSeleccionado && inventarioSeleccionado.id_inventario) {
                await actualizarInventario(inventarioSeleccionado.id_inventario, payload);
                Swal.fire("Éxito", "Inventario actualizado correctamente", "success");
            } else {
                await crearInventario(payload);
                Swal.fire("Éxito", "Inventario creado correctamente", "success");
            }
            await cargarDatos();
            setActiveTab("lista");
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire("Error", "Ocurrió un error al guardar", "error");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await eliminarInventario(id);
            Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
            await cargarDatos();
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
        const suc = item.sucursal?.nombre?.toLowerCase() || "";
        return prod.includes(term) || suc.includes(term);
    });

    const items = [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList />,
            content: (
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4 gap-4">
                        <SearchInput
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por producto o sucursal..."
                        />
                        <button
                            onClick={nuevoDesdeDetalle}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <IoMdAddCircle size={20} />
                            <span className="font-medium">Nuevo</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <InventarioTable
                            data={filteredData}
                            onRowClick={handleRowClick}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            )
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription />,
            content: (
                <InventarioDetalle
                    inventarioSeleccionado={inventarioSeleccionado}
                    idProducto={idProducto}
                    setIdProducto={setIdProducto}
                    idSucursal={idSucursal}
                    setIdSucursal={setIdSucursal}
                    stockActual={stockActual}
                    setStockActual={setStockActual}
                    stockMinimo={stockMinimo}
                    setStockMinimo={setStockMinimo}
                    manejarEnvio={manejarEnvio}
                    nuevoDesdeDetalle={nuevoDesdeDetalle}
                    setVista={setActiveTab}
                    productosList={productosList}
                    sucursalesList={sucursalesList}
                    onDelete={handleDelete}
                />
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
