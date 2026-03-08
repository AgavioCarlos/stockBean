import React from 'react';
import { IoIosSave } from "react-icons/io";
import { MdEdit, MdAdd, MdPowerSettingsNew, MdOutlineDateRange, MdLabel } from "react-icons/md";
import { Marca } from '../../../interfaces/marca.interface';
import { SharedInput } from '../../../components/SharedInput';
import { SharedButton } from '../../../components/SharedButton';
import { StatusBadge } from '../../../components/StatusBadge';
import { WithPermission } from '../../../components/WithPermission';

interface MarcaFormProps {
    values: any;
    handleChange: (e: any) => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (e: React.FormEvent) => void;
    onNew: () => void;
    selection: Marca | null;
    onToggleStatus: (item: Marca) => void;
}

export const MarcaForm: React.FC<MarcaFormProps> = ({
    values,
    handleChange,
    isEditing,
    setIsEditing,
    onSave,
    onNew,
    selection,
    onToggleStatus
}) => {
    return (
        <div className="w-full h-full flex flex-col bg-slate-50/50">
            <form onSubmit={onSave} className="w-full h-full flex flex-col">
                {/* Header Superior */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-10 shadow-sm transition-all">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-800">
                            {selection ? "Ficha de Marca" : "Añadir Nueva Marca"}
                        </h3>
                        {selection && (
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Identificador: #{selection.idMarca?.toString().padStart(4, '0')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && selection && (
                            <>
                                <WithPermission screen="marcas" action="delete">
                                    <SharedButton
                                        type="button"
                                        variant={selection.status ? 'danger' : 'success'}
                                        onClick={() => onToggleStatus(selection)}
                                        title={selection.status ? "Desactivar Marca" : "Reactivar Marca"}
                                        aria-label={selection.status ? "Desactivar" : "Reactivar"}
                                        icon={<MdPowerSettingsNew size={20} aria-hidden="true" />}
                                    >
                                        {selection.status ? 'Desactivar' : 'Activar'}
                                    </SharedButton>
                                </WithPermission>

                                <WithPermission screen="marcas" action="update">
                                    <SharedButton
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        title="Editar"
                                        aria-label="Editar"
                                        icon={<MdEdit size={20} aria-hidden="true" />}
                                    >
                                        Editar
                                    </SharedButton>
                                </WithPermission>
                            </>
                        )}

                        {isEditing && (
                            <WithPermission screen="marcas" action="update">
                                <SharedButton
                                    type="submit"
                                    variant="primary"
                                    className="shadow-md shadow-blue-500/20"
                                    title="Guardar Marca"
                                    aria-label="Guardar Marca"
                                    icon={<IoIosSave size={20} aria-hidden="true" />}
                                >
                                    Guardar Cambios
                                </SharedButton>
                            </WithPermission>
                        )}

                        {!isEditing && (
                            <WithPermission screen="marcas" action="create">
                                <SharedButton
                                    type="button"
                                    variant="primary"
                                    className="shadow-md shadow-blue-500/20"
                                    onClick={onNew}
                                    title="Nuevo"
                                    aria-label="Nuevo"
                                    icon={<MdAdd size={22} aria-hidden="true" />}
                                >
                                    Nueva Marca
                                </SharedButton>
                            </WithPermission>
                        )}
                    </div>
                </div>

                {/* Formulario Principal */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Ficha Resumen */}
                    {!isEditing && selection && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative group">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/30 transform group-hover:scale-105 transition-transform">
                                        <MdLabel size={40} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">{values.nombre}</h4>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <StatusBadge status={selection.status} trueText="Activo" falseText="Inactivo" />
                                    {values.fechaAlta && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                            <MdOutlineDateRange />
                                            Registro: {new Date(values.fechaAlta).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-3xl"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <MdLabel size={24} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">Información de la Marca</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <SharedInput
                                        label="Nombre de la Marca"
                                        id="nombre"
                                        name="nombre"
                                        value={values.nombre}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                        placeholder="Ej. Samsung, Nike, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Estado del Sistema</h4>
                                <div className="space-y-5 cursor-default">
                                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <span className="text-sm font-semibold text-slate-600">Estatus</span>
                                        <StatusBadge status={values.status ?? true} trueText="Activo" falseText="Inactivo" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <span className="text-sm font-semibold text-slate-600">Alta</span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {values.fechaAlta ? new Date(values.fechaAlta).toLocaleDateString() : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="text-center pb-12 pt-4">
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <MdOutlineDateRange className="animate-pulse" size={18} />
                                Modo de edición activado. Recuerda guardar tus cambios.
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
