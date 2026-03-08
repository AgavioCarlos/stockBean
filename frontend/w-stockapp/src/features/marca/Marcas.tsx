import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdLabel, MdBlock } from "react-icons/md";
import Breadcrumb from "../../components/Breadcrumb";
import { consultarMarcas, crearMarca, actualizarMarca, eliminarMarca } from "../../services/Marcas";
import { Marca } from "../../interfaces/marca.interface";
import { Column } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { MarcasList } from "./components/MarcasList";
import { MarcaForm } from "./components/MarcaForm";
import { useCRUD } from "../../hooks/useCRUD";
import { usePermissions } from "../../hooks/useAuth";

export default function Marcas() {
    const permisos = usePermissions("marcas");
    const navigate = useNavigate();

    const {
        dataList: marcasList,
        selectedItem: marcaSeleccionada,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        loading: loadingMarcas,
        values,
        handleChange,
        handleRowClick,
        newFromDetail,
        handleSubmit,
        handleDeleteOrRestore,
        confirm
    } = useCRUD<Marca>({
        fetchData: consultarMarcas,
        createData: crearMarca,
        updateData: actualizarMarca,
        deleteData: eliminarMarca,
        initialFormValues: {
            nombre: "",
            fechaAlta: "",
            status: true
        },
        getId: (item) => item.idMarca,
        validate: (vals) => {
            if (!vals.nombre) {
                return "El nombre de la marca es obligatorio";
            }
            return null;
        },
        statusField: "status",
        defaultStatus: true
    });

    if (permisos.loading) {
        return (
            <MainLayout>
                <div className="flex flex-col h-full bg-slate-50">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm font-medium text-slate-400">Validando accesos...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }


    const onRowSelect = (item: Marca) => {
        handleRowClick(item, (m) => ({
            nombre: m.nombre,
            fechaAlta: m.fechaAlta,
            status: m.status
        }));
    };

    const onSave = (e: React.FormEvent) => {
        handleSubmit(e, (vals, selected) => ({
            nombre: vals.nombre,
            status: selected ? selected.status : true
        }));
    };

    const columnas = useMemo<Column<Marca>[]>(() => [
        {
            key: "nombre",
            label: "Nombre de la Marca",
            sortable: true,
            render: (val) => <span className="font-medium text-gray-900">{val}</span>
        },
        {
            key: "fechaAlta",
            label: "Fecha de Registro",
            sortable: true,
            render: (val) => <span className="text-gray-500">{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
        },
        {
            key: "status",
            label: "Estado",
            sortable: true,
            valueGetter: (item) => item.status ? "1" : "0",
            render: (status) => (
                <StatusBadge
                    status={status as boolean}
                    trueText="Activo"
                    falseText="Inactivo"
                />
            )
        }
    ], []);

    const onToggleStatus = useCallback((item: Marca) => {
        const isDeactivating = item.status;
        confirm(
            "¿Estás seguro?",
            `¿Estás seguro de que deseas ${isDeactivating ? 'desactivar' : 'reactivar'} la marca "${item.nombre}"?`,
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
            label: "Lista",
            icon: <IoMdList aria-hidden="true" />,
            content: (
                <MarcasList
                    data={marcasList}
                    columns={columnas}
                    onRowClick={onRowSelect}
                    onNew={newFromDetail}
                    loading={loadingMarcas}
                />
            )
        },
        {
            key: "detalle",
            label: "Detalle",
            icon: <MdDescription aria-hidden="true" />,
            content: (
                <MarcaForm
                    values={values}
                    handleChange={handleChange}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSave={onSave}
                    onNew={newFromDetail}
                    selection={marcaSeleccionada}
                    onToggleStatus={onToggleStatus}
                />
            )
        }
    ], [
        marcasList, columnas, onRowSelect, newFromDetail, loadingMarcas,
        values, handleChange, isEditing, setIsEditing, onSave, marcaSeleccionada,
        onToggleStatus
    ]);

    return (
        <MainLayout>
            <div className="flex flex-col h-full bg-slate-50">
                <Breadcrumb
                    showBackButton={true}
                    items={[
                        { label: "Home", icon: <FaHome aria-hidden="true" />, onClick: () => navigate("/dashboard") },
                        { label: "Marcas", icon: <MdLabel aria-hidden="true" /> },
                    ]}
                />

                {!permisos.canView ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="flex flex-col items-center gap-4 text-center px-6 py-16">
                            <div className="p-4 bg-rose-50 rounded-2xl">
                                <MdBlock size={48} className="text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Acceso restringido</h3>
                            <p className="text-sm text-slate-400 max-w-sm">
                                No tienes permiso para ver esta pantalla de Marcas. Contacta a tu administrador.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-visible bg-white rounded-xl shadow-sm border border-gray-200 relative">
                        <Tabs
                            tabs={items}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
