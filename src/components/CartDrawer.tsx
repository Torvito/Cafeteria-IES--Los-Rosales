import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    settings,
  } = useApp();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#0F3D2E]/10 rounded-lg text-[#0F3D2E]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-stone-900">
                  Tu Bandeja / Pedido
                </h2>
                <span className="text-xs text-stone-500">
                  {cartCount} {cartCount === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-stone-300" />
                <p className="text-sm font-semibold text-stone-600 mb-1">
                  Tu bandeja está vacía
                </p>
                <p className="text-xs text-stone-400 max-w-xs mb-4">
                  Añade cafés, bocadillos o combos desde el menú digital para calcular tu compra o pedir con antelación.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-[#0F3D2E] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Explorar la carta
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                  <span>Productos agregados</span>
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Vaciar todo
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-xs font-extrabold text-[#0F3D2E] tabular-nums">
                          {item.price.toFixed(2).replace('.', ',')} € / ud.
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1 text-stone-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Combo Selections (if applicable) */}
                    {item.isCombo && item.comboSelections && (
                      <div className="bg-[#FAF7F0] p-2.5 rounded-lg text-[11px] text-stone-700 space-y-0.5 border border-[#DFBF75]/30">
                        <p><strong>Principal:</strong> {item.comboSelections.mainChoice}</p>
                        <p><strong>Bebida:</strong> {item.comboSelections.drinkChoice}</p>
                        <p><strong>Extra:</strong> {item.comboSelections.sideChoice}</p>
                      </div>
                    )}

                    {/* Custom Options (e.g. Milk choice) */}
                    {item.customOptions && (
                      <div className="text-[11px] text-stone-500 italic">
                        {Object.entries(item.customOptions).map(([key, val]) => (
                          <span key={key}>
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes if any */}
                    {item.notes && (
                      <div className="text-[11px] text-stone-500 bg-stone-50 p-1.5 rounded">
                        <span className="font-medium text-stone-700">Nota:</span> {item.notes}
                      </div>
                    )}

                    {/* Quantity Stepper and Subtotal */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-stone-900 tabular-nums">
                        {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-4 shadow-lg">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="tabular-nums font-semibold">
                    {cartTotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Gastos de gestión:</span>
                  <span className="text-emerald-700 font-semibold">0,00 € (Gratis)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total a pagar en mostrador:</span>
                  <span className="text-lg text-[#0F3D2E] tabular-nums font-display">
                    {cartTotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {settings.allowPreorders ? (
                <div className="space-y-2.5">
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Confirmar Pedido Anticipado</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={getWhatsAppOrderUrl({
                      items: cart,
                      totalAmount: cartTotal,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-stone-950" />
                    <span>Enviar pedido por WhatsApp</span>
                  </a>

                  <p className="text-[10px] text-stone-400 text-center leading-tight">
                    Al pulsar se abrirá WhatsApp (34615741675). Recuerda pulsar &ldquo;Enviar&rdquo; para que la cafetería reciba tu mensaje.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-amber-800 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Pedidos anticipados no autorizados temporalmente</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      El servicio anticipado está en pausa. Puedes consultar el menú y realizar tu compra directamente en el mostrador del centro.
                    </p>
                  </div>

                  <a
                    href={getWhatsAppOrderUrl({
                      items: cart,
                      totalAmount: cartTotal,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-stone-950" />
                    <span>Enviar pedido por WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 bg-stone-800 text-white text-xs font-semibold rounded-lg hover:bg-stone-700 cursor-pointer"
                  >
                    Consultar menú en barra
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setShowCheckoutModal(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </div>
  );
};
