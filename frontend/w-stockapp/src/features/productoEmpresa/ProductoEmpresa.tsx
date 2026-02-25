import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdOutlineInventory } from "react-icons/md";
import Breadcrumb from "../../components/Breadcrumb";
import { consultarProductoEmpresas, crearProductoEmpresa, actualizarProductoEmpresa, eliminarProductoEmpresa } from "./ProductoEmpresaService";
import type { IProductoEmpresa } from "./productoEmpresa.interface";
import { Column } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { ProductoEmpresaList } from "./components/ProductoEmpresaList";
import { ProductoEmpresaForm } from "./components/ProductoEmpresaForm";
import { useCRUD } from "../../hooks/useCRUD";

export default function ProductoEmpresa() {
    const {
        dataList,
        selectedItem,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        loading,
        values,
        handleChange,
        handleRowClick,
        newFromDetail,
        handleSubmit,
        handleDeleteOrRestore,
        confirm
    } = useCRUD<IProductoEmpresa>({
        fetchData: consultarProductoEmpresas,
        createData: crearProductoEmpresa,
        updateData: actualizarProductoEmpresa,
        deleteData: eliminarProductoEmpresa as any, // Adjust based on your hook delete implementation
        initialFormValues: {
            precioCompra: 0,
            precioVenta: 0,
            costoPromedio: 0,
            manejaInventario: true,
            permiteVenta: true,
            permiteCompra: true,
            activo: true
        },
        getId: (item) => item.idProductoEmpresa as number,
        validate: (vals) => {
            if (!vals.producto) {
                return "Debe seleccionar un producto";
            }
            return null;
        },
        statusField: "activo",
        defaultStatus: true
    });

    const onRowSelect = (item: IProductoEmpresa) => {
        handleRowClick(item, (p) => ({
            producto: p.producto,
            precioCompra: p.precioCompra,
            precioVenta: p.precioVenta,
            costoPromedio: p.costoPromedio,
            manejaInventario: p.manejaInventario,
            permiteVenta: p.permiteVenta,
            permiteCompra: p.permiteCompra,
            activo: p.activo
        }));
    };

    const onSave = (e: React.FormEvent) => {
        handleSubmit(e, (vals, selected) => ({
            producto: vals.producto,
            precioCompra: vals.precioCompra,
            precioVenta: vals.precioVenta,
            costoPromedio: vals.costoPromedio,
            manejaInventario: vals.manejaInventario,
            permiteVenta: vals.permiteVenta,
            permiteCompra: vals.permiteCompra,
            activo: selected ? selected.activo : true
        }));
    };

    const columnas = useMemo<Column<IProductoEmpresa>[]>(() => [
        {
            key: "producto",
            label: "Producto",
            valueGetter: (item) => item.producto ? item.producto.nombre : "",
            render: (_, item) => (
                <span className="font-bold text-slate-800">
                    {item.producto?.nombre}
                </span>
            )
        },
        {
            key: "precioCompra",
            label: "Precio Compra",
            render: (val) => <span className="text-emerald-600 font-medium">${val}</span>
        },
        {
            key: "precioVenta",
            label: "Precio Venta",
            render: (val) => <span className="text-blue-600 font-medium">${val}</span>
        },
        {
            key: "activo",
            label: "Estado",
            sortable: true,
            valueGetter: (item) => item.activo ? "1" : "0",
            render: (status) => (
                <StatusBadge
                    status={status as boolean}
                    trueText="Activo"
                    falseText="Inactivo"
                />
            )
        }
    ], []);

    const onToggleStatus = useCallback((item: IProductoEmpresa) => {
        const isDeactivating = item.activo;
        confirm(
            "¿Estás seguro?",
            `¿Deseas ${isDeactivating ? 'desactivar' : 'reactivar'} la configuración para "${item.producto?.nombre}"?`,
            isDeactivating ? "Sí, desactivar" : "Sí, reactivar"
        ).then((isConfirmed) => {
            if (isConfirmed) {
                handleDeleteOrRestore(item);
            }
        });
    }, [confirm, handleDeleteOrRestore]);

    const items = useMemo(() => [
        {
            key: "lista",
            label: "Inventario",
            icon: <IoMdList aria-hidden="true" />,
            content: (
                <ProductoEmpresaList
                    data={dataList}
                    columns={columnas}
                    onRowClick={onRowSelect}
                    onNew={newFromDetail}
                    loading={loading}
                />
            )
        },
        {
            key: "detalle",
            label: "Configuración",
            icon: <MdDescription aria-hidden="true" />,
            content: (
                <ProductoEmpresaForm
                    values={values}
                    handleChange={handleChange}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSave={onSave}
                    onNew={newFromDetail}
                    selection={selectedItem}
                    onToggleStatus={onToggleStatus}
                />
            )
        }
    ], [
        dataList, columnas, onRowSelect, newFromDetail, loading,
        values, handleChange, isEditing, setIsEditing, onSave, selectedItem,
        onToggleStatus
    ]);

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <Breadcrumb
                    showBackButton={true}
                    items={[
                        { label: "Home", icon: <FaHome aria-hidden="true" />, onClick: () => navigate("/dashboard") },
                        { label: "Catálogos", onClick: () => navigate("/catalogos") },
                        { label: "Mis Productos", icon: <MdOutlineInventory aria-hidden="true" /> },
                    ]}
                />

                <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 relative">
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
