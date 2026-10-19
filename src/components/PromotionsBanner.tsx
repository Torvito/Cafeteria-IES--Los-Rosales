import React, { useState } from 'react';
import { Tag, Sparkles, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromotionsBanner: React.FC = () => {
  const { settings, setActiveView } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.bannerActive || dismissed) return null;

  return (
    <div className="bg-[#B88B4A] text-stone-950 px-4 py-2 text-xs sm:text-sm font-medium border-b border-[#a67a3a] shadow-inner transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <span className="bg-[#0F3D2E] text-[#F8F1E3] text-[11px] font-bold px-2 py-0.5 rounded tracking-wide shrink-0">
            {settings.bannerTitle || 'OFERTA'}
          </span>
          <span className="truncate text-stone-900 font-semibold">
            {settings.bannerText}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveView('combos')}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold underline hover:text-[#0F3D2E] transition-colors cursor-pointer"
          >
            <span>Ver combos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Cerrar aviso"
            className="p-1 text-stone-800 hover:text-stone-950 rounded hover:bg-black/10 transition-colors cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
