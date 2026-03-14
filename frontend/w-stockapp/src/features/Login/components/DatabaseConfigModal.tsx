import React, { useState, useEffect } from 'react';
import { FaDatabase, FaServer, FaSave, FaCheckCircle, FaTimesCircle, FaDesktop, FaSync, FaLock } from 'react-icons/fa';
import { apiFetch } from '../../../services/Api';

interface DatabaseConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({ isOpen, onClose, onSaveSuccess }) => {
    const [config, setConfig] = useState({
        host: 'localhost',
        port: '5432',
        database: '',
        username: 'postgres',
        password: '',
        mode: 'LOCAL'
    });

    const [masterPassword, setMasterPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const [testing, setTesting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isBackendUp, setIsBackendUp] = useState<boolean | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    useEffect(() => {
        if (isOpen) {
            checkBackendHealth();
            loadCurrentConfig();
        }
    }, [isOpen]);

    const checkBackendHealth = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/health`);
            setIsBackendUp(res.ok);
        } catch (e) {
            setIsBackendUp(false);
        }
    };

    const loadCurrentConfig = async () => {
        try {
            const data = await apiFetch<any>('/config/database');
            if (data) {
                setConfig(data);
            }
        } catch (err) {
            console.error("Error al cargar configuración:", err);
        }
    };

    if (!isOpen) return null;

    const handleUnlock = async () => {
        setIsUnlocking(true);
        setStatus({ type: null, message: '' });
        try {
            // We use the test endpoint with current config to validate password
            const res = await apiFetch<any>('/config/database/test', {
                method: 'POST',
                headers: { 'X-Config-Password': masterPassword },
                body: JSON.stringify(config)
            });
            
            if (res.success || res.mensaje === 'CONNECTION_FAILED') {
                // If we get here without 401, the password is correct
                setIsUnlocked(true);
            }
        } catch (error: any) {
            if (error.status === 401) {
                setStatus({ type: 'error', message: 'Contraseña maestra incorrecta.' });
            } else {
                setStatus({ type: 'error', message: 'Error al validar contraseña.' });
            }
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
        setStatus({ type: null, message: '' });
    };

    const handleTest = async () => {
        setTesting(true);
        setStatus({ type: null, message: '' });
        try {
            const res = await apiFetch<any>('/config/database/test', {
                method: 'POST',
                headers: {
                    'X-Config-Password': masterPassword
                },
                body: JSON.stringify(config)
            });
            if (res.success) {
                setStatus({ type: 'success', message: '¡Conexión exitosa!' });
            } else {
                setStatus({ type: 'error', message: 'Conexión fallida. Verifique los datos.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'No se pudo conectar al servidor de configuración.' });
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus({ type: null, message: '' });
        try {
            const res = await apiFetch<any>('/config/database', {
                method: 'POST',
                headers: {
                    'X-Config-Password': masterPassword
                },
                body: JSON.stringify(config)
            });
            
            if (res.mensaje === 'RESTARTING') {
                onSaveSuccess();
            } else {
                setStatus({ type: 'error', message: 'Error al solicitar reinicio.' });
            }
        } catch (error: any) {
            if (error.message === 'CONNECTION_FAILED') {
                setStatus({ type: 'error', message: 'No se pudo guardar: La prueba de conexión falló.' });
            } else if (error.status === 401) {
                setStatus({ type: 'error', message: 'Contraseña maestra incorrecta.' });
            } else {
                setStatus({ type: 'error', message: 'Error de servidor al guardar configuración.' });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                    >
                        <FaTimesCircle size={24} />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-white/20 rounded-2xl relative">
                            <FaDatabase size={24} />
                            {isBackendUp !== null && (
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-indigo-600 ${isBackendUp ? 'bg-emerald-500' : 'bg-red-500'}`} title={isBackendUp ? 'Servicio Activo' : 'Servicio Apagado'}></div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Configuración de BD</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-indigo-100 text-sm opacity-80">Parámetros de conexión</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${isBackendUp ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}`}>
                                    {isBackendUp ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {!isUnlocked ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 text-center">
                                <FaLock className="mx-auto text-indigo-600 mb-4 opacity-40" size={32} />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Acceso Restringido</h3>
                            </div>

                            <div className="space-y-2 group">
                                <input 
                                    type="password" 
                                    value={masterPassword} 
                                    onChange={(e) => setMasterPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                                    className="w-full px-5 py-4 bg-white border-2 border-indigo-100 rounded-2xl focus:border-indigo-600 focus:ring-8 focus:ring-indigo-600/[0.03] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-200"
                                    placeholder="Ingrese clave…"
                                    autoFocus
                                />
                            </div>

                            {status.type === 'error' && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake">
                                    <FaTimesCircle className="text-red-500" />
                                    <span className="text-xs font-bold text-red-600">{status.message}</span>
                                </div>
                            )}

                            <button 
                                onClick={handleUnlock}
                                disabled={isUnlocking || !masterPassword}
                                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                                    isUnlocking || !masterPassword ? 'bg-indigo-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-slate-900 active:scale-95 shadow-indigo-100'
                                }`}
                            >
                                {isUnlocking ? (
                                    <div className="flex items-center gap-2">
                                        <FaSync className="animate-spin" />
                                        <span className="uppercase text-xs tracking-widest">Validando…</span>
                                    </div>
                                ) : (
                                    <span className="uppercase text-xs tracking-widest">Desbloquear</span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Modo de Operación</label>
                                    <div className="relative">
                                        <select 
                                            name="mode" 
                                            value={config.mode} 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all appearance-none font-medium text-slate-700"
                                        >
                                            <option value="LOCAL">📡 LOCAL (Offline-Ready)</option>
                                            <option value="SERVER">🌐 SERVER (Cloud)</option>
                                        </select>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            {config.mode === 'LOCAL' ? <FaDesktop /> : <FaServer />}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Puerto</label>
                                    <input 
                                        type="text" name="port" value={config.port} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                                        placeholder="5432"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Host del Servidor / IP</label>
                                <input 
                                    type="text" name="host" value={config.host} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                                    placeholder="localhost o 127.0.0.1"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Nombre de Base de Datos</label>
                                <input 
                                    type="text" name="database" value={config.database} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                                    placeholder="db_stockapp"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Usuario DB</label>
                                    <input 
                                        type="text" name="username" value={config.username} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">Contraseña DB</label>
                                    <input 
                                        type="password" name="password" value={config.password} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>

                            {status.type && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                                    status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {status.type === 'success' ? <FaCheckCircle className="shrink-0" /> : <FaTimesCircle className="shrink-0" />}
                                    <span className="text-sm font-semibold">{status.message}</span>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleTest}
                                    disabled={testing || saving}
                                    className={`flex-1 py-4 rounded-2xl font-bold transition-all relative overflow-hidden ${
                                        testing ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
                                    }`}
                                >
                                    {testing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <FaSync className="animate-spin" />
                                            <span>Probando...</span>
                                        </div>
                                    ) : 'Probar Conexión'}
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={testing || saving}
                                    className={`flex-[1.5] py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
                                        saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 shadow-indigo-200'
                                    }`}
                                >
                                    <FaSave />
                                    {saving ? 'Aplicando...' : 'Aplicar y Reiniciar'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
