import React, { useState } from 'react';
import { Plus, Check, Sparkles, Utensils, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ComboModalProps {
  comboType: 'combo-1' | 'combo-2';
  onClose: () => void;
}

export const ComboModal: React.FC<ComboModalProps> = ({ comboType, onClose }) => {
  const { addToCart } = useApp();

  const isCombo1 = comboType === 'combo-1';
  const comboPrice = isCombo1 ? 3.50 : 4.50;
  const comboTitle = isCombo1
    ? 'Combo 1: Sándwich + Bebida + Patatas'
    : 'Combo 2: Bocadillo + Bebida + Patatas';

  const mainOptions = isCombo1
    ? ['Sándwich mixto', 'Sándwich de pollo al curry', 'Sándwich de jamón y queso']
    : ['Bocadillo de lomo y queso', 'Bocadillo de tortilla de patata', 'Bocadillo de jamón y queso'];

  const drinkOptions = [
    'Coca-Cola (330ml)',
    'Fanta naranja (330ml)',
    'Fanta limón (330ml)',
    'Aquarius (330ml)',
    'Nestea (330ml)',
    'Refresco natural de remolacha y limón',
    'Refresco natural de chía y jengibre',
    'Agua mineral (500ml)',
  ];

  const sideOptions = ['Bolsa de patatas fritas artesanas'];

  const [selectedMain, setSelectedMain] = useState(mainOptions[0]);
  const [selectedDrink, setSelectedDrink] = useState(drinkOptions[0]);
  const [selectedSide, setSelectedSide] = useState(sideOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    addToCart({
      productId: comboType,
      name: comboTitle,
      price: comboPrice,
      quantity,
      categoryId: 'combos',
      isCombo: true,
      comboSelections: {
        mainChoice: selectedMain,
        drinkChoice: selectedDrink,
        sideChoice: selectedSide,
      },
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-[#FDFBF7] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">
              {isCombo1 ? 'Combo Recreo Sándwich' : 'Combo Recreo Bocadillo'}
            </span>
            <span className="text-xl font-extrabold text-[#0F3D2E] tabular-nums">
              {comboPrice.toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-stone-900">
            {comboTitle}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Precio cerrado con plato principal, bebida fría y patatas fritas. Sin cargos adicionales.
          </p>
        </div>

        {/* Step 1: Main */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            1. Elige tu {isCombo1 ? 'Sándwich' : 'Bocadillo'}:
          </label>
          <div className="space-y-2">
            {mainOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedMain(opt)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                  selectedMain === opt
                    ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 text-[#0F3D2E] ring-1 ring-[#0F3D2E]'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <span>{opt}</span>
                {selectedMain === opt && <Check className="w-4 h-4 text-[#0F3D2E]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Drink */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            2. Elige tu Bebida:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {drinkOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedDrink(opt)}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                  selectedDrink === opt
                    ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 text-[#0F3D2E] ring-1 ring-[#0F3D2E]'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <span className="truncate">{opt}</span>
                {selectedDrink === opt && <Check className="w-3.5 h-3.5 text-[#0F3D2E] shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Side */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            3. Acompañamiento incluido:
          </label>
          <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-medium text-stone-800">
            <span>Bolsa de patatas fritas artesanas (incluida)</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">
            Indicaciones para cocina (opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Calentar sándwich, sin hielo en la bebida..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
          />
        </div>

        {/* Quantity and Actions */}
        <div className="border-t border-stone-200 pt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Unidades:</span>
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2.5 py-1 text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Añadir Combo</span>
              <span className="tabular-nums">({(comboPrice * quantity).toFixed(2).replace('.', ',')} €)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedCombos: React.FC = () => {
  const [activeModalCombo, setActiveModalCombo] = useState<'combo-1' | 'combo-2' | null>(null);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B88B4A] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Los Favoritos del Recreo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight">
            Menús Combo Especiales
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Ahorra en tu descanso diario con nuestros menús cerrados: comida principal, refresco y patatas por un precio único.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Combo 1 Card */}
        <div className="bg-[#FAF7F0] rounded-2xl border border-[#DFBF75]/50 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-[#0F3D2E] text-[#F8F1E3] font-bold text-xs px-3.5 py-1.5 rounded-bl-xl tracking-wide">
            COMBO SÁNDWICH
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3D2E] tabular-nums font-display">
                3,50 €
              </span>
              <span className="text-xs text-stone-500 font-medium">precio final cerrado</span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Combo 1: Sándwich + Bebida + Patatas
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Sándwich a elegir (mixto, de pollo al curry o de jamón y queso) con bebida fría y patatas fritas crujientes.
            </p>

            <div className="space-y-2 text-xs text-stone-700 mb-6 bg-white/70 p-3.5 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E]" />
                <span><strong>Sándwich:</strong> Mixto, Pollo al curry o Jamón y queso</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E]" />
                <span><strong>Bebida:</strong> Coca-Cola, Fanta, Aquarius, Nestea, Agua o Refresco Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D2E]" />
                <span><strong>Acompañamiento:</strong> Bolsa de patatas fritas</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModalCombo('combo-1')}
            className="w-full py-3 px-4 rounded-xl bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Configurar y Pedir Combo 1 (3,50 €)</span>
          </button>
        </div>

        {/* Combo 2 Card */}
        <div className="bg-[#FAF7F0] rounded-2xl border border-[#DFBF75]/50 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-[#B88B4A] text-stone-950 font-bold text-xs px-3.5 py-1.5 rounded-bl-xl tracking-wide">
            COMBO BOCADILLO
          </div>

          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3D2E] tabular-nums font-display">
                4,50 €
              </span>
              <span className="text-xs text-stone-500 font-medium">precio final cerrado</span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Combo 2: Bocadillo + Bebida + Patatas
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Bocadillo a elegir (lomo y queso, tortilla de patata o jamón y queso) con bebida fría y patatas fritas crujientes.
            </p>

            <div className="space-y-2 text-xs text-stone-700 mb-6 bg-white/70 p-3.5 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B88B4A]" />
                <span><strong>Bocadillo:</strong> Lomo y queso, Tortilla o Jamón y queso</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B88B4A]" />
                <span><strong>Bebida:</strong> Coca-Cola, Fanta, Aquarius, Nestea, Agua o Refresco Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B88B4A]" />
                <span><strong>Acompañamiento:</strong> Bolsa de patatas fritas</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModalCombo('combo-2')}
            className="w-full py-3 px-4 rounded-xl bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Configurar y Pedir Combo 2 (4,50 €)</span>
          </button>
        </div>
      </div>

      {activeModalCombo && (
        <ComboModal
          comboType={activeModalCombo}
          onClose={() => setActiveModalCombo(null)}
        />
      )}
    </section>
  );
};
