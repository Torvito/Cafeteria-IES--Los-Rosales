import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { BusinessSettings, CartItem, Order, OrderStatus, Product, ProductCategory, SalesSummary } from '../types';

interface AppContextType {
  // Navigation & UI state
  activeView: 'home' | 'menu' | 'combos' | 'order-status' | 'allergens' | 'admin' | 'qr';
  setActiveView: (view: 'home' | 'menu' | 'combos' | 'order-status' | 'allergens' | 'admin' | 'qr') => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Products
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  resetToDefaultCatalog: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    customerRole: 'estudiante' | 'profesor' | 'personal';
    customerContact?: string;
    pickupSlot: string;
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOrderPaid: (orderId: string) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Business Settings
  settings: BusinessSettings;
  updateSettings: (updates: Partial<BusinessSettings>) => void;

  // Admin Auth
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;

  // Analytics & Sales
  salesSummary: SalesSummary;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'ies_rosales_products_v1',
  SETTINGS: 'ies_rosales_settings_v1',
  ORDERS: 'ies_rosales_orders_v1',
  CART: 'ies_rosales_cart_v1',
  ADMIN_TOKEN: 'ies_rosales_admin_token',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Filters
  const [activeView, setActiveView] = useState<'home' | 'menu' | 'combos' | 'order-status' | 'allergens' | 'admin' | 'qr'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Settings State
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings from storage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading orders from storage', e);
    }
    return INITIAL_ORDERS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
    return [];
  });

  // Admin Auth State (Default PIN: "1234" or "admin123")
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) === 'authorized';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to sync settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart', e);
    }
  }, [cart]);

  // Product Actions
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    setProducts((prev) => [...prev, { ...newProd, id }]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
  };

  // Cart Actions
  const addToCart = (item: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = `${item.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setCart((prev) => {
      // If it's a standard non-combo item with no custom choices, merge quantity
      if (!item.isCombo && (!item.customOptions || Object.keys(item.customOptions).length === 0)) {
        const existingIndex = prev.findIndex(
          (i) => i.productId === item.productId && !i.isCombo && (!i.customOptions || Object.keys(i.customOptions).length === 0)
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          };
          return updated;
        }
      }
      return [...prev, { ...item, cartItemId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Order Actions
  const placeOrder = (orderData: {
    customerName: string;
    customerRole: 'estudiante' | 'profesor' | 'personal';
    customerContact?: string;
    pickupSlot: string;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    // Generate readable Spanish institute order ID, e.g. ROS-1041
    const orderNumber = 1040 + orders.length + 1;
    const newOrder: Order = {
      id: `ROS-${orderNumber}`,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName.trim(),
      customerRole: orderData.customerRole,
      customerContact: orderData.customerContact?.trim(),
      pickupSlot: orderData.pickupSlot,
      items: [...cart],
      totalAmount: Number(cartTotal.toFixed(2)),
      status: 'pendiente',
      notes: orderData.notes?.trim(),
      paid: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setLastCreatedOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isDelivered = status === 'entregado';
          return {
            ...o,
            status,
            paid: isDelivered ? true : o.paid,
            paidAt: isDelivered && !o.paidAt ? new Date().toISOString() : o.paidAt,
          };
        }
        return o;
      })
    );
  };

  const toggleOrderPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paid: !o.paid,
              paidAt: !o.paid ? new Date().toISOString() : undefined,
            }
          : o
      )
    );
  };

  // Settings Actions
  const updateSettings = (updates: Partial<BusinessSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Admin Auth
  const loginAdmin = (pin: string): boolean => {
    // Accepts '1234', 'admin123' or 'rosales2026'
    const validPins = ['1234', 'admin123', 'rosales2026'];
    if (validPins.includes(pin.trim())) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'authorized');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    } catch (e) {
      console.error(e);
    }
  };

  // Sales Summary Calculation
  // Distinction requirement: only count delivered / actually paid orders as real sales!
  const salesSummary = useMemo<SalesSummary>(() => {
    const deliveredPaidOrders = orders.filter((o) => o.paid || o.status === 'entregado');
    const pendingOrders = orders.filter((o) => !o.paid && o.status !== 'cancelado' && o.status !== 'entregado');

    const totalCollected = deliveredPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPendingCollection = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const ordersDeliveredCount = deliveredPaidOrders.length;
    const ordersPendingCount = pendingOrders.length;
    const averageTicket = ordersDeliveredCount > 0 ? totalCollected / ordersDeliveredCount : 0;

    // Top selling items
    const itemMap: Record<string, { quantity: number; revenue: number }> = {};
    const categoryBreakdown: Record<string, number> = {};

    deliveredPaidOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!itemMap[item.name]) {
          itemMap[item.name] = { quantity: 0, revenue: 0 };
        }
        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].revenue += item.price * item.quantity;

        categoryBreakdown[item.categoryId] = (categoryBreakdown[item.categoryId] || 0) + item.price * item.quantity;
      });
    });

    const topSellingItems = Object.entries(itemMap)
      .map(([name, data]) => ({ name, quantity: data.quantity, revenue: data.revenue }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalCollected: Number(totalCollected.toFixed(2)),
      totalPendingCollection: Number(totalPendingCollection.toFixed(2)),
      ordersDeliveredCount,
      ordersPendingCount,
      averageTicket: Number(averageTicket.toFixed(2)),
      topSellingItems,
      salesByCategory: categoryBreakdown,
    };
  }, [orders]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        toggleProductAvailability,
        resetToDefaultCatalog,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        updateOrderStatus,
        toggleOrderPaid,
        trackingOrderId,
        setTrackingOrderId,
        lastCreatedOrder,
        setLastCreatedOrder,
        settings,
        updateSettings,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        salesSummary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
