import React from 'react';
import { ShoppingBag, QrCode, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    cartTotal,
    setIsCartOpen,
    isAdmin,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#0F3D2E] text-[#F8F1E3] border-b border-[#B88B4A]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-18">
          {/* Zone 1: Brand wordmark & Logo */}
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <Logo size="md" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl text-white tracking-tight group-hover:text-[#F8F1E3] transition-colors whitespace-nowrap">
                Cafetería IES Los Rosales
              </span>
              <span className="text-[11px] font-medium text-[#B88B4A] tracking-wider uppercase hidden sm:inline whitespace-nowrap">
                Tu pausa · Tu café · Tu espacio
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, concise) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveView('home')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeView === 'home'
                  ? 'text-white border-[#B88B4A]'
                  : 'text-[#F8F1E3]/80 border-transparent hover:text-white'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveView('menu')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeView === 'menu'
                  ? 'text-white border-[#B88B4A]'
                  : 'text-[#F8F1E3]/80 border-transparent hover:text-white'
              }`}
            >
              Menú Digital
            </button>
            <button
              onClick={() => setActiveView('combos')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeView === 'combos'
                  ? 'text-white border-[#B88B4A]'
                  : 'text-[#F8F1E3]/80 border-transparent hover:text-white'
              }`}
            >
              Combos Recreo
            </button>
            <button
              onClick={() => setActiveView('order-status')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeView === 'order-status'
                  ? 'text-white border-[#B88B4A]'
                  : 'text-[#F8F1E3]/80 border-transparent hover:text-white'
              }`}
            >
              Consultar Pedido
            </button>
            <button
              onClick={() => setActiveView('allergens')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 border-b-2 ${
                activeView === 'allergens'
                  ? 'text-white border-[#B88B4A]'
                  : 'text-[#F8F1E3]/80 border-transparent hover:text-white'
              }`}
            >
              Alérgenos &amp; Info
            </button>
          </nav>

          {/* Zone 3: Primary Action (Cart Drawer & Secondary Admin / QR Quick Access) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* QR Poster shortcut */}
            <button
              onClick={() => setActiveView('qr')}
              title="Código QR para mesas y cartelería"
              aria-label="Código QR"
              className="p-2 rounded-lg text-[#F8F1E3]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {/* Admin shortcut */}
            <button
              onClick={() => setActiveView('admin')}
              title="Panel Administrativo de Cafetería"
              aria-label="Panel Administrativo"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-[#B88B4A] text-stone-900 shadow'
                  : 'text-[#F8F1E3]/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Activo' : 'Gestión'}</span>
            </button>

            {/* Primary Action Button: Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Ver cesta de compra con ${cartCount} productos`}
              className="relative flex items-center gap-2 bg-[#B88B4A] hover:bg-[#a67a3a] text-stone-950 px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">Mi Pedido</span>
              {cartCount > 0 && (
                <span className="bg-[#C93F3F] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
              {cartCount > 0 && (
                <span className="hidden sm:inline border-l border-stone-900/20 pl-2 tabular-nums font-bold">
                  {cartTotal.toFixed(2).replace('.', ',')} €
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-white/10 py-2.5 overflow-x-auto gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveView('home')}
            className={`whitespace-nowrap px-1 py-0.5 cursor-pointer ${
              activeView === 'home' ? 'text-white font-bold border-b border-[#B88B4A]' : 'text-[#F8F1E3]/70'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setActiveView('menu')}
            className={`whitespace-nowrap px-1 py-0.5 cursor-pointer ${
              activeView === 'menu' ? 'text-white font-bold border-b border-[#B88B4A]' : 'text-[#F8F1E3]/70'
            }`}
          >
            Menú Digital
          </button>
          <button
            onClick={() => setActiveView('combos')}
            className={`whitespace-nowrap px-1 py-0.5 cursor-pointer ${
              activeView === 'combos' ? 'text-white font-bold border-b border-[#B88B4A]' : 'text-[#F8F1E3]/70'
            }`}
          >
            Combos (3,50€ / 4,50€)
          </button>
          <button
            onClick={() => setActiveView('order-status')}
            className={`whitespace-nowrap px-1 py-0.5 cursor-pointer ${
              activeView === 'order-status' ? 'text-white font-bold border-b border-[#B88B4A]' : 'text-[#F8F1E3]/70'
            }`}
          >
            Consultar Pedido
          </button>
          <button
            onClick={() => setActiveView('allergens')}
            className={`whitespace-nowrap px-1 py-0.5 cursor-pointer ${
              activeView === 'allergens' ? 'text-white font-bold border-b border-[#B88B4A]' : 'text-[#F8F1E3]/70'
            }`}
          >
            Alérgenos
          </button>
        </div>
      </div>
    </header>
  );
};
