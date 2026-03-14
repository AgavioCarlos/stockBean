import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { consultarEmpresas } from '../services/Empresas';
import {
    consultarSucursalesPorEmpresa
} from '../services/SucursalService';
import { obtenerPorIdUsuario } from '../services/UsuarioSucursalService';
import { Sucursal } from '../interfaces/sucursal.interface';
import { SearchableSelect } from './SearchableSelect';

interface BranchFilterProps {
    onBranchChange: (idSucursal: number | "") => void;
    onEmpresaChange?: (idEmpresa: number | "") => void;
    value?: number | "";
    labelEmpresa?: string;
    labelSucursal?: string;
    placeholderEmpresa?: string;
    placeholderSucursal?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Component to filter by Company and Branch based on user roles (useAuth).
 * It automatically handles the fetching of data and propagates the selection via callbacks.
 */
export const BranchFilter: React.FC<BranchFilterProps> = ({
    onBranchChange,
    onEmpresaChange,
    value,
    labelEmpresa = "Empresa",
    labelSucursal = "Sucursal",
    placeholderEmpresa = "Seleccionar empresa…",
    placeholderSucursal = "Seleccionar sucursal…",
    className = "",
    disabled = false
}) => {
    const { user, isSistem, isAdmin, isGerente, isCajero } = useAuth();

    const [empresasList, setEmpresasList] = useState<any[]>([]);
    const [idEmpresa, setIdEmpresa] = useState<number | "">("");

    const [sucursalesList, setSucursalesList] = useState<Sucursal[]>([]);
    const [idSucursal, setIdSucursal] = useState<number | "">(value || "");

    const [loading, setLoading] = useState(false);

    // Sync internal state with prop
    useEffect(() => {
        if (value !== undefined) {
            setIdSucursal(value);
        }
    }, [value]);

    // Transform lists to options for SearchableSelect
    const empresasOptions = useMemo(() =>
        empresasList.map(emp => ({
            value: emp.idEmpresa,
            label: emp.nombreComercial || emp.razonSocial,
            description: emp.nif ? `NIF: ${emp.nif}` : undefined
        })), [empresasList]);

    const sucursalesOptions = useMemo(() =>
        sucursalesList.map(suc => ({
            value: suc.id_sucursal || (suc as any).idSucursal,
            label: suc.nombre,
            description: suc.direccion ? `Dirección: ${suc.direccion}` : undefined
        })), [sucursalesList]);

    // 1. Initial Load: Load Companies (if SISTEM) or Branches (if others)
    useEffect(() => {
        if (!user) return;

        const loadInitialData = async () => {
            setLoading(true);
            try {
                if (isSistem) {
                    const companies = await consultarEmpresas();
                    setEmpresasList(companies || []);
                } else {
                    // Call UsuarioSucursalController wrapper as requested
                    const userSucs = await obtenerPorIdUsuario(user.id_usuario);
                    const mappedSucs = userSucs.filter(s => s.status).map(us => ({
                        id_sucursal: us.idSucursal,
                        nombre: us.nombre,
                        direccion: us.direccion
                    })) as any;

                    setSucursalesList(mappedSucs);

                    // Auto-select if only one branch or restricted role
                    if (mappedSucs && mappedSucs.length === 1) {
                        const sId = mappedSucs[0].id_sucursal;
                        if (sId) {
                            setIdSucursal(sId);
                            onBranchChange(sId);
                        }
                    } else if (isCajero && mappedSucs.length > 0) {
                        const sId = mappedSucs[0].id_sucursal;
                        setIdSucursal(sId);
                        onBranchChange(sId);
                    }
                }
            } catch (error) {
                console.error("[BranchFilter] Error loading initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [user, isSistem, isCajero, onBranchChange]);

    // 2. Handle Empresa Change
    const handleEmpresaChangeInternal = useCallback(async (val: string | number) => {
        const numVal = val === "" ? "" : Number(val);
        setIdEmpresa(numVal);
        setIdSucursal(""); // Clear branch
        setSucursalesList([]);
        onBranchChange(""); // Clear parent branch
        if (onEmpresaChange) onEmpresaChange(numVal);

        if (numVal) {
            setLoading(true);
            try {
                let sucs = await consultarSucursalesPorEmpresa(Number(numVal));
                
                // Si NO es SISTEM, validamos estrictamente que la sucursal exista en sus permisos
                if (!isSistem && user) {
                    const userSucs = await obtenerPorIdUsuario(user.id_usuario);
                    const allowedIds = new Set(userSucs.filter(u => u.status).map(u => u.idSucursal));
                    sucs = sucs.filter(s => allowedIds.has(s.id_sucursal || (s as any).idSucursal));
                }
                
                setSucursalesList(sucs || []);
            } catch (error) {
                console.error("[BranchFilter] Error loading branches for company:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [onBranchChange, onEmpresaChange]);

    // 3. Handle Sucursal Change
    const handleSucursalChangeInternal = useCallback((val: string | number) => {
        const numVal = val === "" ? "" : Number(val);
        setIdSucursal(numVal);
        onBranchChange(numVal);
    }, [onBranchChange]);

    return (
        <div className={`flex flex-wrap gap-4 items-center ${className}`}>
            {/* Empresa Selector (SISTEM only) */}
            {isSistem && (
                <div className="min-w-[240px]">
                    <SearchableSelect
                        label={labelEmpresa}
                        placeholder={placeholderEmpresa}
                        options={empresasOptions}
                        value={idEmpresa}
                        onChange={handleEmpresaChangeInternal}
                        loading={loading}
                        disabled={disabled}
                    />
                </div>
            )}

            {/* Sucursal Selector (SISTEM, ADMIN, GERENTE, CAJERO) */}
            {(isSistem || isAdmin || isGerente || isCajero) && (
                <div className="min-w-[240px]">
                    <SearchableSelect
                        label={labelSucursal}
                        placeholder={sucursalesList.length === 0 ? "Sin sucursales" : placeholderSucursal}
                        options={sucursalesOptions}
                        value={idSucursal}
                        onChange={handleSucursalChangeInternal}
                        disabled={disabled || (isCajero && sucursalesList.length === 1)}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};
