import React from 'react';

interface StatusFilterProps {
    status: boolean;
    onChange: (status: boolean) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ status, onChange }) => {
    return (
        <button
            type="button"
            onClick={() => onChange(!status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 shadow-sm border ${status
                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                }`}
        >
            {status ? 'Activos' : 'Inactivos'}
        </button>
    );
};

export default StatusFilter;
