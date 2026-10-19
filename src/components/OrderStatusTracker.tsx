import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, ChefHat, Sparkles, PackageCheck, Ban } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrderStatusTracker: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, setActiveView } = useApp();
  const [searchInput, setSearchInput] = useState(trackingOrderId || '');

  // Select target order: matching searchInput, or fallback to first active or recent order
  const targetOrder = orders.find(
    (o) => o.id.toLowerCase() === (searchInput.trim().toLowerCase() || trackingOrderId.toLowerCase())
  ) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackingOrderId(searchInput.trim());
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente':
        return 1;
      case 'aceptado':
        return 2;
      case 'en_preparacion':
        return 3;
      case 'listo':
        return 4;
      case 'entregado':
        return 5;
      case 'cancelado':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = targetOrder ? getStatusStep(targetOrder.status) : 1;

  const steps = [
    { num: 1, label: 'Pendiente', desc: 'Recibido en cafetería' },
    { num: 2, label: 'Aceptado', desc: 'Comanda verificada' },
    { num: 3, label: 'En preparación', desc: 'Cocinando y montando' },
    { num: 4, label: 'Listo para recoger', desc: '¡En mostrador!' },
    { num: 5, label: 'Entregado', desc: 'Servido y cobrado' },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-[#B88B4A] uppercase tracking-wider">
          Servicio de Mostrador
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0F3D2E] tracking-tight mt-1">
          Estado de tu Pedido
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
          Introduce tu código de pedido (ej: ROS-1039) para comprobar en tiempo real si tu desayuno o almuerzo ya está listo.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-5 max-w-sm mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Número de pedido: ROS-1040..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0F3D2E] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#16503c] cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {targetOrder ? (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-lg overflow-hidden">
          {/* Order Header Banner */}
          <div className="bg-[#0F3D2E] text-[#F8F1E3] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-mono font-black text-white">
                  #{targetOrder.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#B88B4A] text-stone-950 font-bold uppercase tracking-wider">
                  {targetOrder.status === 'pendiente' && 'Pendiente de aceptación'}
                  {targetOrder.status === 'aceptado' && 'Aceptado por cafetería'}
                  {targetOrder.status === 'en_preparacion' && 'En preparación en cocina'}
                  {targetOrder.status === 'listo' && '¡Listo para recoger en barra!'}
                  {targetOrder.status === 'entregado' && 'Entregado con éxito'}
                  {targetOrder.status === 'cancelado' && 'Pedido Cancelado'}
                </span>
              </div>
              <p className="text-xs text-[#F8F1E3]/80">
                A nombre de: <strong className="text-white">{targetOrder.customerName}</strong> ({targetOrder.customerRole})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-[#F8F1E3]/70 block">Total a pagar:</span>
              <span className="text-2xl font-display font-black text-[#DFBF75] tabular-nums">
                {targetOrder.totalAmount.toFixed(2).replace('.', ',')} €
              </span>
              <span className="text-[11px] block text-[#F8F1E3]/60">
                {targetOrder.paid ? '✓ Pagado en mostrador' : 'Pago pendiente en barra'}
              </span>
            </div>
          </div>

          {/* Alert if Ready for pickup */}
          {targetOrder.status === 'listo' && (
            <div className="bg-emerald-50 border-b border-emerald-200 p-4 flex items-center gap-3 text-emerald-900">
              <PackageCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">¡Tu pedido está listo para recoger!</h4>
                <p className="text-xs text-emerald-700">
                  Acércate a la barra de la cafetería con tu identificador <strong>#{targetOrder.id}</strong> para retirar tu pedido sin hacer cola normal.
                </p>
              </div>
            </div>
          )}

          {targetOrder.status === 'cancelado' && (
            <div className="bg-red-50 border-b border-red-200 p-4 flex items-center gap-3 text-red-900">
              <Ban className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Pedido cancelado</h4>
                <p className="text-xs text-red-700">
                  Este pedido fue cancelado. Si tienes dudas, consulta directamente al personal de cafetería.
                </p>
              </div>
            </div>
          )}

          {/* Visual Stepper (when not cancelled) */}
          {targetOrder.status !== 'cancelado' && (
            <div className="p-6 bg-stone-50/60 border-b border-stone-200">
              <div className="relative">
                {/* Horizontal Progress Line on Desktop */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-stone-200 z-0">
                  <div
                    className="h-full bg-[#0F3D2E] transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100))}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                  {steps.map((st) => {
                    const isCompleted = currentStep >= st.num;
                    const isCurrent = currentStep === st.num;

                    return (
                      <div key={st.num} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                            isCompleted
                              ? 'bg-[#0F3D2E] text-white shadow-md'
                              : 'bg-white border-2 border-stone-200 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-[#B88B4A]/40' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : st.num}
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight ${
                            isCompleted ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {st.label}
                        </span>
                        <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5">Franja de recogida asignada:</span>
                <p className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B88B4A]" />
                  <span>{targetOrder.pickupSlot}</span>
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block mb-0.5">Fecha y hora de emisión:</span>
                <p className="font-bold text-stone-800">
                  {new Date(targetOrder.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Itemized Order Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Detalle de los artículos:
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
                {targetOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                      </div>

                      {item.isCombo && item.comboSelections && (
                        <div className="text-xs text-stone-600 pl-6 space-y-0.5">
                          <p>• {item.comboSelections.mainChoice}</p>
                          <p>• {item.comboSelections.drinkChoice}</p>
                          <p>• {item.comboSelections.sideChoice}</p>
                        </div>
                      )}

                      {item.customOptions && (
                        <div className="text-xs text-stone-500 pl-6 italic">
                          {Object.entries(item.customOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </div>
                      )}
                    </div>

                    <span className="font-extrabold text-sm text-stone-900 tabular-nums shrink-0">
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {targetOrder.notes && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-bold text-stone-800">Observaciones para barra:</span> {targetOrder.notes}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 mb-1">
            No se encontró el pedido
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Comprueba el código o crea tu primer pedido desde el menú digital.
          </p>
          <button
            onClick={() => setActiveView('menu')}
            className="px-4 py-2 bg-[#0F3D2E] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Ir al Menú Digital
          </button>
        </div>
      )}
    </section>
  );
};
