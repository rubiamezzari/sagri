import React, { useState } from 'react';
import { Menu, User, Bell } from 'lucide-react';
import NavbarAdmin from './NavbarAdmin'; // Certifique-se de que o caminho está correto

// Conteúdo de exemplo para a área principal
const MainContent = () => (
  <div className="p-8">
    <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Team Members</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-8">6 people in your organization</p>
    
    <button className="bg-[#1B4D3E] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        + Add Person
    </button>
    
    <div className="mt-8 space-y-4">
      {/* Simulação dos cards de lista da imagem */}
      <Card name="Sarah Johnson" email="sarahj@example.com" title="Product Manager" initials="SJ" />
      <Card name="Michael Chen" email="m.chen@example.com" title="Software Engineer" initials="MC" />
      <Card name="Emma Williams" email="emma.w@example.com" title="UX Designer" initials="EW" />
      <Card name="James Martinez" email="jamesm@example.com" title="VP, Engineering" initials="JM" />
    </div>
  </div>
);

// Componente Card Simples
const Card = ({ name, email, title, initials }) => (
    <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{email}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{title}</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-bold">
            {initials}
        </div>
    </div>
);


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Largura da sidebar (deve corresponder ao w-64 em Sidebar.jsx)
  const SIDEBAR_WIDTH_CLASS = 'lg:ml-64';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 1. Sidebar (Fixo e Oculto no Mobile por padrão) */}
      <NavbarAdmin 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. Navbar Superior (Fixo no Topo) */}
      {/* O Navbar está sempre visível, mas os elementos responsivos são ajustados */}
      <header className={`bg-white dark:bg-gray-800 shadow sticky top-0 z-30 transition-all ${SIDEBAR_WIDTH_CLASS}`}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          
          {/* Botão Hambúrguer (Visível apenas no mobile) */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Título Principal (Opcional, mas útil no topo) */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white lg:block hidden">
            People List Website
          </h1>

          {/* Ícones de Ação/Perfil (Alinhado à direita) */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Conteúdo Principal */}
      {/* A classe lg:ml-64 empurra o conteúdo para o lado da sidebar fixa no desktop */}
      <main className={`flex-1 transition-all ${SIDEBAR_WIDTH_CLASS}`}>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <MainContent />
        </div>
      </main>
    </div>
  );
}