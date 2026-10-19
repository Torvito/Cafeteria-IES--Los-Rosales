import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, settings } = useApp();

  return (
    <footer className="bg-[#0F3D2E] text-[#F8F1E3] border-t border-[#B88B4A]/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Slogans */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  Cafetería IES Los Rosales
                </h3>
                <p className="text-xs text-[#B88B4A] font-semibold tracking-wide uppercase">
                  “Tu pausa. Tu café. Tu espacio.”
                </p>
              </div>
            </div>
            <p className="text-xs text-[#F8F1E3]/80 leading-relaxed max-w-sm">
              Servicio de cafetería y cantina escolar. Desayunos recién hechos, menús combo para el recreo y comida equilibrada diaria para estudiantes, profesores y personal.
            </p>
            <p className="text-xs text-[#DFBF75] italic">
              “Un buen café, mejores momentos.”
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B88B4A]">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs text-[#F8F1E3]/80">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Menú Digital y Precios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('combos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Menús Combo (3,50 € / 4,50 €)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('order-status')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Consultar Estado de Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('allergens')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Guía de Alérgenos &amp; Horarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('qr')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Generador de Código QR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Center & Legal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B88B4A]">
              Atención y Centro
            </h4>
            <div className="space-y-2 text-xs text-[#F8F1E3]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#DFBF75] shrink-0 mt-0.5" />
                <span>{settings.instituteName} · {settings.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DFBF75] shrink-0" />
                <span>{settings.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DFBF75] shrink-0" />
                <span>{settings.contactEmail}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('admin')}
                className="text-[11px] font-semibold text-[#DFBF75] hover:underline cursor-pointer"
              >
                Acceso a Gestión y Mostrador
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F8F1E3]/60">
          <p>© {new Date().getFullYear()} Cafetería IES Los Rosales. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Reglamento UE 1169/2011 sobre Alérgenos</span>
            <span aria-hidden="true">·</span>
            <span>Cumplimiento RGPD LOPDGDD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
