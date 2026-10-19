export type ProductCategory =
  | 'cafes'
  | 'desayunos'
  | 'pulgas'
  | 'combos'
  | 'bocadillos'
  | 'sandwiches'
  | 'empanadas'
  | 'bebidas'
  | 'refrescos'
  | 'menu-dia';

export interface AllergenInfo {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: ProductCategory;
  price: number;
  description: string;
  image?: string;
  allergens: string[]; // ids from ALLERGENS list
  ingredients: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  options?: {
    name: string;
    choices: string[];
  }[];
}

export interface ComboItemSelection {
  mainChoice: string;
  drinkChoice: string;
  sideChoice: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: ProductCategory;
  isCombo?: boolean;
  comboSelections?: ComboItemSelection;
  customOptions?: Record<string, string>;
  notes?: string;
}

export type OrderStatus =
  | 'pendiente'
  | 'aceptado'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado';

export interface Order {
  id: string; // e.g. "ROS-1042"
  createdAt: string;
  customerName: string;
  customerRole: 'estudiante' | 'profesor' | 'personal';
  customerContact?: string;
  pickupSlot: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  paid: boolean;
  paidAt?: string;
}

export interface BusinessSettings {
  allowPreorders: boolean;
  preorderNotice: string;
  bannerActive: boolean;
  bannerTitle: string;
  bannerText: string;
  recessMorning: string;
  recessMidday: string;
  openingHours: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  instituteName: string;
  menuDelDiaDesc: string;
}

export interface SalesSummary {
  totalCollected: number;
  totalPendingCollection: number;
  ordersDeliveredCount: number;
  ordersPendingCount: number;
  averageTicket: number;
  topSellingItems: { name: string; quantity: number; revenue: number }[];
  salesByCategory: Record<string, number>;
}
