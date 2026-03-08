import React, { useState } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { registrarMovimiento } from '../CajaService';
import type { ITurnoCaja } from '../punto_venta.interface';

interface Props {
    turnoActivo: ITurnoCaja;
    onClose: () => void;
}

const MovimientoCajaModal: React.FC<Props> = ({ turnoActivo, onClose }) => {
    const { error: showError, success } = useAlerts();

    const [tipoForm, setTipoForm] = useState<"ENTRADA" | "RETIRO">('RETIRO');
    const [conceptoForm, setConceptoForm] = useState('');
    const [montoForm, setMontoForm] = useState('');

    const [procesando, setProcesando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const montoStr = montoForm.replace(/,/g, '');
        const monto = parseFloat(montoStr);
        if (isNaN(monto) || monto <= 0) {
            showError("Validación", "El monto debe ser mayor a 0.");
            return;
        }
        if (!conceptoForm.trim()) {
            showError("Validación", "Debe incluir un concepto para este arqueo.");
            return;
        }

        setProcesando(true);
        try {
            await registrarMovimiento({
                idTurno: turnoActivo.idTurno,
                tipoMovimiento: tipoForm,
                concepto: conceptoForm.trim(),
                monto
            });
            success("Movimiento registrado", `Se registró un(a) ${tipoForm.toLowerCase()} por $${monto.toFixed(2)}.`);
            onClose();
        } catch (error: any) {
            showError("Error al registrar movimiento", error?.message || "Ocurrió un error inesperado.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <div className="px-6 py-4 border-b border-gray-100 bg-sky-50/50">
                    <h3 className="text-xl font-bold text-gray-800">Arqueo de Efectivo</h3>
                    <p className="text-sm text-gray-500 mt-1">Registra dinero extraído de la caja o fondos añadidos.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="tipoMovimiento" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tipo de Movimiento:
                            </label>
                            <select
                                id="tipoMovimiento"
                                name="tipoMovimiento"
                                value={tipoForm}
                                onChange={(e) => setTipoForm(e.target.value as "ENTRADA" | "RETIRO")}
                                className="w-full h-11 px-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all sm:text-sm text-gray-800"
                                required
                            >
                                <option value="RETIRO">Retiro de Caja (Salida)</option>
                                <option value="ENTRADA">Entrada / Cambio (Ingreso)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="conceptoInput" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Concepto:
                            </label>
                            <input
                                id="conceptoInput"
                                name="concepto"
                                type="text"
                                placeholder="Ej: Pago de agua, Fondo para cambio..."
                                value={conceptoForm}
                                onChange={(e) => setConceptoForm(e.target.value)}
                                className="w-full h-11 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all sm:text-sm text-gray-800"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="montoArqueoInput" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Monto:
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm" aria-hidden="true">$</span>
                                </div>
                                <input
                                    id="montoArqueoInput"
                                    name="monto"
                                    type="number"
                                    inputMode="decimal"
                                    min="0.01"
                                    step="0.01"
                                    autoComplete="off"
                                    value={montoForm}
                                    onChange={(e) => setMontoForm(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full h-11 pl-7 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all sm:text-sm text-gray-800"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            disabled={procesando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={procesando}
                            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center ${tipoForm === 'RETIRO' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-500 hover:bg-green-600 shadow-green-200'
                                }`}
                        >
                            {procesando ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                "Registrar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovimientoCajaModal;
