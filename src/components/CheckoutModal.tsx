import React, { useState } from 'react';
import { X, Clock, ShieldCheck, CheckCircle2, User, Phone, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const { cart, cartTotal, placeOrder, settings, setActiveView } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerRole, setCustomerRole] = useState<'estudiante' | 'profesor' | 'personal'>('estudiante');
  const [customerContact, setCustomerContact] = useState('');
  const [pickupSlot, setPickupSlot] = useState(`Recreo de mañana (${settings.recessMorning})`);
  const [notes, setNotes] = useState('');
  const [acceptedRgpd, setAcceptedRgpd] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const pickupSlots = [
    `Recreo de mañana (${settings.recessMorning})`,
    `Recreo de mediodía (${settings.recessMidday})`,
    'Turno de Comida / Salida (14:15 - 14:45)',
    'Recogida inmediata en 10-15 min (sujeto a disponibilidad)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMsg('Por favor introduce tu nombre o alias para llamar tu pedido.');
      return;
    }

    if (!acceptedRgpd) {
      setErrorMsg('Debes aceptar la nota básica de recogida según el protocolo del centro.');
      return;
    }

    const createdOrder = placeOrder({
      customerName: customerName.trim(),
      customerRole,
      customerContact: customerContact.trim() || undefined,
      pickupSlot,
      notes: notes.trim() || undefined,
    });

    if (createdOrder) {
      onSuccess();
      setActiveView('order-status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider">
              Cafetería IES Los Rosales
            </span>
            <h2 className="text-xl font-display font-bold text-stone-900">
              Confirmar Recogida Anticipada
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Nombre de recogida *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Ej: Lucía García (o tu nombre habitual)"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] text-stone-900"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Se utilizará únicamente para avisarte en la barra del centro.
            </p>
          </div>

          {/* Customer Role in Institute */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Colectivo del Centro *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'estudiante', label: 'Estudiante' },
                { id: 'profesor', label: 'Profesorado' },
                { id: 'personal', label: 'Personal PAS' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setCustomerRole(role.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    customerRole === role.id
                      ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Slot Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Franja de recogida autorizada *
            </label>
            <div className="space-y-1.5">
              {pickupSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPickupSlot(slot)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                    pickupSlot === slot
                      ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 text-[#0F3D2E] ring-1 ring-[#0F3D2E]'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#B88B4A]" />
                    <span>{slot}</span>
                  </div>
                  {pickupSlot === slot && <CheckCircle2 className="w-4 h-4 text-[#0F3D2E]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Contact */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Teléfono o email (opcional):
            </label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              placeholder="Para consultas urgentes del pedido si falta algún ingrediente"
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Notas para barra o cocina (opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Pan muy tostado, sacar con servilleta extra..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
            />
          </div>

          {/* Payment Terms Notice */}
          <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#DFBF75]/50 text-xs text-stone-700 space-y-1">
            <div className="flex items-center justify-between font-bold text-stone-900">
              <span>Forma de pago:</span>
              <span className="text-[#0F3D2E]">En mostrador de cafetería</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Abona los <strong className="tabular-nums font-semibold">{cartTotal.toFixed(2).replace('.', ',')} €</strong> en efectivo o con tarjeta en el datáfono del centro al retirar tu bandeja.
            </p>
          </div>

          {/* RGPD & Privacy Notice */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="rgpdCheck"
              checked={acceptedRgpd}
              onChange={(e) => setAcceptedRgpd(e.target.checked)}
              className="mt-1 rounded border-stone-300 text-[#0F3D2E] focus:ring-[#0F3D2E] cursor-pointer"
            />
            <label htmlFor="rgpdCheck" className="text-[11px] text-stone-500 leading-tight">
              Acepto que estos datos se procesen conforme al RGPD exclusivamente para la gestión y llamada del pedido en la cafetería escolar durante la jornada.
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Volver a la bandeja
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Emitir Pedido ({cartTotal.toFixed(2).replace('.', ',')} €)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
