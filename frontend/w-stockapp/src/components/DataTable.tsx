import React, { useState, useMemo } from 'react';
import { HiOutlineSearch, HiChevronUp, HiChevronDown, HiOutlineFilter } from 'react-icons/hi';

// Helper para extraer todo el texto de un objeto recursivamente para búsquedas (con protección contra ciclos)
const getSearchableString = (obj: any, visited = new Set(), depth = 0): string => {
  if (obj === null || obj === undefined || depth > 5) return '';
  if (typeof obj === 'object') {
    if (visited.has(obj)) return '';
    visited.add(obj);
    try {
      return Object.values(obj)
        .map(v => getSearchableString(v, visited, depth + 1))
        .join(' ')
        .toLowerCase();
    } catch (e) {
      return '';
    }
  }
  return String(obj).toLowerCase();
};

// Interfaz para definir cada columna
export interface Column<T> {
  key: keyof T;        // La propiedad del objeto (ej. 'nombre')
  label: string;       // El título que verá el usuario
  render?: (value: any, item: T) => React.ReactNode; // Para celdas personalizadas
  valueGetter?: (item: T) => any; // Para extraer valor manual en búsquedas/orden
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  onRowClick?: (item: T) => void;
}

export const DataTable = <T extends Record<string, any>>({ data, columns, title, onRowClick }: Props<T>) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  // Lógica de ordenamiento
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Lógica de filtrado y ordenamiento dinámico
  const processedData = useMemo(() => {
    let filtered = data.filter((row) => {
      const gTerm = globalSearch.toLowerCase();

      // 1. Buscador global (Recursivo)
      const matchesGlobal = !gTerm || getSearchableString(row).includes(gTerm);

      // 2. Filtros por columna (usando índice para evitar colisiones de keys duplicadas)
      const matchesColumns = columns.every((col, idx) => {
        const filterVal = columnFilters[idx];
        if (!filterVal) return true;
        const cellValue = col?.valueGetter ? col.valueGetter(row) : row[col.key];
        return getSearchableString(cellValue).includes(filterVal.toLowerCase());
      });

      return matchesGlobal && matchesColumns;
    });

    // 3. Ordenamiento
    if (sortConfig) {
      filtered.sort((a, b) => {
        const col = columns.find(c => c.key === sortConfig.key);
        const aVal = col?.valueGetter ? col.valueGetter(a) : a[sortConfig.key];
        const bVal = col?.valueGetter ? col.valueGetter(b) : b[sortConfig.key];

        const aStr = getSearchableString(aVal);
        const bStr = getSearchableString(bVal);

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, globalSearch, columnFilters, sortConfig, columns]);

  return (
    <div className="flex flex-col w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header and Global Search */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <HiOutlineSearch className="h-5 w-5" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Buscar en todos los registros..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={`${String(col.key)}-${idx}`}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider group"
                >
                  <div
                    className={`flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors ${col.sortable !== false ? '' : 'pointer-events-none'}`}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable !== false && (
                      <span className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiChevronUp className={`h-2.5 w-2.5 ${sortConfig?.key === col.key && sortConfig.direction === 'asc' ? 'text-blue-600' : ''}`} />
                        <HiChevronDown className={`h-2.5 w-2.5 ${sortConfig?.key === col.key && sortConfig.direction === 'desc' ? 'text-blue-600' : ''}`} />
                      </span>
                    )}
                  </div>

                  {/* Column Specific Filter */}
                  <div className="mt-2 relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400">
                      <HiOutlineFilter className="h-3 w-3" />
                    </span>
                    <input
                      type="text"
                      className="block w-full pl-7 pr-2 py-1 border border-gray-200 rounded-md text-[10px] bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all font-normal"
                      placeholder={`Filtrar...`}
                      value={columnFilters[idx] || ''}
                      onChange={(e) => setColumnFilters({ ...columnFilters, [idx]: e.target.value })}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {processedData.length > 0 ? (
              processedData.map((row, i) => (
                <tr
                  key={row.id || row.id_inventario || i}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors duration-150 group ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50' : 'hover:bg-gray-50/50'}`}
                >
                  {columns.map((col, idx) => (
                    <td key={`${String(col.key)}-${idx}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <HiOutlineSearch size={32} />
                    </div>
                    <span>No se encontraron registros que coincidan con la búsqueda</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Mostrando {processedData.length} de {data.length} registros</span>
        {processedData.length > 0 && <span>Total de registros: {processedData.length}</span>}
      </div>
    </div>
  );
};
