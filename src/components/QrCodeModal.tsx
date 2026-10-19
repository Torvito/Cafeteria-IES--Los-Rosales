import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const QrCodeModal: React.FC = () => {
  const { settings } = useApp();
  const [qrUrl, setQrUrl] = useState(() => {
    return window.location.origin || 'https://cafeteria.ieslosrosales.es';
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(
      qrUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F3D2E',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err) {
          setQrDataUrl(url);
        }
      }
    );
  }, [qrUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Menu-Cafeteria-IES-Los-Rosales.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider">
          Cartelería para Mesas y Barra
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight mt-1">
          Código QR de Acceso al Menú Digital
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Genera e imprime carteles oficiales para colocar en las mesas de la cafetería, barras y tablones del instituto. Permite a los estudiantes y profesores escanear con su móvil sin necesidad de instalar apps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Printable Poster Preview (Cols 1-7) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#B88B4A]/50 shadow-xl flex flex-col items-center text-center space-y-5 print:border-none print:shadow-none print:p-0">
          <Logo size="lg" />

          <div>
            <h3 className="font-display font-extrabold text-2xl text-[#0F3D2E] tracking-tight">
              Cafetería {settings.instituteName}
            </h3>
            <p className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider mt-0.5">
              “Tu pausa. Tu café. Tu espacio.”
            </p>
          </div>

          {/* QR Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-stone-200 shadow-inner inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR del Menú"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
              />
            ) : (
              <div className="w-56 h-56 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                Generando QR...
              </div>
            )}
          </div>

          <div className="space-y-1 max-w-xs">
            <p className="text-sm font-bold text-stone-800">
              Escanea con la cámara de tu móvil
            </p>
            <p className="text-xs text-stone-500">
              Consulta precios, alérgenos y pide con antelación para el recreo sin colas.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-200 w-full flex items-center justify-between text-[11px] text-stone-400">
            <span>{settings.openingHours}</span>
            <span>Uso público sin registro</span>
          </div>
        </div>

        {/* Configuration & Actions (Cols 8-12) */}
        <div className="md:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-stone-900 text-sm">
              Configuración de Enlace
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                URL de destino del código QR:
              </label>
              <input
                type="text"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] text-stone-800 font-mono"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Por defecto utiliza la dirección actual en la que está publicada la aplicación.
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡URL Copiada al Portapapeles!' : 'Copiar Enlace'}</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-display font-bold text-stone-900 text-sm">
              Acciones de Descarga e Impresión
            </h4>

            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 bg-[#0F3D2E] hover:bg-[#16503c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Imagen PNG en Alta Resolución</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 bg-[#B88B4A] hover:bg-[#a67a3a] text-stone-950 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Cartel para el Mostrador</span>
            </button>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <span className="font-bold block mb-0.5">Ventaja para el instituto:</span>
            Los alumnos no necesitan descargar ninguna aplicación pesada. Se abre directamente en el navegador del móvil con consumo mínimo de datos.
          </div>
        </div>
      </div>
    </section>
  );
};
