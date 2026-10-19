import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Package,
  Clock,
  TrendingUp,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Database,
  Eye,
  EyeOff,
  CheckCircle2,
  Ban,
  ChefHat,
  Search,
  Filter,
} from 'lucide-react';
import { CATEGORIES, ALLERGENS } from '../data/initialData';
import { Order, OrderStatus, Product, ProductCategory } from '../types';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    toggleProductAvailability,
    resetToDefaultCatalog,
    orders,
    updateOrderStatus,
    toggleOrderPaid,
    settings,
    updateSettings,
    salesSummary,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'stats' | 'settings' | 'supabase'>('orders');

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Form State for Product
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState<ProductCategory>('cafes');
  const [prodFormPrice, setProdFormPrice] = useState<number>(1.40);
  const [prodFormDesc, setProdFormDesc] = useState('');
  const [prodFormIngredients, setProdFormIngredients] = useState('');
  const [prodFormAllergens, setProdFormAllergens] = useState<string[]>([]);
  const [prodFormAvailable, setProdFormAvailable] = useState(true);
  const [prodFormFeatured, setProdFormFeatured] = useState(false);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
    }
  };

  // Open Edit Product Modal
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingProduct(false);
    setProdFormName(prod.name);
    setProdFormCategory(prod.categoryId);
    setProdFormPrice(prod.price);
    setProdFormDesc(prod.description);
    setProdFormIngredients(prod.ingredients);
    setProdFormAllergens(prod.allergens);
    setProdFormAvailable(prod.isAvailable);
    setProdFormFeatured(!!prod.isFeatured);
  };

  const startCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingProduct(true);
    setProdFormName('');
    setProdFormCategory('bocadillos');
    setProdFormPrice(2.00);
    setProdFormDesc('');
    setProdFormIngredients('');
    setProdFormAllergens([]);
    setProdFormAvailable(true);
    setProdFormFeatured(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodFormName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodFormName.trim(),
        categoryId: prodFormCategory,
        price: Number(prodFormPrice),
        description: prodFormDesc.trim(),
        ingredients: prodFormIngredients.trim(),
        allergens: prodFormAllergens,
        isAvailable: prodFormAvailable,
        isFeatured: prodFormFeatured,
      });
      setEditingProduct(null);
    } else if (isCreatingProduct) {
      addProduct({
        name: prodFormName.trim(),
        categoryId: prodFormCategory,
        price: Number(prodFormPrice),
        description: prodFormDesc.trim(),
        ingredients: prodFormIngredients.trim(),
        allergens: prodFormAllergens,
        isAvailable: prodFormAvailable,
        isFeatured: prodFormFeatured,
      });
      setIsCreatingProduct(false);
    }
  };

  const toggleFormAllergen = (id: string) => {
    setProdFormAllergens((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Export CSV of collected sales
  const handleExportSalesCsv = () => {
    const delivered = orders.filter((o) => o.paid || o.status === 'entregado');
    const headers = 'ID Pedido,Fecha,Cliente,Colectivo,Total Euros,Estado,Pagado,Items\n';
    const rows = delivered
      .map((o) => {
        const itemNames = o.items.map((i) => `${i.quantity}x ${i.name}`).join(' | ');
        return `"${o.id}","${o.createdAt}","${o.customerName}","${o.customerRole}","${o.totalAmount}","${o.status}","${o.paid}","${itemNames}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ventas_Cafeteria_IES_Los_Rosales_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // If not logged in, show PIN Pad / Login Form
  if (!isAdmin) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-[#0F3D2E]" />
          </div>

          <div>
            <h2 className="text-2xl font-display font-extrabold text-[#0F3D2E]">
              Acceso a Gestión
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Panel exclusivo para el personal de la Cafetería IES Los Rosales.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Introduce PIN o clave..."
                className="w-full text-center text-lg tracking-widest font-mono py-3 px-4 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                  PIN incorrecto. (PIN de prueba por defecto: <strong>1234</strong>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Entrar al Panel
            </button>
          </form>

          <p className="text-[11px] text-stone-400">
            Clave predeterminada de demostración: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">1234</code> o <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0F3D2E] text-white">
              <Shield className="w-5 h-5 text-[#DFBF75]" />
            </span>
            <h1 className="text-2xl font-display font-extrabold text-[#0F3D2E]">
              Panel de Administración y Control
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestión en tiempo real de pedidos, catálogo, precios, horarios e informes de venta.
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="self-start sm:self-auto px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#0F3D2E] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Gestión de Pedidos</span>
          <span className="bg-white/20 px-1.5 py-0.2 rounded-full tabular-nums">
            {orders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'products'
              ? 'bg-[#0F3D2E] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Productos y Precios</span>
          <span className="text-stone-400 tabular-nums">({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'stats'
              ? 'bg-[#0F3D2E] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Caja y Estadísticas</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#0F3D2E] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Horarios y Avisos</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'supabase'
              ? 'bg-[#0F3D2E] text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Arquitectura &amp; Supabase</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'pendiente', label: 'Pendientes' },
                  { id: 'aceptado', label: 'Aceptados' },
                  { id: 'en_preparacion', label: 'En preparación' },
                  { id: 'listo', label: 'Listos' },
                  { id: 'entregado', label: 'Entregados' },
                  { id: 'cancelado', label: 'Cancelados' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                    orderStatusFilter === f.id
                      ? 'bg-[#0F3D2E] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar por # o cliente..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
              No hay pedidos que coincidan con el filtro actual.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl border transition-all bg-white shadow-2xs ${
                    order.status === 'listo'
                      ? 'border-emerald-500/80 ring-1 ring-emerald-500/30'
                      : order.status === 'pendiente'
                      ? 'border-amber-400/80 bg-amber-50/20'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-black text-lg text-stone-900">
                          #{order.id}
                        </span>
                        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          {order.customerName} ({order.customerRole})
                        </span>
                        {order.customerContact && (
                          <span className="text-xs text-stone-400">
                            📞 {order.customerContact}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-[#B88B4A]" />
                          <span>{order.pickupSlot}</span>
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#0F3D2E] tabular-nums block">
                          {order.totalAmount.toFixed(2).replace('.', ',')} €
                        </span>
                        <button
                          onClick={() => toggleOrderPaid(order.id)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                            order.paid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {order.paid ? '✓ Cobrado en mostrador' : '⚠ Pendiente de cobro (clic al cobrar)'}
                        </button>
                      </div>

                      {/* Status Selector Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'listo'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : order.status === 'en_preparacion'
                            ? 'bg-[#B88B4A] text-stone-950 border-[#B88B4A]'
                            : order.status === 'entregado'
                            ? 'bg-stone-200 text-stone-700 border-stone-300'
                            : 'bg-white text-stone-800 border-stone-300'
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aceptado">Aceptado</option>
                        <option value="en_preparacion">En preparación</option>
                        <option value="listo">Listo para recoger</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="pt-3 space-y-2">
                    <div className="text-xs text-stone-700 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between">
                          <div>
                            <span className="font-bold mr-2 text-stone-900">
                              {item.quantity}x {item.name}
                            </span>
                            {item.isCombo && item.comboSelections && (
                              <span className="text-stone-500 text-[11px] block pl-4">
                                [{item.comboSelections.mainChoice} + {item.comboSelections.drinkChoice} + {item.comboSelections.sideChoice}]
                              </span>
                            )}
                            {item.customOptions && (
                              <span className="text-stone-500 text-[11px] block pl-4 italic">
                                {Object.entries(item.customOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-stone-600 tabular-nums">
                            {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-xs bg-stone-50 p-2 rounded-lg text-stone-600 mt-2">
                        <strong className="text-stone-800">Nota del comensal:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS AND PRICES */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Catálogo de Productos y Precios
              </h3>
              <p className="text-xs text-stone-500">
                Modifica precios al instante, marca productos agotados o añade nuevos artículos.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaultCatalog}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                Restaurar Carta Original
              </button>
              <button
                onClick={startCreateProduct}
                className="px-4 py-2 bg-[#0F3D2E] hover:bg-[#16503c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Precio (€)</th>
                    <th className="py-3 px-4">Disponibilidad</th>
                    <th className="py-3 px-4">Alérgenos</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block">{p.name}</span>
                        <span className="text-[11px] text-stone-400 line-clamp-1">{p.description}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {CATEGORIES.find((c) => c.id === p.categoryId)?.name || p.categoryId}
                      </td>
                      <td className="py-3 px-4">
                        {/* Inline price updater */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.05"
                            defaultValue={p.price}
                            onBlur={(e) => {
                              const newPrice = parseFloat(e.target.value);
                              if (!isNaN(newPrice) && newPrice > 0) {
                                updateProduct(p.id, { price: newPrice });
                              }
                            }}
                            className="w-16 px-2 py-1 text-xs font-mono font-bold border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
                          />
                          <span className="text-stone-400 font-bold">€</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleProductAvailability(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            p.isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {p.isAvailable ? '✓ Disponible' : '✕ Agotado'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {p.allergens.length > 0 ? (
                          <span>{p.allergens.join(', ')}</span>
                        ) : (
                          <span className="text-stone-300">Ninguno</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 cursor-pointer"
                            title="Editar ficha completa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar producto "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-100 cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS SUMMARY & STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Resumen Económico y Estadísticas de Cafetería
              </h3>
              <p className="text-xs text-stone-500">
                Cumplimiento de control de caja: las ventas registradas reflejan únicamente comandas efectivamente cobradas en mostrador.
              </p>
            </div>
            <button
              onClick={handleExportSalesCsv}
              className="px-4 py-2 bg-[#0F3D2E] hover:bg-[#16503c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Informe CSV</span>
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Ventas Cobradas (Caja)
              </span>
              <span className="text-2xl font-extrabold text-emerald-700 font-display tabular-nums">
                {salesSummary.totalCollected.toFixed(2).replace('.', ',')} €
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                {salesSummary.ordersDeliveredCount} pedidos finalizados
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Pendiente de Cobro
              </span>
              <span className="text-2xl font-extrabold text-amber-600 font-display tabular-nums">
                {salesSummary.totalPendingCollection.toFixed(2).replace('.', ',')} €
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                {salesSummary.ordersPendingCount} pedidos en curso
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Ticket Medio
              </span>
              <span className="text-2xl font-extrabold text-[#0F3D2E] font-display tabular-nums">
                {salesSummary.averageTicket.toFixed(2).replace('.', ',')} €
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Gasto promedio por comanda
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Total de Pedidos
              </span>
              <span className="text-2xl font-extrabold text-stone-900 font-display tabular-nums">
                {orders.length}
              </span>
              <p className="text-[11px] text-stone-400 mt-1">
                Registrados en el sistema
              </p>
            </div>
          </div>

          {/* Top Selling Items & Category breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-stone-900 text-sm">
                Productos Más Demandados en Recreos
              </h4>
              {salesSummary.topSellingItems.length > 0 ? (
                <div className="space-y-3">
                  {salesSummary.topSellingItems.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-medium text-stone-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-stone-400 tabular-nums">{item.quantity} uds.</span>
                        <span className="font-bold text-stone-900 tabular-nums">
                          {item.revenue.toFixed(2).replace('.', ',')} €
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400">Sin datos de venta suficientes aún.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-stone-900 text-sm">
                Recaudación por Categoría
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(salesSummary.salesByCategory).map(([catId, amount]) => (
                  <div key={catId} className="flex items-center justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-700 font-medium">
                      {CATEGORIES.find((c) => c.id === catId)?.name || catId}
                    </span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {amount.toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & SCHEDULE */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <h3 className="font-display font-bold text-lg text-stone-900">
            Ajustes del Servicio y Comunicados
          </h3>

          <div className="space-y-4 text-xs">
            {/* Preorders switch */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 text-sm block">
                  Permitir Pedidos Anticipados Online
                </span>
                <span className="text-stone-500">
                  Activa o desactiva la recepción de pedidos web según las directrices del equipo directivo del centro.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowPreorders}
                onChange={(e) => updateSettings({ allowPreorders: e.target.checked })}
                className="w-5 h-5 rounded text-[#0F3D2E] focus:ring-[#0F3D2E] cursor-pointer"
              />
            </div>

            {/* Banner announcement */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">
                  Banner Promocional Superior
                </span>
                <input
                  type="checkbox"
                  checked={settings.bannerActive}
                  onChange={(e) => updateSettings({ bannerActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0F3D2E] focus:ring-[#0F3D2E] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Título de la oferta:</label>
                <input
                  type="text"
                  value={settings.bannerTitle}
                  onChange={(e) => updateSettings({ bannerTitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Texto descriptivo:</label>
                <input
                  type="text"
                  value={settings.bannerText}
                  onChange={(e) => updateSettings({ bannerText: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            {/* Hours configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Recreo Mañana:</label>
                <input
                  type="text"
                  value={settings.recessMorning}
                  onChange={(e) => updateSettings({ recessMorning: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Recreo Mediodía:</label>
                <input
                  type="text"
                  value={settings.recessMidday}
                  onChange={(e) => updateSettings({ recessMidday: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Horario General del Centro:</label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => updateSettings({ openingHours: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE & ARCHITECTURE DOCUMENTATION */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display font-bold text-lg text-stone-900">
                Esquema de Base de Datos y Conexión Supabase (PostgreSQL)
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Conforme a los requisitos de la arquitectura, esta aplicación incluye la especificación completa del modelo relacional en PostgreSQL para Supabase con políticas RLS (Row Level Security).
            </p>
          </div>

          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl font-mono text-[11px] overflow-x-auto space-y-3 leading-relaxed">
            <div className="text-emerald-400 font-bold">
              -- MIGRACIÓN SQL PARA SUPABASE (CAFETERÍA IES LOS ROSALES)
            </div>
            <pre>{`-- 1. Categorías
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0
);

-- 2. Productos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  price NUMERIC(6,2) NOT NULL,
  description TEXT,
  ingredients TEXT,
  allergens TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Pedidos
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_role TEXT NOT NULL,
  customer_contact TEXT,
  pickup_slot TEXT NOT NULL,
  total_amount NUMERIC(6,2) NOT NULL,
  status TEXT DEFAULT 'pendiente',
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ítems del Pedido
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(6,2) NOT NULL,
  custom_selections JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Configuración de Cafetería
CREATE TABLE business_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  allow_preorders BOOLEAN DEFAULT true,
  banner_active BOOLEAN DEFAULT true,
  banner_title TEXT,
  banner_text TEXT,
  recess_morning TEXT,
  recess_midday TEXT,
  opening_hours TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- POLÍTICAS RLS (Row Level Security):
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Acceso público de lectura a productos disponibles:
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Creación pública de pedidos (sin login):
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);

-- Administración de pedidos solo para staff autenticado:
CREATE POLICY "Admin Full Access" ON orders FOR ALL TO authenticated USING (true);`}</pre>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 space-y-2">
            <span className="font-bold block">Variables de entorno para producción (.env):</span>
            <code className="block bg-white p-2 rounded border border-emerald-300 font-mono text-[11px] text-stone-800">
              VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"<br />
              VITE_SUPABASE_ANON_KEY="tu-clave-anonima-publica"
            </code>
            <p className="text-[11px] text-emerald-800">
              Actualmente los datos se sincronizan con persistencia reactiva en el cliente, permitiendo a la cantina operar inmediatamente.
            </p>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {(editingProduct || isCreatingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
            <h3 className="font-display font-bold text-lg text-stone-900 mb-4">
              {editingProduct ? `Editar "${editingProduct.name}"` : 'Crear Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre del producto *</label>
                <input
                  type="text"
                  required
                  value={prodFormName}
                  onChange={(e) => setProdFormName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F3D2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={prodFormCategory}
                    onChange={(e) => setProdFormCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Precio en Euros (€) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={prodFormPrice}
                    onChange={(e) => setProdFormPrice(parseFloat(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descripción breve</label>
                <textarea
                  rows={2}
                  value={prodFormDesc}
                  onChange={(e) => setProdFormDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Ingredientes detallados</label>
                <textarea
                  rows={2}
                  value={prodFormIngredients}
                  onChange={(e) => setProdFormIngredients(e.target.value)}
                  placeholder="Ej: Pan de barra, jamón cocido, queso gouda..."
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              {/* Allergens selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Alérgenos presentes:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-stone-50 rounded-lg border border-stone-200">
                  {ALLERGENS.map((allergen) => {
                    const isChecked = prodFormAllergens.includes(allergen.id);
                    return (
                      <button
                        key={allergen.id}
                        type="button"
                        onClick={() => toggleFormAllergen(allergen.id)}
                        className={`p-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 text-left transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-[#0F3D2E] text-white'
                            : 'bg-white text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        <span>{allergen.icon}</span>
                        <span className="truncate">{allergen.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={prodFormAvailable}
                    onChange={(e) => setProdFormAvailable(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>Disponible para pedir</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={prodFormFeatured}
                    onChange={(e) => setProdFormFeatured(e.target.checked)}
                    className="rounded text-[#0F3D2E]"
                  />
                  <span>Destacado en portada</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F3D2E] hover:bg-[#16503c] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
