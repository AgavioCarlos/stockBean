import React, { useState } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { hacerCorteCaja } from '../CajaService';
import type { ITurnoCaja } from '../punto_venta.interface';

interface Props {
    turnoActivo: ITurnoCaja;
    onCierreExitoso: (turno: ITurnoCaja) => void;
    onClose: () => void;
}

const CierreCajaModal: React.FC<Props> = ({ turnoActivo, onCierreExitoso, onClose }) => {
    const { error: showError, success } = useAlerts();

    const [montoRealForm, setMontoRealForm] = useState<string>('');
    const [procesando, setProcesando] = useState(false);
    const [resultadoCierre, setResultadoCierre] = useState<ITurnoCaja | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const montoStr = montoRealForm.replace(/,/g, '');
        const monto = parseFloat(montoStr);
        if (isNaN(monto) || monto < 0) {
            showError("Validación", "Debes ingresar un monto físico válido (0 o mayor).");
            return;
        }

        setProcesando(true);
        try {
            const turnoCerrado = await hacerCorteCaja({
                idTurno: turnoActivo.idTurno,
                montoReal: monto
            });
            success("Corte de Caja Exitoso", `La caja ha sido cerrada correctamente.`);
            setResultadoCierre(turnoCerrado);
            // No llamamos onCierreExitoso aquí todavía; dejamos que el usuario vea el resumen y presione 'Finalizar'
        } catch (error: any) {
            showError("Error al cerrar caja", error?.message || "Ocurrió un error inesperado.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

                {resultadoCierre ? (
                    // VISTA DE RESULTADO (TICKET Z)
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${(resultadoCierre.diferencia || 0) < 0 ? 'bg-red-100 text-red-600' :
                                    (resultadoCierre.diferencia || 0) > 0 ? 'bg-orange-100 text-orange-600' :
                                        'bg-green-100 text-green-600'
                                }`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {(resultadoCierre.diferencia || 0) < 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                                        (resultadoCierre.diferencia || 0) > 0 ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> :
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    }
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Resumen de Turno</h3>
                            <p className="text-sm text-gray-500 mt-1">Corte Z completado exitosamente</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Monto Esperado (Sistema):</span>
                                <span className="font-semibold text-gray-800">${(resultadoCierre.montoEsperado || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Monto Físico (Declarado):</span>
                                <span className="font-semibold text-gray-800">${(resultadoCierre.montoReal || 0).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Diferencia:</span>
                                <span className={`text-lg font-bold ${(resultadoCierre.diferencia || 0) < 0 ? 'text-red-600' :
                                        (resultadoCierre.diferencia || 0) > 0 ? 'text-orange-600' :
                                            'text-green-600'
                                    }`}>
                                    ${Math.abs(resultadoCierre.diferencia || 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold uppercase tracking-wide ${(resultadoCierre.diferencia || 0) < 0 ? 'text-red-600' :
                                        (resultadoCierre.diferencia || 0) > 0 ? 'text-orange-600' :
                                            'text-green-600'
                                    }`}>
                                    {(resultadoCierre.diferencia || 0) < 0 ? 'FALTANTE' :
                                        (resultadoCierre.diferencia || 0) > 0 ? 'SOBRANTE' :
                                            'CANTIDAD EXACTA'
                                    }
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onCierreExitoso(resultadoCierre)}
                            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                        >
                            Finalizar Cierre
                        </button>
                    </div>

                ) : (
                    // VISTA DE FORMULARIO DE CAPTURA
                    <>
                        <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Corte de Caja (Z)</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Turno #{turnoActivo.idTurno} - Abierto a las {new Date(turnoActivo.fechaApertura).toLocaleTimeString()}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-4 mb-6 text-sm">
                                <p className="font-medium mb-1">Instrucciones:</p>
                                <p>Cuenta el efectivo físico total en tu caja, incluyendo el fondo inicial de <b>${turnoActivo.montoInicial.toFixed(2)}</b>, y escríbelo en el recuadro. El sistema ocultará lo esperado por seguridad y te mostrará la diferencia al finalizar.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="montoRealInput" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Efectivo Físico en Caja:
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm" aria-hidden="true">$</span>
                                        </div>
                                        <input
                                            id="montoRealInput"
                                            name="montoReal"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            autoComplete="off"
                                            value={montoRealForm}
                                            onChange={(e) => setMontoRealForm(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full h-11 pl-7 pr-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all sm:text-sm text-gray-800"
                                            required
                                            autoFocus
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
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200 hover:shadow disabled:opacity-70 flex justify-center items-center"
                                >
                                    {procesando ? (
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        "Cerrar Caja"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CierreCajaModal;
