import { CartItem } from '../types';

export const CAFETERIA_WHATSAPP_NUMBER = '34615741675';

export function formatPriceEuros(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} €`;
}

export interface WhatsAppOrderDetails {
  orderRef?: string;
  customerName?: string;
  customerRole?: string;
  pickupSlot?: string;
  items: CartItem[];
  totalAmount: number;
  notes?: string;
}

export function buildWhatsAppOrderMessage(params: WhatsAppOrderDetails): string {
  const lines: string[] = [];

  lines.push('☕ *PEDIDO - CAFETERÍA IES LOS ROSALES*');
  lines.push('--------------------------------');

  if (params.orderRef) {
    lines.push(`📋 *Referencia de pedido:* #${params.orderRef}`);
  }
  if (params.customerName) {
    lines.push(`👤 *Cliente:* ${params.customerName}${params.customerRole ? ` (${params.customerRole})` : ''}`);
  }
  if (params.pickupSlot) {
    lines.push(`⏰ *Hora / Franja de recogida:* ${params.pickupSlot}`);
  }

  lines.push('');
  lines.push('🛒 *Productos y cantidades:*');

  params.items.forEach((item) => {
    const itemSubtotal = formatPriceEuros(item.price * item.quantity);
    lines.push(`• ${item.quantity}x ${item.name} (${itemSubtotal})`);

    if (item.isCombo && item.comboSelections) {
      lines.push(`   ▫️ Principal: ${item.comboSelections.mainChoice}`);
      lines.push(`   ▫️ Bebida: ${item.comboSelections.drinkChoice}`);
      lines.push(`   ▫️ Acompañamiento: ${item.comboSelections.sideChoice}`);
    }

    if (item.customOptions && Object.keys(item.customOptions).length > 0) {
      Object.entries(item.customOptions).forEach(([key, val]) => {
        lines.push(`   ▫️ ${key}: ${val}`);
      });
    }

    if (item.notes) {
      lines.push(`   ▫️ Indicaciones: ${item.notes}`);
    }
  });

  lines.push('');
  lines.push(`💰 *Total a pagar:* ${formatPriceEuros(params.totalAmount)}`);
  lines.push('💳 *Forma de pago:* En mostrador de cafetería al recoger');

  if (params.notes) {
    lines.push(`📝 *Observaciones:* ${params.notes}`);
  }

  lines.push('');
  lines.push('Por favor, confirmadme disponibilidad. ¡Muchas gracias!');

  return lines.join('\n');
}

export function getWhatsAppOrderUrl(params: WhatsAppOrderDetails): string {
  const text = buildWhatsAppOrderMessage(params);
  return `https://wa.me/${CAFETERIA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
