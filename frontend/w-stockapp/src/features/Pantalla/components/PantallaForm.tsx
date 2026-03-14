import React, { useState, useEffect } from 'react';
import { IoIosSave } from "react-icons/io";
import { MdEdit, MdAdd, MdPowerSettingsNew, MdPictureInPicture } from "react-icons/md";
import type { IPantalla } from '../pantalla.interface';
import { SharedInput } from '../../../components/SharedInput';
import { SharedButton } from '../../../components/SharedButton';
import { StatusBadge } from '../../../components/StatusBadge';
import { PantallasPadres } from '../../../services/Lovs';

interface PantallaFormProps {
    values: any;
    handleChange: (e: any) => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    onSave: (e: React.FormEvent) => void;
    onNew: () => void;
    selection: IPantalla | null;
    onToggleStatus: (item: IPantalla) => void;
}

export const PantallaForm: React.FC<PantallaFormProps> = ({
    values,
    handleChange,
    isEditing,
    setIsEditing,
    onSave,
    onNew,
    selection,
    onToggleStatus
}) => {
    const [padres, setPadres] = useState<IPantalla[]>([]);

    useEffect(() => {
        PantallasPadres().then(setPadres).catch(console.error);
    }, []);

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        handleChange({
            target: {
                name,
                value: checked
            }
        });
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-50/50 overflow-auto">
            <form onSubmit={onSave} className="w-full h-full flex flex-col min-h-0">
                {/* Header Superior */}
                <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-10 shadow-sm transition-all">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-800">
                            {selection ? "Ficha de Pantalla" : "Añadir Nueva Pantalla"}
                        </h3>
                        {selection && (
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Identificador: #{selection.idPantalla?.toString().padStart(4, '0')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing && selection && (
                            <>
                                <SharedButton
                                    type="button"
                                    variant={selection.status ? 'danger' : 'success'}
                                    className={`shadow-sm transition-all ${selection.status ? 'hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}`}
                                    onClick={() => onToggleStatus(selection)}
                                    title={selection.status ? "Desactivar Pantalla" : "Reactivar Pantalla"}
                                    aria-label={selection.status ? "Desactivar" : "Reactivar"}
                                    icon={<MdPowerSettingsNew size={20} aria-hidden="true" />}
                                >
                                    {selection.status ? 'Desactivar' : 'Activar'}
                                </SharedButton>

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
                            </>
                        )}

                        {isEditing && (
                            <SharedButton
                                type="submit"
                                variant="primary"
                                className="shadow-md shadow-blue-500/20"
                                title="Guardar Pantalla"
                                aria-label="Guardar Pantalla"
                                icon={<IoIosSave size={20} aria-hidden="true" />}
                            >
                                Guardar Cambios
                            </SharedButton>
                        )}

                        {!isEditing && (
                            <SharedButton
                                type="button"
                                variant="primary"
                                className="shadow-md shadow-blue-500/20"
                                onClick={onNew}
                                title="Nuevo"
                                aria-label="Nuevo"
                                icon={<MdAdd size={22} aria-hidden="true" />}
                            >
                                Nueva Pantalla
                            </SharedButton>
                        )}
                    </div>
                </div>

                {/* Formulario Principal */}
                <div className="flex-1 p-6 md:p-10 w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-3xl"></div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <MdPictureInPicture size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Detalles de la Pantalla</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <SharedInput
                                label="Nombre"
                                id="nombre"
                                name="nombre"
                                value={values.nombre || ''}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="Ej. Tablero"
                            />
                            <SharedInput
                                label="Clave"
                                id="clave"
                                name="clave"
                                value={values.clave || ''}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="Ej. DASHBOARD"
                            />
                            <SharedInput
                                label="Ruta (URL)"
                                id="ruta"
                                name="ruta"
                                value={values.ruta || ''}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="Ej. /dashboard"
                            />
                            <SharedInput
                                label="Icono (Clase o nombre)"
                                id="icono"
                                name="icono"
                                value={values.icono || ''}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="Ej. FaHome"
                            />
                            
                            <div className="relative flex flex-col pt-1">
                                <label className="text-sm font-semibold text-slate-700 mb-2">Pantalla Padre</label>
                                {isEditing ? (
                                    <select
                                        name="idPadre"
                                        value={values.idPadre || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
                                    >
                                        <option value="">Ninguno (Es Root o Sin Padre)</option>
                                        {padres.map((p) => (
                                            <option key={p.idPantalla} value={p.idPantalla}>
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-600 font-medium">
                                        {values.idPadre ? padres.find(p => p.idPantalla === values.idPadre)?.nombre || values.idPadre : 'Ninguno'}
                                    </div>
                                )}
                            </div>

                            <SharedInput
                                label="Orden sugerido (Opcional)"
                                id="orden"
                                name="orden"
                                type="number"
                                value={values.orden || ''}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="Se asignará automático si se deja vacío"
                            />

                            <div className="pt-2 flex items-center justify-start gap-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="esMenu" 
                                        checked={values.esMenu || false} 
                                        onChange={handleCheckChange} 
                                        disabled={!isEditing}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">¿Aparece en Menú?</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="esRoot" 
                                        checked={values.esRoot || false} 
                                        onChange={handleCheckChange} 
                                        disabled={!isEditing}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">¿Es Root?</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
