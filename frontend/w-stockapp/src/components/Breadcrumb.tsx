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

            <ol className="flex items-center space-x-1.5 md:space-x-3">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center">
                            {/* Item */}
                            <div
                                className={`flex items-center rounded-md px-2 py-1 transition-all duration-200 select-none ${isLast
                                    ? "text-slate-800 font-semibold bg-slate-100/50 cursor-default"
                                    : "hover:text-blue-600 hover:bg-blue-50/50 cursor-pointer"
                                    } ${(!isLast && !item.onClick) ? "cursor-default" : ""}`}
                                onClick={!isLast ? item.onClick : undefined}
                                aria-current={isLast ? "page" : undefined}
                            >
                                {item.icon && (
                                    <span className={`flex items-center justify-center mr-1.5 ${isLast ? "text-slate-700" : "text-slate-400"}`}>
                                        {React.cloneElement(item.icon as React.ReactElement, { size: 15, 'aria-hidden': 'true' })}
                                    </span>
                                )}
                                <span>{item.label}</span>
                            </div>

                            {/* Separator */}
                            {!isLast && (
                                <MdChevronRight className="flex-shrink-0 mx-0.5 md:mx-1 text-slate-300" size={18} aria-hidden="true" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
