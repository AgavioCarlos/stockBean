import React from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

interface ExportButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

export const PdfButton: React.FC<ExportButtonProps> = ({ onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-red-600 bg-white border border-red-200 rounded-lg transition-colors shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'}`}
        title="Exportar a PDF"
    >
        <FaFilePdf size={20} />
    </button>
);

export const ExcelButton: React.FC<ExportButtonProps> = ({ onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-green-600 bg-white border border-green-200 rounded-lg transition-colors shadow-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'}`}
        title="Exportar a Excel"
    >
        <FaFileExcel size={20} />
    </button>
);
