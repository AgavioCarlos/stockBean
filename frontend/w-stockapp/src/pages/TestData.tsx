import { useEffect, useState } from 'react';
import { StockTable, Column } from '../components/DataTable';
import { consultarEmpresaUsuario } from '../services/EmpresaUsuario';
import { EmpresaUsuario } from '../interfaces/empresaUsuario.interface';

// 1. Definimos el tipo de dato (esto vendría de tu DB)
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

function TestData() {
  // 2. Datos (pueden venir de un fetch)

  const [empresaUsuarios, setEmpresaUsuarios] = useState<EmpresaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    consultarEmpresaUsuario()
      .then((data: EmpresaUsuario[]) => {
        setEmpresaUsuarios(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar empresas usuarios:", error);
        setLoading(false);
      });
  }, []);
  // const productos: Producto[] = [
  //   { id: 1, nombre: 'Laptop Pro', categoria: 'Electrónica', precio: 1200, stock: 5 },
  //   { id: 2, nombre: 'Silla Gamer', categoria: 'Muebles', precio: 250, stock: 15 },
  //   { id: 3, nombre: 'Teclado Mecánico', categoria: 'Electrónica', precio: 80, stock: 0 },
  // ];

  // 3. Configuración de columnas
  const columnas: Column<EmpresaUsuario>[] = [
    { key: 'idEmpresaUsuario', label: 'ID' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'activo', label: 'Activo' },
    { key: 'fechaAlta', label: 'Fecha Alta' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <StockTable data={empresaUsuarios} columns={columnas} />
    </div>
  );
};

export default TestData;