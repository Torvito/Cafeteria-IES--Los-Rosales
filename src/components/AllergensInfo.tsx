import React from 'react';
import { AlertTriangle, Clock, MapPin, Mail, Phone, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import { ALLERGENS } from '../data/initialData';
import { useApp } from '../context/AppContext';

export const AllergensInfo: React.FC = () => {
  const { settings } = useApp();

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider">
          Información y Normativa Sanitaria
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight mt-1">
          Alérgenos, Horarios y Contacto
        </h2>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          En la Cafetería IES Los Rosales nos comprometemos con la seguridad alimentaria de todo el alumnado, profesorado y personal. Consulta aquí la guía oficial de alérgenos y los canales de atención directa.
        </p>
      </div>

      {/* Mandatory Official Allergen Notice Callout */}
      <div className="bg-[#FAF7F0] border-2 border-[#B88B4A] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#B88B4A] text-stone-950 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0F3D2E]">
              Aviso Obligatorio sobre Información de Alérgenos (Reglamento UE 1169/2011)
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              “Información sobre alérgenos: solicita al personal la información específica de ingredientes y alérgenos antes de realizar tu pedido. La presencia de alérgenos puede variar según las marcas, recetas y elaboración.”
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              En caso de celiaquía severa o alergias cruzadas múltiples, por favor comunícaselo verbalmente al responsable de cocina antes de solicitar tu comanda en barra.
            </p>
          </div>
        </div>
      </div>

      {/* 14 Official EU Allergens Grid */}
      <div>
        <h3 className="text-lg font-display font-bold text-stone-900 mb-4">
          Los 14 Alérgenos de Declaración Obligatoria
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALLERGENS.map((allergen) => (
            <div
              key={allergen.id}
              className="bg-white p-3.5 rounded-xl border border-stone-200 text-center flex flex-col items-center justify-center hover:border-[#B88B4A]/50 transition-colors shadow-2xs"
            >
              <span className="text-2xl mb-1 select-none">{allergen.icon}</span>
              <span className="text-xs font-bold text-stone-800 leading-tight">
                {allergen.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Institute Info & Hours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Hours Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0F3D2E]">
            <Clock className="w-5 h-5 text-[#B88B4A]" />
            <h4 className="font-display font-bold text-lg text-stone-900">
              Horario de Atención del Centro
            </h4>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="font-medium text-stone-800">Jornada General:</span>
              <span className="font-bold text-stone-900">{settings.openingHours}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="font-medium text-stone-800">Recreo de Mañana:</span>
              <span className="font-bold text-[#0F3D2E] bg-emerald-50 px-2 py-0.5 rounded">
                {settings.recessMorning}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="font-medium text-stone-800">Recreo de Mediodía:</span>
              <span className="font-bold text-[#0F3D2E] bg-emerald-50 px-2 py-0.5 rounded">
                {settings.recessMidday}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-stone-800">Servicio de Comida:</span>
              <span className="font-semibold text-stone-700">14:00 a 15:30</span>
            </div>
          </div>
        </div>

        {/* Contact & Location Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-[#0F3D2E]">
            <MapPin className="w-5 h-5 text-[#B88B4A]" />
            <h4 className="font-display font-bold text-lg text-stone-900">
              Ubicación y Contacto
            </h4>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-stone-600">
            <div className="flex items-start gap-3 py-2 border-b border-stone-100">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium text-stone-800">Instituto &amp; Ubicación</span>
                <span className="text-stone-600 text-xs">{settings.instituteName} · {settings.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2 border-b border-stone-100">
              <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium text-stone-800">Teléfono Cafetería</span>
                <span className="text-stone-600 text-xs">{settings.contactPhone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <Mail className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-medium text-stone-800">Correo Electrónico</span>
                <span className="text-stone-600 text-xs">{settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RGPD & Educational Data Protection Box */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cumplimiento RGPD y Protección de Menores en Entornos Educativos</span>
        </div>
        <p className="leading-relaxed">
          Esta aplicación respeta escrupulosamente la Ley Orgánica 3/2018 (LOPDGDD) y el RGPD europeo. Para consultar el menú, cartas de precios y alérgenos no se requiere registro ni cesión de datos personales. En caso de pedidos anticipados, únicamente se solicita un nombre o alias de recogida y no se registran perfiles comerciales ni historiales de menores.
        </p>
      </div>
    </section>
  );
};
