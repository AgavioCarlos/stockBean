import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}>
      <div className="p-4">
        <button className="text-white text-2xl mb-6" onClick={onClose}>✖</button>
        <h2 className="text-2xl font-bold mb-6">Menú</h2>
        <ul className="space-y-4">
          <li><a href="/" className="hover:underline">Inicio</a></li>
          <li><a href="/persona" className="hover:underline">Personas</a></li>
          <li><a href="/categorias" className="hover:underline">Categorías</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;