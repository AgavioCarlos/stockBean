import { useState } from "react";
import { FaCreditCard, FaPaypal, FaMoneyBillWave } from "react-icons/fa";

interface Props {
    onSubmit: (paymentData: any) => void;
    totalAmount: number;
}

export default function Pago({ onSubmit, totalAmount }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cash'>('card');
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("05");
    const [expYear, setExpYear] = useState("2025");
    const [cvv, setCvv] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            method: paymentMethod,
            details: { cardName, cardNumber, expMonth, expYear, cvv }
        });
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8">Your almost there!</h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="mb-8">
                        <label className="block text-gray-500 text-xs uppercase font-bold mb-4">Payment Method</label>
                        <div className="space-y-4">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-purple-600' : 'border-gray-400 group-hover:border-purple-400'}`}>
                                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaCreditCard />
                                    <span className="font-medium">Credit Card</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-purple-600' : 'border-gray-400 group-hover:border-purple-400'}`}>
                                    {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaPaypal />
                                    <span className="font-medium">Paypal</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-purple-600' : 'border-gray-400 group-hover:border-purple-400'}`}>
                                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FaMoneyBillWave />
                                    <span className="font-medium">Efectivo</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="space-y-6 transition-all duration-300">
                            <div>
                                <label className="block text-gray-500 text-xs mb-1">Name on Card:</label>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Carter"
                                    className="w-full border-b border-gray-300 py-2 text-gray-800 focus:outline-none focus:border-purple-600 transition-colors bg-transparent placeholder-gray-400 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs mb-1">Card Number:</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="•••• •••• •••• 2153"
                                    className="w-full border-b border-gray-300 py-2 text-gray-800 focus:outline-none focus:border-purple-600 transition-colors bg-transparent placeholder-gray-400 font-medium"
                                />
                            </div>

                            <div className="flex gap-8">
                                <div className="flex-1">
                                    <label className="block text-gray-500 text-xs mb-1">Expiration Date:</label>
                                    <div className="flex gap-4">
                                        <select
                                            value={expMonth}
                                            onChange={(e) => setExpMonth(e.target.value)}
                                            className="w-full border-b border-gray-300 py-2 text-gray-800 focus:outline-none focus:border-purple-600 transition-colors bg-transparent font-medium appearance-none"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={expYear}
                                            onChange={(e) => setExpYear(e.target.value)}
                                            className="w-full border-b border-gray-300 py-2 text-gray-800 focus:outline-none focus:border-purple-600 transition-colors bg-transparent font-medium appearance-none"
                                        >
                                            {Array.from({ length: 10 }, (_, i) => 2025 + i).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-gray-500 text-xs mb-1">CVV:</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        placeholder="123"
                                        className="w-full border-b border-gray-300 py-2 text-gray-800 focus:outline-none focus:border-purple-600 transition-colors bg-transparent placeholder-gray-400 font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <button
                        type="submit"
                        className="w-full bg-[#4F46E5] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4338ca] transition-colors shadow-lg shadow-indigo-200"
                    >
                        Check Out ${totalAmount.toFixed(2)}
                    </button>
                </div>
            </form>
        </div>
    );
}
