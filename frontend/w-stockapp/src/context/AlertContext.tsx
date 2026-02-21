import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    title: string;
    message?: string;
    type: AlertType;
}

interface ModalAlert {
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isConfirm?: boolean;
}

interface AlertContextType {
    toasts: Toast[];
    modal: ModalAlert;
    addToast: (title: string, type?: AlertType, message?: string) => void;
    removeToast: (id: string) => void;
    showModal: (options: Omit<ModalAlert, 'isOpen'>) => Promise<boolean>;
    hideModal: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [modal, setModal] = useState<ModalAlert>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const addToast = useCallback((title: string, type: AlertType = 'success', message?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const [modalPromise, setModalPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const showModal = useCallback((options: Omit<ModalAlert, 'isOpen'>): Promise<boolean> => {
        return new Promise((resolve) => {
            setModal({ ...options, isOpen: true });
            setModalPromise({ resolve });
        });
    }, []);

    const hideModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (modalPromise) {
            modalPromise.resolve(false);
            setModalPromise(null);
        }
    }, [modalPromise]);

    const handleConfirm = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (modalPromise) {
            modalPromise.resolve(true);
            setModalPromise(null);
        }
        if (modal.onConfirm) modal.onConfirm();
    }, [modalPromise, modal.onConfirm]);

    const handleCancel = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (modalPromise) {
            modalPromise.resolve(false);
            setModalPromise(null);
        }
        if (modal.onCancel) modal.onCancel();
    }, [modalPromise, modal.onCancel]);

    return (
        <AlertContext.Provider value={{
            toasts,
            modal,
            addToast,
            removeToast,
            showModal,
            hideModal
        }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <AlertModal modal={modal} onConfirm={handleConfirm} onCancel={handleCancel} />
        </AlertContext.Provider>
    );
};

// --- Sub-components (could be moved to separate files, but for now kept here for simplicity) ---

import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 duration-500 min-w-[300px] bg-white/90 backdrop-blur-xl ${toast.type === 'success' ? 'border-green-100' :
                            toast.type === 'error' ? 'border-red-100' :
                                toast.type === 'warning' ? 'border-amber-100' : 'border-blue-100'
                        }`}
                >
                    <div className={`p-2 rounded-xl text-xl ${toast.type === 'success' ? 'bg-green-500/10 text-green-600' :
                            toast.type === 'error' ? 'bg-red-500/10 text-red-600' :
                                toast.type === 'warning' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>
                        {toast.type === 'success' && <FiCheckCircle />}
                        {toast.type === 'error' && <FiXCircle />}
                        {toast.type === 'warning' && <FiAlertTriangle />}
                        {toast.type === 'info' && <FiInfo />}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-900 leading-tight">{toast.title}</h4>
                        {toast.message && <p className="text-xs text-gray-500 mt-0.5 font-medium">{toast.message}</p>}
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX />
                    </button>
                </div>
            ))}
        </div>
    );
};

const AlertModal: React.FC<{ modal: ModalAlert, onConfirm: () => void, onCancel: () => void }> = ({ modal, onConfirm, onCancel }) => {
    if (!modal.isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={onCancel}></div>
            <div className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-white animate-in zoom-in-95 duration-300">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl ${modal.type === 'success' ? 'bg-green-500/10 text-green-600 shadow-green-100' :
                        modal.type === 'error' ? 'bg-red-500/10 text-red-600 shadow-red-100' :
                            modal.type === 'warning' ? 'bg-amber-500/10 text-amber-600 shadow-amber-100' : 'bg-blue-500/10 text-blue-600 shadow-blue-100'
                    }`}>
                    {modal.type === 'success' && <FiCheckCircle />}
                    {modal.type === 'error' && <FiXCircle />}
                    {modal.type === 'warning' && <FiAlertTriangle />}
                    {modal.type === 'info' && <FiInfo />}
                </div>

                <div className="text-center space-y-4 mb-10">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{modal.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{modal.message}</p>
                </div>

                <div className="flex gap-4">
                    {modal.isConfirm && (
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all active:scale-95"
                        >
                            {modal.cancelText || 'Cancelar'}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 ${modal.type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' :
                                modal.type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' :
                                    'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                            }`}
                    >
                        {modal.confirmText || 'Entendido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const useAlertContext = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlertContext must be used within an AlertProvider');
    }
    return context;
};
