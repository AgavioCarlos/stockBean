import React, { useState, useMemo } from 'react';

// Interfaz para definir cada columna
export interface Column<T> {
  key: keyof T;        // La propiedad del objeto (ej. 'nombre')
  label: string;       // El título que verá el usuario
  render?: (value: any, item: T) => React.ReactNode; // Para celdas personalizadas
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
}

export const StockTable = <T extends Record<string, any>>({ data, columns }: Props<T>) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Lógica de filtrado dinámico
  const processedData = useMemo(() => {
    return data.filter((row) => {
      // 1. Buscador global: revisa todos los campos de la fila
      const matchesGlobal = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(globalSearch.toLowerCase())
      );

      // 2. Filtros por columna: revisa coincidencias específicas
      const matchesColumns = Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(value.toLowerCase());
      });

      return matchesGlobal && matchesColumns;
    });
  }, [data, globalSearch, columnFilters]);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
      {/* Barra de búsqueda superior */}
      <input
        type="text"
        placeholder="🔍 Buscar en toda la tabla..."
        onChange={(e) => setGlobalSearch(e.target.value)}
        style={{ marginBottom: '16px', padding: '8px', width: '300px', display: 'block' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ padding: '12px', textAlign: 'left' }}>
                <div>{col.label}</div>
                {/* Input de filtro por columna */}
                <input
                  type="text"
                  placeholder={`Filtrar...`}
                  onChange={(e) => setColumnFilters({ ...columnFilters, [col.key]: e.target.value })}
                  style={{ width: '90%', fontSize: '12px', marginTop: '5px' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              {columns.map((col) => (
                <td key={String(col.key)} style={{ padding: '12px' }}>
                  {/* Si hay un render personalizado lo usa, si no, imprime el valor */}
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};