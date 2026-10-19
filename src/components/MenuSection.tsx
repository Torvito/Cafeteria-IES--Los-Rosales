import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { ProductCategory } from '../types';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ComboModal } from './FeaturedCombos';

export const MenuSection: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [activeComboModal, setActiveComboModal] = useState<'combo-1' | 'combo-2' | null>(null);

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu-digital" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider">
            Carta Completa · Curso 2025/2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight">
            Menú Digital de la Cafetería
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Precios oficiales del centro con IVA incluido. Consulta ingredientes y alérgenos en cada ficha.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar café, tortilla, bocadillo..."
            className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] text-stone-800 shadow-xs placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Interactive Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0F3D2E] text-white shadow-sm ring-1 ring-[#0F3D2E]'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Todo el Menú ({products.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#0F3D2E] text-white shadow-sm ring-1 ring-[#0F3D2E]'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Headline Banner */}
      {selectedCategory !== 'all' && (
        <div className="bg-[#FAF7F0] border-l-4 border-[#0F3D2E] p-4 rounded-r-xl mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.description}
            </p>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-[#0F3D2E] font-semibold hover:underline cursor-pointer"
          >
            Ver todo
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenComboModal={(id) => setActiveComboModal(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800 mb-1">
            No se han encontrado productos
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            No hay ningún producto que coincida con tu búsqueda “{searchQuery}”.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-[#0F3D2E] text-white text-xs font-semibold rounded-xl hover:bg-[#16503c] cursor-pointer"
          >
            Limpiar filtros y ver menú completo
          </button>
        </div>
      )}

      {/* Active Combo Modal */}
      {activeComboModal && (
        <ComboModal
          comboType={activeComboModal}
          onClose={() => setActiveComboModal(null)}
        />
      )}
    </section>
  );
};
