import React from 'react';
import { FaMoneyBillWave, FaBuilding, FaInfoCircle, FaTimes } from 'react-icons/fa';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded-full"
                >
                    <FaTimes />
                </button>

                <div className="p-8">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm mx-auto">
                        <FaMoneyBillWave className="text-3xl text-indigo-600" />
                    </div>

                    <h2 className="text-2xl font-black text-center text-gray-800 mb-2">Pago Pendiente</h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">
                        {message || 'Tu suscripción no está activa. Por favor realiza el pago para continuar utilizando el sistema.'}
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FaBuilding /> Datos Bancarios
                        </h3>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-500">Banco:</span>
                                <span className="font-bold text-gray-900">BBVA</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-500">Beneficiario:</span>
                                <span className="font-bold text-gray-900">Carlos Ignacio Agavio Trujillo</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-500">Cuenta:</span>
                                <span className="font-mono font-bold tracking-wider text-indigo-700">1572091847</span>
                            </div>
                            <div className="flex justify-between items-center pb-1">
                                <span className="font-semibold text-gray-500">CLABE:</span>
                                <span className="font-mono font-bold tracking-wider text-indigo-700">012180015720918472</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 flex gap-3 text-amber-800 items-start border border-amber-100">
                        <FaInfoCircle className="mt-1 flex-shrink-0 text-amber-500" />
                        <p className="text-xs font-medium leading-relaxed">
                            Realiza la transferencia y guarda tu comprobante. <strong>Al recibir el pago, la administración confirmará tu acceso en un periodo máximo de 24 horas.</strong>
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-4 px-6 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all hover:shadow-lg active:scale-95"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
