import { useState, useEffect } from 'react';
import MainLayout from "../components/Layouts/MainLayout";
import Footer from "../components/Layouts/Footer";
import ConfiguracionEmpresa from '../components/ConfiguracionEmpresa';
import { FiTrendingUp, FiBox, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';

function Home() {
  const [showConfiguracionEmpresa, setShowConfiguracionEmpresa] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Verificar si el usuario necesita configurar empresa
    const requiresConfig = localStorage.getItem('requiresEmpresaConfig');
    if (requiresConfig === 'true') {
      setShowConfiguracionEmpresa(true);
    }

    // Cargar datos del usuario
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  const stats = [
    { label: 'Ventas Hoy', value: '$12,450', icon: <FiDollarSign />, color: 'bg-green-500', trend: '+12.5%' },
    { label: 'Productos', value: '1,240', icon: <FiBox />, color: 'bg-indigo-500', trend: '+3.2%' },
    { label: 'Clientes', value: '458', icon: <FiUsers />, color: 'bg-blue-500', trend: '+5.4%' },
    { label: 'Rendimiento', value: '94.2%', icon: <FiTrendingUp />, color: 'bg-purple-500', trend: '+0.8%' },
  ];

  return (
    <>
      {showConfiguracionEmpresa ? (
        <ConfiguracionEmpresa />
      ) : (
        <MainLayout>
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Welcome Hero Card */}
            <div className="relative overflow-hidden bg-[#0F172A] rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl shadow-gray-200">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
                  Panel de Control v2.4
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                  ¡Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">{userData?.nombre || 'Usuario'}</span>!
                </h1>
                <p className="text-lg text-gray-400 font-medium mb-10 leading-relaxed">
                  Tu ecosistema de gestión está listo. Hemos procesado <span className="text-white font-bold">24 nuevas alertas</span> de inventario para tu revisión hoy. Optimiza tus operaciones con inteligencia artificial.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group active:scale-95">
                    Ver Inventario <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all active:scale-95">
                    Configuración Rápida
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-gray-100 group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-${stat.color.split('-')[1]}-200 group-hover:scale-110 transition-transform duration-500`}>
                      {stat.icon}
                    </div>
                    <span className="text-green-500 text-xs font-black bg-green-50 rounded-full px-2 py-1">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Placeholder for more content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100 border border-gray-50 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-inner">
                    <FiTrendingUp className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm tracking-wide">Actividad Reciente y Gráficos aparecerán aquí</p>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100 border border-gray-50 h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-inner">
                    <FiUsers className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm tracking-wide">Usuarios en línea</p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </MainLayout>
      )}
    </>
  );
}

export default Home;