import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PromotionsBanner } from './components/PromotionsBanner';
import { Hero } from './components/Hero';
import { FeaturedCombos } from './components/FeaturedCombos';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderStatusTracker } from './components/OrderStatusTracker';
import { AllergensInfo } from './components/AllergensInfo';
import { QrCodeModal } from './components/QrCodeModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { Sparkles, Utensils, Clock, ChevronRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, products } = useApp();

  const featuredItems = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F1E3]/20">
      <PromotionsBanner />
      <Navbar />

      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <div>
            <Hero />
            <FeaturedCombos />

            {/* Featured Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#B88B4A] uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Selección del Día</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight">
                    Populares en Cafetería
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                    Las opciones más demandadas por alumnos y profesores para empezar la jornada.
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('menu')}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#0F3D2E] hover:text-[#B88B4A] transition-colors cursor-pointer"
                >
                  <span>Ver carta completa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <button
                  onClick={() => setActiveView('menu')}
                  className="w-full py-3 bg-[#0F3D2E] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Ver toda la carta del menú
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: FULL DIGITAL MENU */}
        {activeView === 'menu' && <MenuSection />}

        {/* VIEW 3: COMBOS */}
        {activeView === 'combos' && (
          <div className="py-4">
            <FeaturedCombos />
          </div>
        )}

        {/* VIEW 4: ORDER TRACKING */}
        {activeView === 'order-status' && <OrderStatusTracker />}

        {/* VIEW 5: ALLERGENS & INFO */}
        {activeView === 'allergens' && <AllergensInfo />}

        {/* VIEW 6: QR CODE & POSTER */}
        {activeView === 'qr' && <QrCodeModal />}

        {/* VIEW 7: ADMIN PANEL */}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
