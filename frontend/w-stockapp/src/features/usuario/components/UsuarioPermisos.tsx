import React, { useState, useEffect, useCallback } from 'react';
import { MdSecurity, MdSave, MdCheckBox, MdCheckBoxOutlineBlank, MdLock } from 'react-icons/md';
import { SharedButton } from '../../../components/SharedButton';
import { apiFetch } from '../../../services/Api';
import Swal from 'sweetalert2';

// ---- Tipos ----
// interface Pantalla {
//     idPantalla: number;
//     nombre: string;
//     clave: string;
// }

// interface Accion {
//     idAccion: number;
//     nombre: string;
// }

interface PermisoGuardado {
    idPantalla: number;
    idAccion: number;
    permitido: boolean;
}

// Cada celda del grid
interface CeldaPermiso {
    idAccion: number;
    nombreAccion: string;
    permitido: boolean;
}

// Una fila (pantalla + sus acciones)
interface FilaPermiso {
    idPantalla: number;
    nombre: string;
    clave: string;
    acciones: CeldaPermiso[];
}

interface UsuarioPermisosProps {
    idUsuario: number;
    idRolUsuario?: number;
}

// ---- Estilos ----
const ACCION_COLORS: Record<string, string> = {
    'view': 'bg-sky-50 text-sky-700 border-sky-200',
    'create': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'update': 'bg-amber-50 text-amber-700 border-amber-200',
    'delete': 'bg-rose-50 text-rose-700 border-rose-200',
    'export': 'bg-violet-50 text-violet-700 border-violet-200',
};

const ACCION_LABELS: Record<string, string> = {
    'view': 'Ver',
    'create': 'Crear',
    'update': 'Editar',
    'delete': 'Eliminar',
    'export': 'Exportar',
};

// Acciones que se bloquean cuando "view" está deshabilitado
const ACCIONES_BLOQUEADAS_SIN_VER = ['create', 'update', 'delete'];

// Orden preferido de acciones (view siempre primero)
const ACCION_ORDER: Record<string, number> = {
    'view': 0,
    'create': 1,
    'update': 2,
    'delete': 3,
};

// Acciones CRUD hardcodeadas (columnas de admin_usuario_pantalla)
const ACCIONES_FIJAS: Accion[] = [
    { idAccion: 1, nombre: 'view' },
    { idAccion: 2, nombre: 'create' },
    { idAccion: 3, nombre: 'update' },
    { idAccion: 4, nombre: 'delete' },
];

interface Accion {
    idAccion: number;
    nombre: string;
}

// ---- Helpers ----
function getIdEmpresaFromStorage(): number | null {
    try {
        // 1) Intenta leer id_empresa guardado directamente
        const idDirect = localStorage.getItem('id_empresa');
        if (idDirect && !isNaN(Number(idDirect))) return Number(idDirect);

        // 2) Busca dentro del user_data → permisos_crud (las keys son los id_empresa)
        const userData = localStorage.getItem("user_data");
        if (userData) {
            const parsed = JSON.parse(userData);

            // Las claves del objeto permisos_crud son los id_empresa
            if (parsed.permisos_crud && typeof parsed.permisos_crud === 'object') {
                const keys = Object.keys(parsed.permisos_crud);
                if (keys.length > 0) return Number(keys[0]);
            }

            // Fallback: buscar en el array empresa si tiene id_empresa
            if (parsed.empresa && Array.isArray(parsed.empresa) && parsed.empresa.length > 0) {
                const primera = parsed.empresa[0];
                if (primera.id_empresa) return Number(primera.id_empresa);
                if (primera.idEmpresa) return Number(primera.idEmpresa);
            }
        }
    } catch (e) {
        console.error("Error obteniendo id_empresa del localStorage:", e);
    }
    return null;
}

// ---- Componente ----
export const UsuarioPermisos: React.FC<UsuarioPermisosProps> = ({ idUsuario, idRolUsuario: _idRolUsuario }) => {
    const [matriz, setMatriz] = useState<FilaPermiso[]>([]);
    const [accionesHeader, setAccionesHeader] = useState<Accion[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [idEmpresa] = useState<number | null>(getIdEmpresaFromStorage);

    // Cargar pantallas y permisos existentes del usuario
    const cargarDatos = useCallback(async () => {
        if (!idUsuario || !idEmpresa) return;
        setLoading(true);
        try {
            // 1) Traer pantallas filtradas por esRoot y permisos del usuario
            const [permisosData] = await Promise.all([
                apiFetch<any[]>(`/usuarios-acciones/${idUsuario}?idEmpresa=${idEmpresa}`)
            ]);

            const permisosExistentes = permisosData || [];

            // Usar acciones fijas CRUD
            const accionesOrdenadas = [...ACCIONES_FIJAS].sort((a, b) => {
                const orderA = ACCION_ORDER[a.nombre] ?? 99;
                const orderB = ACCION_ORDER[b.nombre] ?? 99;
                return orderA - orderB;
            });

            setAccionesHeader(accionesOrdenadas);

            // 2) Construir la matriz desde la respuesta del backend
            //    El backend ya devuelve las pantallas correctas filtradas por esRoot
            const nuevaMatriz: FilaPermiso[] = permisosExistentes.map(row => ({
                idPantalla: row.idPantalla,
                nombre: row.pantallaNombre,
                clave: row.pantallaClave || '',
                acciones: (row.acciones || []).map((acc: any) => ({
                    idAccion: acc.idAccion,
                    nombreAccion: acc.nombre,
                    permitido: acc.permitido === true
                }))
            }));

            setMatriz(nuevaMatriz);
            setHasChanges(false);
        } catch (error) {
            console.error("Error al cargar datos de permisos:", error);
        } finally {
            setLoading(false);
        }
    }, [idUsuario, idEmpresa]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Determinar si una fila tiene "ver" habilitado
    const tieneVerHabilitado = (row: FilaPermiso): boolean => {
        const accionVer = row.acciones.find(a => a.nombreAccion === 'view');
        return accionVer?.permitido ?? false;
    };

    // Verificar si una acción está bloqueada por falta de "ver"
    const estaAccionBloqueada = (row: FilaPermiso, nombreAccion: string): boolean => {
        if (nombreAccion === 'view') return false; // "view" nunca se bloquea
        if (!ACCIONES_BLOQUEADAS_SIN_VER.includes(nombreAccion)) return false;
        return !tieneVerHabilitado(row);
    };

    // Toggle de un checkbox individual
    const togglePermiso = (idxPantalla: number, idxAccion: number) => {
        setMatriz(prev => {
            const copy = [...prev];
            const row = { ...copy[idxPantalla] };
            const acciones = [...row.acciones];
            const accionActual = acciones[idxAccion];

            // Si se está desactivando "view", también desactivar create, delete, export
            if (accionActual.nombreAccion === 'view' && accionActual.permitido) {
                acciones[idxAccion] = { ...accionActual, permitido: false };
                // Desactivar las acciones bloqueadas
                for (let i = 0; i < acciones.length; i++) {
                    if (ACCIONES_BLOQUEADAS_SIN_VER.includes(acciones[i].nombreAccion)) {
                        acciones[i] = { ...acciones[i], permitido: false };
                    }
                }
            } else {
                acciones[idxAccion] = { ...accionActual, permitido: !accionActual.permitido };
            }

            row.acciones = acciones;
            copy[idxPantalla] = row;
            return copy;
        });
        setHasChanges(true);
    };

    // Toggle de toda una fila
    const toggleFilaCompleta = (idxPantalla: number) => {
        setMatriz(prev => {
            const copy = [...prev];
            const row = { ...copy[idxPantalla] };
            const allEnabled = row.acciones.every(a => a.permitido);
            row.acciones = row.acciones.map(a => ({ ...a, permitido: !allEnabled }));
            copy[idxPantalla] = row;
            return copy;
        });
        setHasChanges(true);
    };

    // Guardar
    const guardar = async () => {
        if (!idEmpresa) return;
        setSaving(true);
        try {
            const payload: PermisoGuardado[] = matriz.flatMap(row =>
                row.acciones.map(a => ({
                    idPantalla: row.idPantalla,
                    idAccion: a.idAccion,
                    permitido: a.permitido
                }))
            );
            await apiFetch(`/usuarios-acciones/${idUsuario}?idEmpresa=${idEmpresa}`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            setHasChanges(false);
            Swal.fire({ icon: 'success', title: '¡Permisos guardados!', text: 'Los permisos se actualizaron correctamente.', timer: 2000, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron guardar los permisos.' });
        } finally {
            setSaving(false);
        }
    };

    // Estados vacíos
    if (!idUsuario) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <MdSecurity size={48} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">Selecciona un usuario para gestionar sus permisos.</p>
            </div>
        );
    }

    if (!idEmpresa) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <MdSecurity size={48} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">No se encontró una empresa asociada a tu sesión.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-3xl"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <MdSecurity size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-800">Permisos de Acciones (CRUD)</h4>
                        <p className="text-xs text-slate-400 font-medium">Controla qué puede hacer este usuario en cada pantalla</p>
                    </div>
                </div>

                {hasChanges && (
                    <SharedButton
                        onClick={guardar}
                        variant="success"
                        size="sm"
                        disabled={saving}
                        icon={<MdSave size={18} />}
                    >
                        {saving ? 'Guardando...' : 'Guardar Permisos'}
                    </SharedButton>
                )}
            </div>

            {/* Body / Grid */}
            <div className="p-6 overflow-x-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-2"></div>
                        <span className="text-xs font-medium text-slate-500">Cargando permisos…</span>
                    </div>
                ) : matriz.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <MdSecurity size={40} className="mb-3 opacity-40" />
                        <p className="text-sm font-medium">No hay pantallas registradas en el sistema.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-[250px]">
                                    Pantalla
                                </th>
                                {accionesHeader.map((accion) => (
                                    <th key={accion.idAccion} className="text-center px-3 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${ACCION_COLORS[accion.nombre] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {ACCION_LABELS[accion.nombre] || accion.nombre}
                                        </span>
                                    </th>
                                ))}
                                <th className="text-center px-3 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Todos
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {matriz.map((row, idxPantalla) => {
                                const allChecked = row.acciones.every(a => a.permitido);
                                return (
                                    <tr key={row.idPantalla} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                                    {row.nombre}
                                                </span>
                                                {row.clave && (
                                                    <span className="text-[10px] text-slate-400 font-mono">{row.clave}</span>
                                                )}
                                            </div>
                                        </td>
                                        {row.acciones.map((accion, idxAccion) => {
                                            const bloqueada = estaAccionBloqueada(row, accion.nombreAccion);
                                            const esVer = accion.nombreAccion === 'view';
                                            return (
                                                <td key={accion.idAccion} className={`text-center px-3 py-3.5 ${bloqueada ? 'opacity-40' : ''}`}>
                                                    {bloqueada ? (
                                                        <span
                                                            className="inline-flex items-center justify-center p-1 rounded-lg text-slate-300 cursor-not-allowed"
                                                            title={`Habilita "Ver" para poder gestionar ${ACCION_LABELS[accion.nombreAccion] || accion.nombreAccion}`}
                                                        >
                                                            <MdLock size={20} />
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePermiso(idxPantalla, idxAccion)}
                                                            className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${accion.permitido
                                                                ? esVer
                                                                    ? 'text-sky-600 hover:bg-sky-50'
                                                                    : 'text-emerald-600 hover:bg-emerald-50'
                                                                : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                                                                }`}
                                                            title={`${accion.permitido ? 'Revocar' : 'Otorgar'} ${ACCION_LABELS[accion.nombreAccion] || accion.nombreAccion} en ${row.nombre}`}
                                                        >
                                                            {accion.permitido ? <MdCheckBox size={24} /> : <MdCheckBoxOutlineBlank size={24} />}
                                                        </button>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="text-center px-3 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => toggleFilaCompleta(idxPantalla)}
                                                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${allChecked
                                                    ? 'text-amber-600 hover:bg-amber-50'
                                                    : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                                                    }`}
                                                title={`${allChecked ? 'Revocar' : 'Otorgar'} todos los permisos en ${row.nombre}`}
                                            >
                                                {allChecked ? <MdCheckBox size={24} /> : <MdCheckBoxOutlineBlank size={24} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
