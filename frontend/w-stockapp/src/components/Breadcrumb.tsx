import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

export interface BreadcrumbItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    onBack?: () => void;
    fallbackRoute?: string;
    showBackButton?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    onBack,
    fallbackRoute = "/dashboard",
    showBackButton = false
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(fallbackRoute);
        }
    };

    const hasBackButton = onBack || showBackButton;

    // Filter out items without text (like the home icon fallback)
    const textItems = items.filter(item => item.label && item.label.trim() !== "");
    
    let bloque = "";
    let pantalla = "";
    
    if (textItems.length >= 2) {
        bloque = textItems[0].label;
        pantalla = textItems[textItems.length - 1].label;
    } else if (textItems.length === 1) {
        pantalla = textItems[0].label;
    } else if (items.length > 0) {
        pantalla = items[items.length - 1].label || "Dashboard";
    }

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-[13px] font-medium text-slate-500 mb-6">
            {/* Back Button */}
            {hasBackButton && (
                <>
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-8 h-8 mr-3 rounded-full hover:bg-slate-200/60 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                        title="Volver"
                        aria-label="Volver a la página anterior"
                    >
                        <IoArrowBack size={18} aria-hidden="true" />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-300 mr-4" aria-hidden="true" />
                </>
            )}

            <div className="flex items-center select-none text-slate-600">
                {bloque && (
                    <div className="flex items-center">
                        <span className="font-semibold text-slate-400 capitalize tracking-wide">
                            {bloque}
                        </span>
                        <MdChevronRight className="flex-shrink-0 mx-2 text-slate-300" size={18} aria-hidden="true" />
                    </div>
                )}
                
                <div className="flex items-center">
                    <span className="font-bold text-slate-800 capitalize tracking-wide">
                        {pantalla}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumb;
