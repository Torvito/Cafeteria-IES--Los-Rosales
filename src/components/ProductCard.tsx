import React, { useState } from 'react';
import { Plus, Check, AlertTriangle, Coffee, Info } from 'lucide-react';
import { ALLERGENS } from '../data/initialData';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onOpenComboModal?: (comboId: 'combo-1' | 'combo-2') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenComboModal }) => {
  const { addToCart } = useApp();
  const [selectedOption, setSelectedOption] = useState<string>(
    product.options?.[0]?.choices?.[0] || ''
  );
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);

  const isCombo = product.categoryId === 'combos';

  const handleAdd = () => {
    if (!product.isAvailable) return;

    if (isCombo && onOpenComboModal) {
      onOpenComboModal(product.id as 'combo-1' | 'combo-2');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      categoryId: product.categoryId,
      customOptions: product.options && selectedOption ? { [product.options[0].name]: selectedOption } : undefined,
    });
  };

  const productAllergens = ALLERGENS.filter((a) => product.allergens.includes(a.id));

  return (
    <>
      <div
        className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group ${
          product.isAvailable
            ? 'border-stone-200/80 hover:border-[#B88B4A]/60 hover:shadow-md'
            : 'border-stone-200 opacity-60 bg-stone-50'
        }`}
      >
        {/* Visual Slot */}
        <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                product.isAvailable ? 'group-hover:scale-105' : 'grayscale'
              }`}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F3D2E]/5 to-[#B88B4A]/10 text-[#0F3D2E]/60 p-4 text-center">
              <Coffee className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-medium text-stone-500 line-clamp-1">{product.name}</span>
            </div>
          )}

          {/* Out of Stock Ribbon */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow">
                Agotado por hoy
              </span>
            </div>
          )}

          {/* Category Tag (clean text, no pill spam) */}
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/90 text-stone-700 shadow-xs backdrop-blur-xs">
              {product.categoryId === 'cafes' && 'Cafetería'}
              {product.categoryId === 'desayunos' && 'Desayuno'}
              {product.categoryId === 'pulgas' && 'Pulga'}
              {product.categoryId === 'combos' && 'Menú Combo'}
              {product.categoryId === 'bocadillos' && 'Bocadillo'}
              {product.categoryId === 'sandwiches' && 'Sándwich'}
              {product.categoryId === 'empanadas' && 'Empanada'}
              {product.categoryId === 'bebidas' && 'Bebida'}
              {product.categoryId === 'refrescos' && 'Refresco Natural'}
              {product.categoryId === 'menu-dia' && 'Menú del Día'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title & Price Header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-display font-bold text-base text-stone-900 leading-snug">
                {product.name}
              </h3>
              <span className="text-base font-extrabold text-[#0F3D2E] tabular-nums whitespace-nowrap">
                {product.price.toFixed(2).replace('.', ',')} €
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>

            {/* Customizable options (e.g. Milk type for coffees) */}
            {product.options && product.options.length > 0 && product.isAvailable && (
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {product.options[0].name}:
                </label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
                >
                  {product.options[0].choices.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            {/* Allergens & Details Info Link */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500 mb-3">
              <div className="flex items-center gap-1 truncate">
                {productAllergens.length > 0 ? (
                  <span className="truncate">
                    Alérgenos: {productAllergens.map((a) => a.name).join(', ')}
                  </span>
                ) : (
                  <span className="text-stone-400">Sin alérgenos declarados</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowIngredientsModal(true)}
                title="Ver ingredientes y alérgenos verificados"
                className="text-[#B88B4A] hover:text-[#956d33] font-medium shrink-0 ml-1 cursor-pointer"
              >
                Detalles
              </button>
            </div>

            {/* Action Button */}
            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAdd}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                product.isAvailable
                  ? 'bg-[#0F3D2E] hover:bg-[#16503c] text-white active:scale-98 shadow-xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isCombo ? 'Configurar Menú Combo' : 'Añadir a mi pedido'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients & Allergens Modal */}
      {showIngredientsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h4 className="text-lg font-display font-bold text-stone-900 mb-2">
              {product.name}
            </h4>
            <p className="text-xs text-stone-600 mb-4">{product.description}</p>

            <div className="space-y-3 text-xs mb-6">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="font-bold text-stone-800 block mb-1">Ingredientes:</span>
                <p className="text-stone-600 leading-relaxed">
                  {product.ingredients || 'Consultar en cafetería.'}
                </p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-900 block mb-1">Alérgenos presentes:</span>
                {productAllergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {productAllergens.map((a) => (
                      <span
                        key={a.id}
                        className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-semibold"
                      >
                        <span>{a.icon}</span>
                        <span>{a.name}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-800">
                    No contiene los 14 alérgenos de declaración obligatoria según receta estándar.
                  </p>
                )}
                <p className="text-[10px] text-amber-800/80 mt-2 italic leading-tight">
                  Aviso: solicita al personal la información específica antes de realizar tu pedido.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIngredientsModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
