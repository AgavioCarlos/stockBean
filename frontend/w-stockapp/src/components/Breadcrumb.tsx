import React from "react";
import { MdChevronRight } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

export interface BreadcrumbItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    onBack?: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onBack }) => {
    return (
        <div className="flex items-center text-sm mb-2 text-gray-500">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    title="Volver"
                >
                    <IoArrowBack size={18} />
                </button>
            )}

            {/* Separator after back button if it exists */}
            {onBack && <div className="h-4 w-[1px] bg-gray-300 mr-3"></div>}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {/* Item */}
                        <div
                            className={`flex items-center gap-2 ${isLast
                                ? "font-semibold text-gray-800"
                                : "hover:text-gray-700 cursor-pointer transition-colors"
                                }`}
                            onClick={!isLast ? item.onClick : undefined}
                        >
                            {item.icon ? item.icon : <FaFolder className={isLast ? "text-gray-800" : "text-gray-400"} />}
                            <span>{item.label}</span>
                        </div>

                        {/* Separator */}
                        {!isLast && (
                            <MdChevronRight className="mx-2 text-gray-400" size={20} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Breadcrumb;
