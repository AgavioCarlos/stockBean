import { useState } from 'react';
import { FaCreditCard, FaPaypal, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface Plan {
    id_plan: number;
    nombre: string;
    descripcion: string;
    precioMensual: number;
    precioAnual: number;
    caracteristicas: string;
}

interface PaymentGatewayProps {
    plan: Plan | null;
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess?: (plan: Plan, paymentMethod: string) => void;
}

type PaymentMethod = 'card' | 'paypal';

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ plan, isOpen, onClose, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [isProcessing, setIsProcessing] = useState(false);

    // Estados del formulario de tarjeta
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');

    if (!isOpen || !plan) return null;

    // Calcular precio según ciclo de facturación
    const precio = billingCycle === 'monthly' ? plan.precioMensual : plan.precioAnual;

    /**
     * Formatear número de tarjeta con espacios cada 4 dígitos
     */
    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    /**
     * Formatear fecha de expiración MM/YY
     */
    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    /**
     * Validar número de tarjeta usando algoritmo de Luhn
     */
    const validateCardNumber = (number: string): boolean => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.length !== 16) return false;

        let sum = 0;
        let isEven = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };

    /**
     * Procesar pago con tarjeta
     */
    const handleCardPayment = async () => {
        // Validaciones
        if (!cardName.trim()) {
            Swal.fire('Error', 'Ingresa el nombre del titular', 'error');
            return;
        }

        if (!validateCardNumber(cardNumber)) {
            Swal.fire('Error', 'Número de tarjeta inválido', 'error');
            return;
        }

        if (cardExpiry.length !== 5) {
            Swal.fire('Error', 'Fecha de expiración inválida (MM/YY)', 'error');
            return;
        }

        if (cardCVV.length !== 3) {
            Swal.fire('Error', 'CVV inválido (3 dígitos)', 'error');
            return;
        }

        // Simular procesamiento de pago
        setIsProcessing(true);

        // Simular delay de la pasarela de pago
        await new Promise(resolve => setTimeout(resolve, 2500));

        setIsProcessing(false);

        // Mostrar confirmación exitosa
        Swal.fire({
            icon: 'success',
            title: '¡Pago Exitoso!',
            html: `
        <div class="text-left">
          <p class="mb-2"><strong>Plan:</strong> ${plan.nombre}</p>
          <p class="mb-2"><strong>Ciclo:</strong> ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}</p>
          <p class="mb-2"><strong>Monto:</strong> $${precio.toFixed(2)}</p>
          <p class="mb-2"><strong>Método:</strong> Tarjeta ****${cardNumber.slice(-4)}</p>
          <p class="text-sm text-gray-600 mt-4">Tu suscripción ha sido activada correctamente.</p>
        </div>
      `,
            confirmButtonText: 'Continuar'
        }).then(() => {
            if (onPaymentSuccess) {
                onPaymentSuccess(plan, 'Tarjeta de Crédito');
            }
            onClose();
        });
    };

    /**
     * Procesar pago con PayPal (simulado)
     */
    const handlePayPalPayment = async () => {
        setIsProcessing(true);

        // Simular redirección a PayPal y procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);

        // Mostrar confirmación exitosa
        Swal.fire({
            icon: 'success',
            title: '¡Pago con PayPal Exitoso!',
            html: `
        <div class="text-left">
          <p class="mb-2"><strong>Plan:</strong> ${plan.nombre}</p>
          <p class="mb-2"><strong>Ciclo:</strong> ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}</p>
          <p class="mb-2"><strong>Monto:</strong> $${precio.toFixed(2)}</p>
          <p class="mb-2"><strong>Método:</strong> PayPal</p>
          <p class="text-sm text-gray-600 mt-4">Tu suscripción ha sido activada correctamente.</p>
        </div>
      `,
            confirmButtonText: 'Continuar'
        }).then(() => {
            if (onPaymentSuccess) {
                onPaymentSuccess(plan, 'PayPal');
            }
            onClose();
        });
    };

    /**
     * Manejar envío del formulario
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'card') {
            handleCardPayment();
        } else {
            handlePayPalPayment();
        }
    };

    return (
        // Fondo con blur glassmorphism en lugar de negro sólido
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            {/* Modal con fondo semi-transparente y efecto glassmorphism */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/50 animate-fadeIn">
                {/* Header con degradado azul moderno */}
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90 hover:scale-110"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        💳 Pasarela de Pago
                    </h2>
                    <p className="text-blue-50">Completa tu suscripción al plan {plan.nombre}</p>
                </div>

                {/* Resumen del Plan con degradado suave */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-5 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            Resumen de Compra
                        </h3>
                    </div>

                    {/* Selector de ciclo de facturación mejorado */}
                    <div className="mb-4 flex gap-3">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md'
                                }`}
                        >
                            <div className="font-semibold">📅 Mensual</div>
                            <div className="text-sm">${plan.precioMensual.toFixed(2)}/mes</div>
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 relative ${billingCycle === 'annual'
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg shadow-green-500/50'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-400 hover:shadow-md'
                                }`}
                        >
                            {/* Badge de ahorro */}
                            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                                ¡Ahorra!
                            </span>
                            <div className="font-semibold">🗓️ Anual</div>
                            <div className="text-sm">${plan.precioAnual.toFixed(2)}/año</div>
                            <div className={`text-xs mt-1 ${billingCycle === 'annual' ? 'text-green-100' : 'text-green-600 font-semibold'}`}>
                                +${((plan.precioMensual * 12) - plan.precioAnual).toFixed(2)} de descuento
                            </div>
                        </button>
                    </div>

                    {/* Total con estilo destacado */}
                    <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <span className="text-gray-700 font-medium">💰 Total a pagar:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${precio.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Selector de Método de Pago */}
                <div className="p-6">
                    <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        Método de Pago
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`py-4 px-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${paymentMethod === 'card'
                                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg shadow-blue-500/30'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md text-gray-600'
                                }`}
                        >
                            <FaCreditCard size={24} />
                            <span className="font-semibold">Tarjeta</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('paypal')}
                            className={`py-4 px-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${paymentMethod === 'paypal'
                                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-sky-50 text-blue-700 shadow-lg shadow-blue-500/30'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md text-gray-600'
                                }`}
                        >
                            <FaPaypal size={24} />
                            <span className="font-semibold">PayPal</span>
                        </button>
                    </div>

                    {/* Formulario de Pago */}
                    <form onSubmit={handleSubmit}>
                        {paymentMethod === 'card' ? (
                            <div className="space-y-4">
                                {/* Número de Tarjeta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        💳 Número de Tarjeta
                                    </label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const formatted = formatCardNumber(e.target.value);
                                            if (formatted.replace(/\s/g, '').length <= 16) {
                                                setCardNumber(formatted);
                                            }
                                        }}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        maxLength={19}
                                        required
                                    />
                                </div>

                                {/* Nombre del Titular */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        👤 Nombre del Titular
                                    </label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        placeholder="JUAN PÉREZ"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>

                                {/* Fecha de Expiración y CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            📅 Expiración
                                        </label>
                                        <input
                                            type="text"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            placeholder="12/25"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            maxLength={5}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🔒 CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={cardCVV}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 3) setCardCVV(value);
                                            }}
                                            placeholder="123"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                                <FaPaypal size={64} className="mx-auto mb-4 text-blue-600" />
                                <p className="text-gray-700 mb-2 font-medium">Serás redirigido a PayPal para completar el pago de forma segura.</p>
                                <p className="text-sm text-gray-600">
                                    Simularemos el proceso de pago con PayPal al hacer clic en "Pagar Ahora".
                                </p>
                            </div>
                        )}

                        {/* Botón de Pago */}
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 transform ${isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <FaSpinner className="animate-spin" size={20} />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle size={20} />
                                    <span>Pagar ${precio.toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Nota de seguridad */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800 text-center flex items-center justify-center gap-2">
                            <span>🔒</span>
                            <span>Esta es una pasarela de pago simulada. No se procesarán cargos reales.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
