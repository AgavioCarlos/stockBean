import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs from "../../components/Tabs";
import { IoMdList } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { MdDescription, MdPeople } from "react-icons/md";
import Breadcrumb from "../../components/Breadcrumb";
import { consultarPersonas, crearPersona, actualizarPersona, eliminarPersona } from "./PersonaService";
import type { IPersona } from "./persona.interface";
import { Column } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { PersonaList } from "./components/PersonaList";
import { PersonaForm } from "./components/PersonaForm";
import { useCRUD } from "../../hooks/useCRUD";
// import { PersonaMetricsSidebar } from "./components/PersonaMetricsSidebar";

export default function Persona() {
  const {
    dataList: personasList,
    selectedItem: personaSeleccionada,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    loading: loadingPersonas,
    values,
    handleChange,
    handleRowClick,
    newFromDetail,
    handleSubmit,
    handleDeleteOrRestore,
    confirm
  } = useCRUD<IPersona>({
    fetchData: consultarPersonas,
    createData: crearPersona,
    updateData: actualizarPersona,
    deleteData: eliminarPersona,
    initialFormValues: {
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      email: "",
      fecha_alta: "",
      status: true
    },
    getId: (item) => item.id_persona,
    validate: (vals) => {
      if (!vals.nombre || !vals.apellido_paterno || !vals.email) {
        return "Nombre, apellido paterno y email son obligatorios";
      }
      return null;
    },
    statusField: "status",
    defaultStatus: true
  });

  const onRowSelect = (item: IPersona) => {
    handleRowClick(item, (p) => ({
      nombre: p.nombre,
      apellido_paterno: p.apellido_paterno,
      apellido_materno: p.apellido_materno,
      email: p.email,
      fecha_alta: p.fecha_alta,
      status: p.status
    }));
  };

  const onSave = (e: React.FormEvent) => {
    handleSubmit(e, (vals, selected) => ({
      nombre: vals.nombre,
      apellido_paterno: vals.apellido_paterno,
      apellido_materno: vals.apellido_materno,
      email: vals.email,
      status: selected ? selected.status : true
    }));
  };

  const columnas = useMemo<Column<IPersona>[]>(() => [
    {
      key: "nombre",
      label: "Nombre completo",
      render: (_, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.nombre}</span>
          <span className="text-xs text-gray-500">{item.apellido_paterno} {item.apellido_materno}</span>
        </div>
      )
    },
    {
      key: "email",
      label: "Email",
      render: (val) => <span className="text-gray-600">{val}</span>
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


  const onToggleStatus = useCallback((item: IPersona) => {
    const isDeactivating = item.status;
    confirm(
      "¿Estás seguro?",
      `¿Estás seguro de que deseas ${isDeactivating ? 'desactivar' : 'reactivar'} el registro para "${item.nombre}"?`,
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
        <PersonaList
          data={personasList}
          columns={columnas}
          onRowClick={onRowSelect}
          onNew={newFromDetail}
          loading={loadingPersonas}
        />
      )
    },
    {
      key: "detalle",
      label: "Detalle",
      icon: <MdDescription aria-hidden="true" />,
      content: (
        <PersonaForm
          values={values}
          handleChange={handleChange}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={onSave}
          onNew={newFromDetail}
          selection={personaSeleccionada}
          onToggleStatus={onToggleStatus}
        />
      )
    }
  ], [
    personasList, columnas, onRowSelect, newFromDetail, loadingPersonas,
    values, handleChange, isEditing, setIsEditing, onSave, personaSeleccionada,
    onToggleStatus
  ]);

  const navigate = useNavigate();

  return (
    // <MainLayout rightPanel={<PersonaMetricsSidebar />}>
    <MainLayout>
      <div className="flex flex-col h-full bg-slate-50">
        <Breadcrumb
          showBackButton={true}
          items={[
            { label: "Home", icon: <FaHome aria-hidden="true" />, onClick: () => navigate("/dashboard") },
            { label: "Personas", icon: <MdPeople aria-hidden="true" /> },
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
