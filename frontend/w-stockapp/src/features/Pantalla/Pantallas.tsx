import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdPictureInPicture } from "react-icons/md";
import Breadcrumb from "../../components/Breadcrumb";
import { consultarPantallas, crearPantalla, actualizarPantalla, eliminarPantalla } from "./PantallaService";
import type { IPantalla } from "./pantalla.interface";
import { Column } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { PantallaList } from "./components/PantallaList";
import { PantallaForm } from "./components/PantallaForm";
import { useCRUD } from "../../hooks/useCRUD";

export default function Pantallas() {
    const {
        dataList: pantallasList,
        selectedItem: pantallaSeleccionada,
        activeTab,
        setActiveTab,
        isEditing,
        setIsEditing,
        loading: loadingPantallas,
        values,
        handleChange,
        handleRowClick,
        newFromDetail,
        handleSubmit,
        handleDeleteOrRestore,
        confirm
    } = useCRUD<IPantalla>({
        fetchData: consultarPantallas,
        createData: crearPantalla,
        updateData: actualizarPantalla,
        deleteData: eliminarPantalla,
        initialFormValues: {
            nombre: "",
            ruta: "",
            icono: "",
            esMenu: false,
            esRoot: false,
            status: true,
        },
        getId: (item) => item.idPantalla,
        validate: (vals) => {
            if (!vals.nombre) {
                return "Complete el nombre de la pantalla.";
            }
            return null;
        },
        statusField: "status",
        defaultStatus: true
    });

    const onRowSelect = (item: IPantalla) => {
        handleRowClick(item, (p) => ({
            ...p
        }));
    };

    const columnas = useMemo<Column<IPantalla>[]>(() => [
        {
            key: "nombre",
            label: "Nombre",
            render: (val, item) => {
                const isParent = !item.idPadre;
                return (
                    <div className={`flex items-center gap-2 ${!isParent ? 'ml-6' : ''}`}>
                        {!isParent && <span className="text-gray-300">↳</span>}
                        <span className={`font-semibold ${isParent ? 'text-indigo-600' : 'text-gray-600'}`}>
                            {val}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "ruta",
            label: "Ruta",
            render: (val) => <span className="text-gray-600 font-semibold">{val}</span>
        },
        {
            key: "icono",
            label: "Icono",
            render: (val) => <span className="text-gray-600">{val}</span>
        },
        {
            key: "esMenu",
            label: "¿Es Menú?",
            render: (val) => (
                <StatusBadge status={val} trueText="Sí" falseText="No" />
            )
        },
        {
            key: "esRoot",
            label: "¿Es Root?",
            render: (val) => (
                <StatusBadge status={val} trueText="Sí" falseText="No" />
            )
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

    const onToggleStatus = useCallback((item: IPantalla) => {
        const isDeactivating = item.status;
        confirm(
            "¿Estás seguro?",
            `¿Estás seguro de que deseas ${isDeactivating ? 'desactivar' : 'reactivar'} la pantalla "${item.nombre}"?`,
            isDeactivating ? "Sí, desactivar" : "Sí, reactivar"
        ).then((isConfirmed) => {
            if (isConfirmed) {
                handleDeleteOrRestore(item);
            }
        });
    }, [confirm, handleDeleteOrRestore]);

    const hierarchicalPantallas = useMemo(() => {
        if (!pantallasList) return [];
        // Extract parents and sort by order
        const parents = pantallasList.filter(p => !p.idPadre).sort((a, b) => (a.orden || 0) - (b.orden || 0));
        const children = pantallasList.filter(p => p.idPadre);
        
        const sorted: IPantalla[] = [];
        parents.forEach(parent => {
            sorted.push(parent);
            // Append children right after their parent
            const childrenOfParent = children.filter(c => c.idPadre === parent.idPantalla).sort((a, b) => (a.orden || 0) - (b.orden || 0));
            sorted.push(...childrenOfParent);
        });
        
        // Append any remaining items (orphans)
        const mappedIds = new Set(sorted.map(s => s.idPantalla));
        const orphans = pantallasList.filter(p => !mappedIds.has(p.idPantalla)).sort((a,b) => (a.orden || 0) - (b.orden || 0));
        sorted.push(...orphans);

        return sorted;
    }, [pantallasList]);

    const items = useMemo(() => [
        {
            key: "lista",
            label: "Lista",
            icon: <IoMdList aria-hidden="true" />,
            content: (
                <PantallaList
                    data={hierarchicalPantallas}
                    columns={columnas}
                    onRowClick={onRowSelect}
                    onNew={newFromDetail}
                    loading={loadingPantallas}
                />
            )
        },
        {
            key: "detalle",
            label: "Formulario",
            icon: <MdDescription aria-hidden="true" />,
            content: (
                <PantallaForm
                    values={values}
                    handleChange={handleChange}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSave={(e: any) => handleSubmit(e, (vals) => ({
                        ...vals,
                        idPadre: vals.idPadre ? Number(vals.idPadre) : null,
                        orden: vals.orden ? Number(vals.orden) : null
                    }))}
                    onNew={newFromDetail}
                    selection={pantallaSeleccionada}
                    onToggleStatus={onToggleStatus}
                />
            )
        }
    ], [
        hierarchicalPantallas, columnas, onRowSelect, newFromDetail, loadingPantallas,
        values, handleChange, isEditing, setIsEditing, handleSubmit, pantallaSeleccionada,
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
                        { label: "Pantallas", icon: <MdPictureInPicture aria-hidden="true" /> },
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
