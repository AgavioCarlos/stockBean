import { useEffect, useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { consultarEmpresaUsuario } from '../services/EmpresaUsuario';
import { EmpresaUsuario } from '../interfaces/empresaUsuario.interface';
import MainLayout from '../components/Layouts/MainLayout';

function TestData() {
  // 2. Datos (pueden venir de un fetch)

  const [empresaUsuarios, setEmpresaUsuarios] = useState<EmpresaUsuario[]>([]);
  const [loading, setLoading] = useState(true);

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
    {
      key: 'idEmpresaUsuario',
      label: 'ID'
    },
    {
      key: 'usuario',
      label: 'Usuario',
      render: (u) => u?.cuenta || 'N/A'
    },
    {
      key: 'empresa',
      label: 'Empresa',
      render: (e) => e?.nombreComercial || e?.razonSocial || 'N/A'
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (activo) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'fechaAlta',
      label: 'Fecha Alta',
      render: (fecha) => fecha ? new Date(fecha).toLocaleDateString() : 'N/A'
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Asignación de Empresas a Usuarios</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DataTable data={empresaUsuarios} columns={columnas} />
        )}
      </div>
    </MainLayout>
  );
};

export default TestData;