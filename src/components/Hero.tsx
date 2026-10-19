import React from 'react';
import { Coffee, UtensilsCrossed, Clock, MapPin, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategory, settings } = useApp();

  return (
    <section className="relative overflow-hidden bg-[#0F3D2E] text-white">
      {/* Background Graphic Scrim & Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cafeteria_counter_1792450954239.jpg"
          alt="Mostrador cálido de la Cafetería IES Los Rosales"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D2E]/95 via-[#0F3D2E]/85 to-[#0F3D2E]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0F3D2E]/40 to-[#0F3D2E]/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Institute badge & secondary slogan */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F8F1E3]/15 backdrop-blur-sm border border-[#B88B4A]/40 mb-6 text-xs font-semibold text-[#F8F1E3]">
            <span className="w-2 h-2 rounded-full bg-[#B88B4A]" />
            <span>Cafetería oficial de {settings.instituteName}</span>
            <span aria-hidden="true" className="opacity-60">·</span>
            <span className="text-[#DFBF75] italic">“Un buen café, mejores momentos”</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-4 text-balance">
            Tu pausa. Tu café.{' '}
            <span className="text-[#DFBF75] underline decoration-[#B88B4A]/50 decoration-wavy underline-offset-8">
              Tu espacio.
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-base sm:text-lg text-[#F8F1E3]/90 leading-relaxed mb-8 max-w-2xl font-normal">
            Desayunos recién tostados, bocadillos en pan crujiente, empanadas caseras y menús completos pensados para estudiantes, docentes y personal del centro.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveView('menu');
              }}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#B88B4A] hover:bg-[#a67a3a] text-stone-950 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <UtensilsCrossed className="w-5 h-5 text-stone-950" />
              <span>Ver Menú Digital</span>
            </button>

            <button
              onClick={() => setActiveView('combos')}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Coffee className="w-5 h-5 text-[#DFBF75]" />
              <span>Ver Menús Combo</span>
            </button>
          </div>

          {/* Quick Informational Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/15 text-xs text-[#F8F1E3]/80">
            <div className="flex items-start gap-2.5 bg-black/20 p-3 rounded-lg backdrop-blur-xs">
              <Clock className="w-4 h-4 text-[#DFBF75] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Horario de Recreos</p>
                <p className="text-[11px] text-[#F8F1E3]/70">{settings.recessMorning} y {settings.recessMidday}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-black/20 p-3 rounded-lg backdrop-blur-xs">
              <MapPin className="w-4 h-4 text-[#DFBF75] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Ubicación</p>
                <p className="text-[11px] text-[#F8F1E3]/70 truncate">{settings.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-black/20 p-3 rounded-lg backdrop-blur-xs">
              {settings.allowPreorders ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-white">Pedidos Anticipados</p>
                <p className="text-[11px] text-[#F8F1E3]/70">
                  {settings.allowPreorders ? 'Activo para recogida sin colas' : 'Solo en mostrador'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
