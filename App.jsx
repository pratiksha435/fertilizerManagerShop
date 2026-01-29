import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Storage utilities
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

// Icon components using Lucide-style
const Icons = {
  Dashboard: () => <span className="text-2xl">📊</span>,
  Sales: () => <span className="text-2xl">🛒</span>,
  Stock: () => <span className="text-2xl">📦</span>,
  History: () => <span className="text-2xl">📋</span>,
  Analysis: () => <span className="text-2xl">📈</span>,
  Add: () => <span>➕</span>,
  Delete: () => <span>🗑️</span>,
  Search: () => <span>🔍</span>,
  User: () => <span>👤</span>,
  Phone: () => <span>📞</span>,
  Location: () => <span>📍</span>,
  Calendar: () => <span>📅</span>,
  Money: () => <span>💰</span>,
  Warning: () => <span>⚠️</span>,
  Check: () => <span>✓</span>,
  Plant: () => <span>🌱</span>,
};

// Format currency
const formatCurrency = (amount) => '₹' + (amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

// Format date
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`} style={{ borderLeftColor: color }}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`} style={{ backgroundColor: color + '20' }}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`mt-3 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
      </div>
    )}
  </div>
);

// Stock Item Card
const StockItemCard = ({ item, onDelete, onAddStock }) => {
  const isLow = item.quantity < (item.minStock || 10);
  return (
    <div className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all ${isLow ? 'border-l-4 border-orange-500' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.category || 'General'}</p>
        </div>
        {isLow && <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-semibold">Low Stock</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center py-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Stock</p>
          <p className={`font-bold ${isLow ? 'text-orange-500' : 'text-green-600'}`}>{item.quantity} {item.unit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Price</p>
          <p className="font-bold text-gray-700">₹{item.price}/{item.unit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Value</p>
          <p className="font-bold text-blue-600">₹{(item.quantity * item.price).toLocaleString()}</p>
        </div>
      </div>
      {item.howToUse && (
        <div className="bg-green-50 p-3 rounded-lg mt-3">
          <p className="text-xs font-semibold text-green-700 mb-1">📋 How to Use:</p>
          <p className="text-xs text-gray-600">{item.howToUse}</p>
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <button onClick={() => onAddStock(item)} className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
          + Add Stock
        </button>
        <button onClick={() => onDelete(item.id)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition">
          <Icons.Delete />
        </button>
      </div>
    </div>
  );
};

// Sale Card
const SaleCard = ({ sale, onDelete }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
    <div className="flex justify-between items-start border-b pb-3 mb-3">
      <div>
        <h3 className="font-bold text-gray-800">{sale.fertilizerName}</h3>
        <p className="text-xs text-gray-500">{formatDate(sale.saleDate)}</p>
      </div>
      <p className="text-xl font-bold text-green-600">{formatCurrency(sale.totalPrice)}</p>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
      <div className="flex justify-between">
        <span className="text-gray-500">Quantity:</span>
        <span className="font-medium">{sale.quantity} {sale.unit}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Payment:</span>
        <span className="font-medium">{sale.paymentMethod}</span>
      </div>
    </div>
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">👤 Customer</p>
      <p className="font-semibold text-gray-800">{sale.customerName}</p>
      <p className="text-xs text-gray-600">📞 {sale.customerPhone}</p>
      {sale.customerAddress && <p className="text-xs text-gray-600">📍 {sale.customerAddress}</p>}
    </div>
    <button onClick={() => onDelete(sale.id)} className="mt-3 text-red-500 text-sm hover:text-red-700 transition">
      🗑️ Delete
    </button>
  </div>
);

// Customer Card
const CustomerCard = ({ customer }) => (
  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
        {customer.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{customer.name}</h3>
        <p className="text-sm text-gray-500">{customer.phone}</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{customer.totalPurchases}</p>
        <p className="text-xs text-gray-500">orders</p>
      </div>
    </div>
    <div className="flex justify-between pt-3 border-t">
      <div>
        <p className="text-xs text-gray-500">Total Spent</p>
        <p className="font-bold text-gray-800">{formatCurrency(customer.totalAmount)}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">Last Purchase</p>
        <p className="font-bold text-gray-800">{formatDate(customer.lastPurchase)}</p>
      </div>
    </div>
  </div>
);

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sales, setSales] = useState([]);
  const [stock, setStock] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Load data on mount
  useEffect(() => {
    const savedSales = storage.get('fertilizer_sales') || [];
    const savedStock = storage.get('fertilizer_stock') || [];
    setSales(savedSales);
    setStock(savedStock);
  }, []);
  
  // Save functions
  const saveSale = (sale) => {
    const newSales = [...sales, { ...sale, id: Date.now().toString(), createdAt: new Date().toISOString() }];
    setSales(newSales);
    storage.set('fertilizer_sales', newSales);
    
    if (sale.fertilizerId) {
      const newStock = stock.map(s => s.id === sale.fertilizerId ? { ...s, quantity: s.quantity - parseFloat(sale.quantity) } : s);
      setStock(newStock);
      storage.set('fertilizer_stock', newStock);
    }
  };
  
  const saveStock = (item) => {
    const existingIndex = stock.findIndex(s => s.name.toLowerCase() === item.name.toLowerCase());
    let newStock;
    if (existingIndex >= 0) {
      newStock = stock.map((s, i) => i === existingIndex ? { ...s, quantity: s.quantity + parseFloat(item.quantity), price: parseFloat(item.price) } : s);
    } else {
      newStock = [...stock, { ...item, id: Date.now().toString(), quantity: parseFloat(item.quantity), price: parseFloat(item.price) }];
    }
    setStock(newStock);
    storage.set('fertilizer_stock', newStock);
  };
  
  const deleteSale = (id) => {
    if (confirm('Delete this sale record?')) {
      const newSales = sales.filter(s => s.id !== id);
      setSales(newSales);
      storage.set('fertilizer_sales', newSales);
    }
  };
  
  const deleteStock = (id) => {
    if (confirm('Delete this stock item?')) {
      const newStock = stock.filter(s => s.id !== id);
      setStock(newStock);
      storage.set('fertilizer_stock', newStock);
    }
  };
  
  // Calculate analytics
  const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.totalPrice) || 0), 0);
  const totalStockValue = stock.reduce((sum, s) => sum + (s.quantity * s.price), 0);
  const lowStockItems = stock.filter(s => s.quantity < (s.minStock || 10));
  const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
  
  // Get customers
  const getCustomers = () => {
    const customersMap = {};
    sales.forEach(sale => {
      const key = sale.customerPhone || sale.customerName;
      if (!customersMap[key]) {
        customersMap[key] = { name: sale.customerName, phone: sale.customerPhone, address: sale.customerAddress, totalPurchases: 0, totalAmount: 0, lastPurchase: sale.saleDate };
      }
      customersMap[key].totalPurchases += 1;
      customersMap[key].totalAmount += parseFloat(sale.totalPrice) || 0;
      if (new Date(sale.saleDate) > new Date(customersMap[key].lastPurchase)) {
        customersMap[key].lastPurchase = sale.saleDate;
      }
    });
    return Object.values(customersMap).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
    { id: 'sales', label: 'New Sale', icon: <Icons.Sales /> },
    { id: 'stock', label: 'Stock', icon: <Icons.Stock /> },
    { id: 'history', label: 'History', icon: <Icons.History /> },
    { id: 'analysis', label: 'Analytics', icon: <Icons.Analysis /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-green-700 to-green-900 text-white transition-all duration-300 fixed h-full z-50`}>
        <div className="p-4 border-b border-green-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            {sidebarOpen && <h1 className="font-bold text-lg">Fertilizer Manager</h1>}
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white text-green-700 shadow-lg' : 'hover:bg-green-600'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute bottom-4 right-4 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition">
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{navItems.find(n => n.id === activeTab)?.label}</h2>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-4">
              {lowStockItems.length > 0 && (
                <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
                  <Icons.Warning />
                  <span className="font-medium">{lowStockItems.length} Low Stock Items</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              sales={sales} 
              stock={stock} 
              totalRevenue={totalRevenue} 
              totalStockValue={totalStockValue}
              lowStockItems={lowStockItems}
              onNavigate={setActiveTab}
            />
          )}

          {/* Sales Form */}
          {activeTab === 'sales' && (
            <SalesFormView stock={stock} onSave={saveSale} onNavigate={setActiveTab} />
          )}

          {/* Stock Management */}
          {activeTab === 'stock' && (
            <StockView stock={stock} onSave={saveStock} onDelete={deleteStock} />
          )}

          {/* History */}
          {activeTab === 'history' && (
            <HistoryView sales={sales} customers={getCustomers()} onDeleteSale={deleteSale} />
          )}

          {/* Analytics */}
          {activeTab === 'analysis' && (
            <AnalyticsView sales={sales} stock={stock} customers={getCustomers()} />
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard View
function DashboardView({ sales, stock, totalRevenue, totalStockValue, lowStockItems, onNavigate }) {
  const recentSales = [...sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  
  // Chart data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toDateString();
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    const daySales = sales.filter(s => new Date(s.saleDate).toDateString() === dayStr);
    const revenue = daySales.reduce((sum, s) => sum + (parseFloat(s.totalPrice) || 0), 0);
    last7Days.push({ name: dayLabel, revenue, sales: daySales.length });
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon="💰" color="#22c55e" />
        <StatCard title="Total Sales" value={sales.length} subtitle="transactions" icon="🛒" color="#3b82f6" />
        <StatCard title="Stock Value" value={formatCurrency(totalStockValue)} icon="📦" color="#f59e0b" />
        <StatCard title="Products" value={stock.length} subtitle="in inventory" icon="🌱" color="#8b5cf6" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Last 7 Days Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-orange-700 mb-4">⚠️ Low Stock Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <p className="text-orange-600 font-bold">{item.quantity} {item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => onNavigate('sales')} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
              🛒 New Sale
            </button>
            <button onClick={() => onNavigate('stock')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              📦 Add Stock
            </button>
            <button onClick={() => onNavigate('history')} className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
              📋 View History
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🕒 Recent Sales</h3>
          {recentSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>No sales yet. Start by making your first sale!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      🌱
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{sale.fertilizerName}</p>
                      <p className="text-xs text-gray-500">{sale.customerName} • {formatDate(sale.saleDate)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(sale.totalPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sales Form View
function SalesFormView({ stock, onSave, onNavigate }) {
  const [form, setForm] = useState({
    fertilizerName: '', fertilizerId: '', price: '', quantity: '', unit: 'kg',
    howToUse: '', saleDate: new Date().toISOString().split('T')[0],
    customerName: '', customerPhone: '', customerEmail: '', customerAddress: '',
    paymentMethod: 'Cash', notes: ''
  });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const total = (parseFloat(form.price) || 0) * (parseFloat(form.quantity) || 0);
  const units = ['kg', 'g', 'L', 'mL', 'bags', 'packets'];
  const payments = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Credit'];

  const selectFertilizer = (item) => {
    setSelectedItem(item);
    setForm(f => ({ ...f, fertilizerName: item.name, fertilizerId: item.id, price: item.price?.toString(), unit: item.unit, howToUse: item.howToUse || '' }));
    setShowPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fertilizerName || !form.price || !form.quantity || !form.customerName || !form.customerPhone) {
      alert('Please fill all required fields');
      return;
    }
    if (selectedItem && parseFloat(form.quantity) > selectedItem.quantity) {
      alert(`Insufficient stock! Only ${selectedItem.quantity} ${selectedItem.unit} available.`);
      return;
    }
    onSave({ ...form, totalPrice: total.toFixed(2) });
    alert('Sale recorded successfully!');
    setForm({
      fertilizerName: '', fertilizerId: '', price: '', quantity: '', unit: 'kg',
      howToUse: '', saleDate: new Date().toISOString().split('T')[0],
      customerName: '', customerPhone: '', customerEmail: '', customerAddress: '',
      paymentMethod: 'Cash', notes: ''
    });
    setSelectedItem(null);
    onNavigate('dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Fertilizer Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-green-700 mb-4 pb-2 border-b">🌱 Fertilizer Details</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Fertilizer *</label>
          <div onClick={() => setShowPicker(!showPicker)} className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-green-500 transition flex justify-between items-center">
            <span className={form.fertilizerName ? 'text-gray-800 font-medium' : 'text-gray-400'}>
              {form.fertilizerName || 'Select from stock...'}
            </span>
            <span className="text-gray-400">{showPicker ? '▲' : '▼'}</span>
          </div>
          {showPicker && (
            <div className="border-2 border-gray-200 rounded-xl mt-2 max-h-60 overflow-y-auto">
              {stock.length === 0 ? (
                <p className="p-4 text-center text-gray-500">No stock available. Add stock first.</p>
              ) : (
                stock.map((item, i) => (
                  <div key={i} onClick={() => selectFertilizer(item)} className="p-4 border-b hover:bg-green-50 cursor-pointer transition">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Stock: {item.quantity} {item.unit} | ₹{item.price}/{item.unit}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
            <input type="number" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" placeholder="0" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
          <div className="flex flex-wrap gap-2">
            {units.map(unit => (
              <button key={unit} type="button" onClick={() => setForm(f => ({...f, unit}))}
                className={`px-4 py-2 rounded-full font-medium transition ${form.unit === unit ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {unit}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">How to Use</label>
          <textarea value={form.howToUse} onChange={e => setForm(f => ({...f, howToUse: e.target.value}))}
            className="w-full border-2 border-gray-200 rounded-xl p-3 h-24 focus:border-green-500 focus:outline-none transition" placeholder="Usage instructions, dosage, application method..." />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Date</label>
          <input type="date" value={form.saleDate} onChange={e => setForm(f => ({...f, saleDate: e.target.value}))}
            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" />
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-green-700 mb-4 pb-2 border-b">👤 Customer Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
            <input type="text" value={form.customerName} onChange={e => setForm(f => ({...f, customerName: e.target.value}))}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" placeholder="Enter name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
            <input type="tel" value={form.customerPhone} onChange={e => setForm(f => ({...f, customerPhone: e.target.value}))}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" placeholder="Enter phone" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input type="email" value={form.customerEmail} onChange={e => setForm(f => ({...f, customerEmail: e.target.value}))}
            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none transition" placeholder="Enter email" />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea value={form.customerAddress} onChange={e => setForm(f => ({...f, customerAddress: e.target.value}))}
            className="w-full border-2 border-gray-200 rounded-xl p-3 h-20 focus:border-green-500 focus:outline-none transition" placeholder="Enter complete address" />
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-green-700 mb-4 pb-2 border-b">💳 Payment Details</h3>
        
        <div className="flex flex-wrap gap-2">
          {payments.map(method => (
            <button key={method} type="button" onClick={() => setForm(f => ({...f, paymentMethod: method}))}
              className={`px-4 py-2 rounded-full font-medium transition ${form.paymentMethod === method ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {method}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            className="w-full border-2 border-gray-200 rounded-xl p-3 h-16 focus:border-green-500 focus:outline-none transition" placeholder="Additional notes..." />
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <span className="text-lg">Total Amount</span>
          <span className="text-4xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition transform hover:scale-[1.02]">
        💾 Save Sale
      </button>
    </form>
  );
}

// Stock View
function StockView({ stock, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(true);
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '', unit: 'kg', minStock: '10', supplier: '', howToUse: '' });

  const categories = ['Nitrogen Fertilizer', 'Phosphorus Fertilizer', 'Potassium Fertilizer', 'NPK Compound', 'Organic', 'Bio-fertilizer', 'Micronutrients', 'Other'];
  const units = ['kg', 'g', 'L', 'mL', 'bags', 'packets', 'tons'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.quantity) {
      alert('Please fill required fields');
      return;
    }
    onSave({ ...form, minStock: parseFloat(form.minStock) || 10 });
    alert('Stock saved successfully!');
    setForm({ name: '', category: '', price: '', quantity: '', unit: 'kg', minStock: '10', supplier: '', howToUse: '' });
  };

  const totalValue = stock.reduce((sum, s) => sum + (s.quantity * s.price), 0);
  const totalQty = stock.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      <div className="flex gap-4">
        <button onClick={() => setShowForm(true)} className={`flex-1 py-3 rounded-xl font-semibold transition ${showForm ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          ➕ Add Stock
        </button>
        <button onClick={() => setShowForm(false)} className={`flex-1 py-3 rounded-xl font-semibold transition ${!showForm ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          📦 View Stock ({stock.length})
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-green-700 mb-4 pb-2 border-b">📦 New Stock Entry</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fertilizer Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none" placeholder="Enter name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} type="button" onClick={() => setForm(f => ({...f, category: cat}))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${form.category === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                <input type="number" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:outline-none" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
              <div className="flex flex-wrap gap-2">
                {units.map(unit => (
                  <button key={unit} type="button" onClick={() => setForm(f => ({...f, unit}))}
                    className={`px-4 py-2 rounded-full font-medium transition ${form.unit === unit ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">How to Use / Application</label>
              <textarea value={form.howToUse} onChange={e => setForm(f => ({...f, howToUse: e.target.value}))}
                className="w-full border-2 border-gray-200 rounded-xl p-3 h-24 focus:border-green-500 focus:outline-none" placeholder="Usage instructions, dosage per acre..." />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition">
              💾 Save Stock
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{stock.length}</p>
                <p className="text-green-200">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{totalQty.toFixed(0)}</p>
                <p className="text-green-200">Total Units</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-green-200">Total Value</p>
              </div>
            </div>
          </div>

          {/* Stock Grid */}
          {stock.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <p className="text-6xl mb-4">📭</p>
              <p className="text-xl text-gray-600 font-medium">No stock items yet</p>
              <p className="text-gray-400 mt-2">Add your first product to get started</p>
              <button onClick={() => setShowForm(true)} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                + Add First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stock.map((item, i) => (
                <StockItemCard key={i} item={item} onDelete={onDelete} onAddStock={() => {
                  setForm({ ...form, name: item.name, price: item.price.toString(), unit: item.unit, category: item.category });
                  setShowForm(true);
                }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// History View
function HistoryView({ sales, customers, onDeleteSale }) {
  const [activeTab, setActiveTab] = useState('sales');
  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  const filterByPeriod = (items) => {
    const now = new Date();
    switch (filterPeriod) {
      case 'today': return items.filter(s => new Date(s.saleDate).toDateString() === now.toDateString());
      case 'week': const weekAgo = new Date(now.setDate(now.getDate() - 7)); return items.filter(s => new Date(s.saleDate) >= weekAgo);
      case 'month': const monthAgo = new Date(now.setMonth(now.getMonth() - 1)); return items.filter(s => new Date(s.saleDate) >= monthAgo);
      default: return items;
    }
  };

  const filteredSales = filterByPeriod(sales).filter(s =>
    s.fertilizerName?.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const totalRevenue = filteredSales.reduce((sum, s) => sum + (parseFloat(s.totalPrice) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4">
        <button onClick={() => setActiveTab('sales')} className={`flex-1 py-3 rounded-xl font-semibold transition ${activeTab === 'sales' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600'}`}>
          🛒 Sales ({sales.length})
        </button>
        <button onClick={() => setActiveTab('customers')} className={`flex-1 py-3 rounded-xl font-semibold transition ${activeTab === 'customers' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600'}`}>
          👥 Customers ({customers.length})
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
        <span className="text-gray-400">🔍</span>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none" placeholder={activeTab === 'sales' ? 'Search sales...' : 'Search customers...'} />
        {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">✕</button>}
      </div>

      {/* Period Filter */}
      {activeTab === 'sales' && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[{ key: 'all', label: 'All Time' }, { key: 'today', label: 'Today' }, { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' }].map(f => (
            <button key={f.key} onClick={() => setFilterPeriod(f.key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${filterPeriod === f.key ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Summary */}
      {activeTab === 'sales' && filteredSales.length > 0 && (
        <div className="bg-green-50 rounded-xl p-4 flex justify-around">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{filteredSales.length}</p>
            <p className="text-sm text-gray-500">Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'sales' ? (
        filteredSales.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-xl text-gray-600">No sales found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSales.map((sale, i) => <SaleCard key={i} sale={sale} onDelete={onDeleteSale} />)}
          </div>
        )
      ) : (
        filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <p className="text-6xl mb-4">👥</p>
            <p className="text-xl text-gray-600">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, i) => <CustomerCard key={i} customer={customer} />)}
          </div>
        )
      )}
    </div>
  );
}

// Analytics View
function AnalyticsView({ sales, stock, customers }) {
  const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.totalPrice) || 0), 0);
  const totalStockValue = stock.reduce((sum, s) => sum + (s.quantity * s.price), 0);
  const avgOrder = sales.length > 0 ? totalRevenue / sales.length : 0;
  const avgCustomerValue = customers.length > 0 ? totalRevenue / customers.length : 0;

  // Payment stats
  const paymentStats = sales.reduce((acc, s) => {
    acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + parseFloat(s.totalPrice || 0);
    return acc;
  }, {});
  const paymentData = Object.entries(paymentStats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Top products
  const productStats = sales.reduce((acc, s) => {
    if (!acc[s.fertilizerName]) acc[s.fertilizerName] = { count: 0, revenue: 0, quantity: 0 };
    acc[s.fertilizerName].count++;
    acc[s.fertilizerName].revenue += parseFloat(s.totalPrice || 0);
    acc[s.fertilizerName].quantity += parseFloat(s.quantity || 0);
    return acc;
  }, {});
  const topProducts = Object.entries(productStats).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Monthly data
  const monthlyData = sales.reduce((acc, s) => {
    const month = new Date(s.saleDate).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { name: month, revenue: 0, sales: 0 };
    acc[month].revenue += parseFloat(s.totalPrice || 0);
    acc[month].sales += 1;
    return acc;
  }, {});
  const monthlyChartData = Object.values(monthlyData);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon="💰" color="#22c55e" />
        <StatCard title="Total Sales" value={sales.length} icon="🛒" color="#3b82f6" />
        <StatCard title="Avg Order Value" value={formatCurrency(avgOrder)} icon="📊" color="#f59e0b" />
        <StatCard title="Customer LTV" value={formatCurrency(avgCustomerValue)} icon="👥" color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Methods</h3>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No payment data available</div>
          )}
        </div>
      </div>

      {/* Top Products & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Top Selling Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.count} sales • {product.quantity} units</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No sales data yet</div>
          )}
        </div>

        {/* Stock Analysis */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📦 Stock Analysis</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-700">{stock.length}</p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalStockValue)}</p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>
          
          {stock.filter(s => s.quantity < 10).length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-semibold text-orange-700 mb-2">⚠️ Low Stock Items</h4>
              {stock.filter(s => s.quantity < 10).map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-orange-100 last:border-0">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-bold text-orange-600">{item.quantity} {item.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Customer Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-800">{customers.length > 0 ? (sales.length / customers.length).toFixed(1) : '0'}</p>
            <p className="text-sm text-gray-500">Avg Orders/Customer</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(avgCustomerValue)}</p>
            <p className="text-sm text-gray-500">Avg Spending</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-800">{customers.filter(c => c.totalPurchases > 1).length}</p>
            <p className="text-sm text-gray-500">Repeat Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
