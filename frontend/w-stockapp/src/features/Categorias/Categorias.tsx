import React, { useState, useEffect } from 'react';
import Breadcrumb from "../../components/Breadcrumb";
import MainLayout from "../../components/Layouts/MainLayout";
import { CategoriasGlobales } from './components/CategoriasGlobales';
import { AsignacionCategorias } from './components/AsignacionCategorias';

const Categorias: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [empresaId, setEmpresaId] = useState<number>(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }

    const eMenuConfig = localStorage.getItem('empresa');
    if (eMenuConfig) {
      try {
        const eParsed = JSON.parse(eMenuConfig);
        if (Array.isArray(eParsed) && eParsed.length > 0) {
          setEmpresaId(eParsed[0].idEmpresa || 0);
        } else if (eParsed && eParsed.idEmpresa) {
          setEmpresaId(eParsed.idEmpresa);
        }
      } catch (err) {
        console.error("Error parseando empresa", err);
      }
    }
  }, []);

  if (!userData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  const isSistemas = userData.cuenta === 'sistemas';

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Breadcrumb
          items={[
            { label: "Proyectos", onClick: () => { } },
            { label: "Catálogo", onClick: () => { } },
            { label: isSistemas ? "Gestión Global de Categorías" : "Mis Categorías" }
          ]}
          onBack={() => { }}
        />

        {isSistemas ? (
          <CategoriasGlobales />
        ) : (
          <div className="mt-4 flex-1">
            <AsignacionCategorias idEmpresa={empresaId} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Categorias;
