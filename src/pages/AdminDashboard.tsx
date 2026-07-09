import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Truck, Users, Tag, Settings, FileText,
  Plus, Trash2, Edit2, AlertCircle, TrendingUp, Package, DollarSign,
  UserCheck, BarChart3, Camera, X, ChevronDown, Eye, Search,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';

type Panel = 'stats' | 'products' | 'orders' | 'customers' | 'settings' | 'blogs';

export const AdminDashboard: React.FC = () => {
  const { token, apiUrl } = useAuth();
  const [activePanel, setActivePanel] = useState<Panel>('stats');

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: [] as any[],
    salesChart: [] as any[]
  });

  // Data lists
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Product form
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const productImageRef = useRef<HTMLInputElement>(null);
  const [productForm, setProductForm] = useState({
    id: '', name: '', category: 'Oudh', price: '', stock: '', description: '',
    fragranceStory: '', topNotes: '', middleNotes: '', baseNotes: '',
    longevity: 'Long Lasting (8-10h)', projection: 'Strong', season: 'All Seasons',
    occasion: 'Signature', gender: 'Unisex', ingredients: '', images: ''
  });

  // Settings
  const [settingsForm, setSettingsForm] = useState({
    bannerText: '', contactEmail: '', contactPhone: '', contactAddress: '',
    instagram: '', facebook: '', twitter: '', youtube: '', tiktok: '', pinterest: ''
  });

  // Blog
  const [blogForm, setBlogForm] = useState({
    title: '', summary: '', content: '', coverImage: '', author: 'Creative Director'
  });
  const [blogImagePreview, setBlogImagePreview] = useState<string | null>(null);
  const blogImageRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // =================== DATA FETCHING ===================
  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/products?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json() || []);
    } catch (err) { console.error(err); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCustomers(await res.json() || []);
    } catch (err) { console.error(err); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${apiUrl}/blogs`);
      if (res.ok) setBlogs(await res.json() || []);
    } catch (err) { console.error(err); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiUrl}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettingsForm({
          bannerText: data.bannerText || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          contactAddress: data.contactAddress || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          youtube: data.youtube || '',
          tiktok: data.tiktok || '',
          pinterest: data.pinterest || ''
        });
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token) return;
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchBlogs();
    fetchSettings();
  }, [token, activePanel]);

  // =================== PRODUCT HANDLERS ===================
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Image must be under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProductImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedPayload = {
      ...productForm,
      topNotes: productForm.topNotes.split(',').map(n => n.trim()).filter(Boolean),
      middleNotes: productForm.middleNotes.split(',').map(n => n.trim()).filter(Boolean),
      baseNotes: productForm.baseNotes.split(',').map(n => n.trim()).filter(Boolean),
      images: productForm.images ? productForm.images.split(',').map(n => n.trim()).filter(Boolean) : []
    };

    const endpoint = isEditingProduct
      ? `${apiUrl}/admin/products/${productForm.id}`
      : `${apiUrl}/admin/products`;

    try {
      const res = await fetch(endpoint, {
        method: isEditingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedPayload)
      });

      if (res.ok) {
        setMessage(isEditingProduct ? 'Fragrance updated.' : 'Fragrance created.');
        resetProductForm();
        fetchProducts();
      } else {
        const err = await res.json();
        setMessage(err.message || 'Error processing product.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const removeProductImage = () => {
    setProductImagePreview(null);
    if (productImageRef.current) productImageRef.current.value = '';
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    removeProductImage();
    setProductForm({
      id: '', name: '', category: 'Oudh', price: '', stock: '', description: '',
      fragranceStory: '', topNotes: '', middleNotes: '', baseNotes: '',
      longevity: 'Long Lasting (8-10h)', projection: 'Strong', season: 'All Seasons',
      occasion: 'Signature', gender: 'Unisex', ingredients: '', images: ''
    });
  };

  const startEditProduct = (prod: any) => {
    setProductForm({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      description: prod.description,
      fragranceStory: prod.fragrance_story || prod.fragranceStory || '',
      topNotes: (prod.top_notes || []).join(', '),
      middleNotes: (prod.middle_notes || []).join(', '),
      baseNotes: (prod.base_notes || []).join(', '),
      longevity: prod.longevity || 'Long Lasting (8-10h)',
      projection: prod.projection || 'Strong',
      season: prod.season || 'All Seasons',
      occasion: prod.occasion || 'Signature',
      gender: prod.gender || 'Unisex',
      ingredients: prod.ingredients || '',
      images: (prod.images || []).join(', ')
    });
    setProductImagePreview(prod.images?.[0] || null);
    setIsEditingProduct(true);
    setMessage('');
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Permanently delete this fragrance?')) return;
    try {
      const res = await fetch(`${apiUrl}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (err) { console.error(err); }
  };

  // =================== ORDER HANDLERS ===================
  const updateDeliveryStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) { fetchOrders(); fetchStats(); }
    } catch (err) { console.error(err); }
  };

  // =================== SETTINGS & BLOG HANDLERS ===================
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) setMessage('Settings updated.');
    } catch { setMessage('Network error.'); }
    finally { setLoading(false); }
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBlogImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(blogForm)
      });
      if (res.ok) {
        setMessage('Article published.');
        setBlogForm({ title: '', summary: '', content: '', coverImage: '', author: 'Creative Director' });
        setBlogImagePreview(null);
        fetchBlogs();
      }
    } catch { setMessage('Network error.'); }
    finally { setLoading(false); }
  };

  // =================== HELPERS ===================
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'processing': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'out_for_delivery': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'cancelled': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-luxury-cream/50 border-white/10 bg-white/5';
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRevenue = (val: number) => {
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toString();
  };

  // =================== SIDEBAR ITEMS ===================
  const sidebarItems: { id: Panel; label: string; icon: any; badge?: number }[] = [
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Fragrances', icon: Package, badge: products.length },
    { id: 'orders', label: 'Orders', icon: Truck, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'customers', label: 'Customers', icon: UserCheck, badge: customers.length },
    { id: 'blogs', label: 'Blog CMS', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-luxury-gold/70">Director Panel</span>
              </div>
              <h1 className="font-serif text-3xl tracking-wide text-luxury-cream">
                Al Mashriq <span className="text-luxury-gold">Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { fetchStats(); fetchProducts(); fetchOrders(); fetchCustomers(); }}
                className="flex items-center space-x-2 border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-luxury-cream/60 hover:border-luxury-gold/30 hover:text-luxury-gold transition-all rounded-full"
              >
                <RefreshCw size={12} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="mt-4 h-[1px] bg-gradient-to-r from-luxury-gold/40 via-luxury-gold/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-2">
            <div className="bg-luxury-charcoal/30 border border-white/5 p-2 space-y-1 sticky top-28 rounded-xl">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePanel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActivePanel(item.id); setMessage(''); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-[10px] uppercase tracking-widest transition-all rounded-xl ${
                      isActive
                        ? 'bg-luxury-gold text-luxury-black font-bold'
                        : 'text-luxury-cream/50 hover:text-luxury-gold hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-luxury-black/20 text-luxury-black' : 'bg-luxury-gold/20 text-luxury-gold'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-10">
            
            {/* Status Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 bg-luxury-gold/5 border border-luxury-gold/20 text-luxury-gold text-[10px] p-3 flex items-center justify-between uppercase tracking-wider rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={14} />
                    <span>{message}</span>
                  </div>
                  <button onClick={() => setMessage('')} className="hover:text-luxury-cream">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========== STATS PANEL ========== */}
            {activePanel === 'stats' && (
              <div className="space-y-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `INR ${formatRevenue(stats.totalRevenue)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: '+12%' },
                    { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+8%' },
                    { label: 'Products', value: stats.totalProducts || 0, icon: Package, color: 'text-luxury-gold', bg: 'bg-luxury-gold/10', change: '' },
                    { label: 'Customers', value: stats.totalCustomers || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', change: '+5%' },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-luxury-charcoal/30 border border-white/5 p-5 hover:border-white/10 transition-colors rounded-2xl"
                      >
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 ${card.bg} flex items-center justify-center rounded-xl`}>
                            <Icon size={18} className={card.color} />
                          </div>
                          {card.change && (
                            <span className="flex items-center text-[9px] text-emerald-400 font-semibold">
                              <ArrowUpRight size={10} />
                              {card.change}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 space-y-1">
                          <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">{card.label}</span>
                          <p className="text-2xl font-bold text-luxury-cream font-sans">{card.value}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Revenue Chart */}
                <div className="bg-luxury-charcoal/30 border border-white/5 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-serif text-lg text-luxury-cream">Revenue Overview</h3>
                      <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">Last 7 days performance</span>
                    </div>
                    <TrendingUp size={18} className="text-luxury-gold/50" />
                  </div>
                  
                  {stats.salesChart && stats.salesChart.length > 0 ? (
                    <div className="h-48 flex items-end justify-between px-2 gap-2 border-b border-white/10 pb-2">
                      {stats.salesChart.map((day: any, idx: number) => {
                        const maxVal = Math.max(...stats.salesChart.map((d: any) => d.revenue), 1);
                        const heightPct = Math.max(4, (day.revenue / maxVal) * 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                            <div className="text-[8px] text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                              {formatRevenue(day.revenue)}
                            </div>
                            <div className="w-full max-w-8 bg-gradient-to-t from-luxury-gold/60 to-luxury-gold group-hover:from-luxury-gold group-hover:to-luxury-goldLight transition-all rounded-t-xl" style={{ height: `${heightPct}%` }} />
                            <span className="text-[7px] text-luxury-cream/40 uppercase mt-2 whitespace-nowrap">{day.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-[10px] uppercase tracking-widest text-luxury-cream/30 border border-dashed border-white/10 rounded-2xl">
                      No sales data yet
                    </div>
                  )}
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-luxury-charcoal/30 border border-white/5 p-6 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle size={16} className="text-amber-400" />
                    <h3 className="font-serif text-lg text-luxury-cream">Stock Alerts</h3>
                  </div>
                  {stats.lowStock && stats.lowStock.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stats.lowStock.map((prod: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-luxury-black/30 border border-white/5 rounded-xl">
                          <div>
                            <span className="text-xs text-luxury-cream font-serif block">{prod.name}</span>
                            <span className="text-[8px] uppercase tracking-widest text-luxury-cream/40">{prod.category}</span>
                          </div>
                          <span className="text-xs font-bold font-mono text-red-400">{prod.stock} left</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[10px] uppercase tracking-widest text-luxury-cream/30 border border-dashed border-white/10 rounded-xl">
                      All stocks healthy
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== PRODUCTS PANEL ========== */}
            {activePanel === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl text-luxury-cream">Fragrance Collection</h2>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">{products.length} products in catalog</span>
                  </div>
                  {!isEditingProduct ? (
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-cream/30" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-luxury-black/50 border border-white/10 pl-8 pr-3 py-2 text-[10px] uppercase tracking-widest text-luxury-cream focus:border-luxury-gold focus:outline-none w-48"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setIsEditingProduct(true);
                          setProductImagePreview(null);
                          setProductForm({
                            id: '', name: '', category: 'Oudh', price: '', stock: '', description: '',
                            fragranceStory: '', topNotes: '', middleNotes: '', baseNotes: '',
                            longevity: 'Long Lasting (8-10h)', projection: 'Strong', season: 'All Seasons',
                            occasion: 'Signature', gender: 'Unisex', ingredients: '', images: ''
                          });
                        }}
                        className="btn-gold text-[10px] py-2 px-4 flex items-center space-x-1.5"
                      >
                        <Plus size={12} />
                        <span>Add New</span>
                      </button>
                    </div>
                  ) : null}
                </div>

                {isEditingProduct ? (
                  <form onSubmit={handleProductSubmit} className="bg-luxury-charcoal/20 border border-white/5 p-6 space-y-6 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="font-serif text-lg text-luxury-gold">
                        {isEditingProduct && productForm.id ? 'Edit Fragrance' : 'New Fragrance'}
                      </h3>
                      <button type="button" onClick={resetProductForm} className="text-[10px] uppercase tracking-widest text-luxury-cream/40 hover:text-luxury-cream">
                        Cancel
                      </button>
                    </div>

                    {/* Product Image Upload - Big Prominent Area */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Product Image</label>
                      <input
                        ref={productImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => productImageRef.current?.click()}
                        className={`w-full border-2 border-dashed transition-all group rounded-2xl ${
                          productImagePreview
                            ? 'border-luxury-gold/30 bg-luxury-black/20'
                            : 'border-white/10 hover:border-luxury-gold/40 bg-luxury-black/30'
                        }`}
                      >
                        {productImagePreview ? (
                          <div className="relative">
                            <img src={productImagePreview} alt="Product preview" className="w-full h-56 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                              <Camera size={24} className="text-luxury-gold" />
                              <span className="text-[10px] uppercase tracking-widest text-luxury-gold">Change Image</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeProductImage(); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors">
                              <Camera size={24} className="text-luxury-gold/50 group-hover:text-luxury-gold transition-colors" />
                            </div>
                            <div className="text-center space-y-1">
                              <span className="text-xs uppercase tracking-widest text-luxury-cream/60 block">Click to upload product image</span>
                              <span className="text-[9px] uppercase tracking-wider text-luxury-cream/30">JPG, PNG or WEBP (max 10MB)</span>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Name, Price, Stock Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Product Name</label>
                        <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="e.g. Oudh Royale" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider placeholder-luxury-cream/20" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Price (INR)</label>
                        <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} placeholder="12500" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Stock Quantity</label>
                        <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} placeholder="50" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Category</label>
                        <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider">
                          <option value="Oudh">Oudh</option>
                          <option value="Woody">Woody</option>
                          <option value="Jasmine">Jasmine</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Gender</label>
                        <select value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider">
                          <option value="Unisex">Unisex</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Image URLs (comma sep)</label>
                        <input type="text" value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} placeholder="https://..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Description</label>
                      <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream tracking-wide h-16 focus:border-luxury-gold focus:outline-none" required />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Fragrance Story</label>
                      <textarea value={productForm.fragranceStory} onChange={e => setProductForm({...productForm, fragranceStory: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream tracking-wide h-16 focus:border-luxury-gold focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Top Notes</label>
                        <input type="text" value={productForm.topNotes} onChange={e => setProductForm({...productForm, topNotes: e.target.value})} placeholder="Saffron, Bergamot" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Heart Notes</label>
                        <input type="text" value={productForm.middleNotes} onChange={e => setProductForm({...productForm, middleNotes: e.target.value})} placeholder="Rose, Leather" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Base Notes</label>
                        <input type="text" value={productForm.baseNotes} onChange={e => setProductForm({...productForm, baseNotes: e.target.value})} placeholder="Oudh, Sandalwood" className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={loading} className="btn-gold text-[10px] py-2.5 px-6 font-semibold">
                        {loading ? 'Saving...' : 'Save Fragrance'}
                      </button>
                      <button type="button" onClick={resetProductForm} className="border border-white/10 text-luxury-cream/60 px-6 py-2 text-[10px] uppercase tracking-widest hover:border-luxury-gold hover:text-luxury-gold transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-luxury-charcoal/20 border border-white/5 overflow-hidden rounded-2xl">
                    <table className="w-full text-left text-[10px] uppercase tracking-wider">
                      <thead className="bg-luxury-black/50 text-luxury-gold/80">
                        <tr>
                          <th className="p-4 font-semibold">Product</th>
                          <th className="p-4 font-semibold">Category</th>
                          <th className="p-4 font-semibold">Price</th>
                          <th className="p-4 font-semibold">Stock</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-12 bg-luxury-black/30 border border-white/5 overflow-hidden shrink-0 rounded-lg">
                                  <img src={p.images?.[0] || '/logo.jpg'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-serif text-xs text-luxury-cream font-semibold line-clamp-1">{p.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-luxury-cream/50">{p.category}</td>
                            <td className="p-4 text-luxury-cream/70 font-mono">INR {parseFloat(p.price).toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`font-mono ${p.stock < 10 ? 'text-red-400 font-bold' : 'text-luxury-cream/60'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <button onClick={() => startEditProduct(p)} className="p-1.5 text-luxury-cream/40 hover:text-luxury-gold transition-colors" title="Edit">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => deleteProduct(p.id)} className="p-1.5 text-luxury-cream/40 hover:text-red-400 transition-colors" title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-luxury-cream/30 uppercase tracking-widest">
                              No fragrances found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ========== ORDERS PANEL ========== */}
            {activePanel === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-luxury-cream">Order Management</h2>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">{orders.length} total orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-luxury-charcoal/20 border border-white/5 p-16 text-center rounded-2xl">
                    <Truck size={32} className="text-luxury-cream/15 mx-auto mb-4" />
                    <p className="text-xs uppercase tracking-widest text-luxury-cream/30">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(ord => (
                      <div key={ord.id} className="bg-luxury-charcoal/20 border border-white/5 p-5 space-y-4 rounded-2xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center space-x-4">
                            <span className="font-mono text-sm text-luxury-gold font-bold">{ord.orderNumber || ord.order_number}</span>
                            <span className={`px-2 py-0.5 border text-[8px] uppercase font-bold rounded-full ${getStatusColor(ord.status)}`}>
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-[9px] text-luxury-cream/35 uppercase">
                            {new Date(ord.createdAt || ord.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-luxury-gold/60 block mb-1">Customer</span>
                            <p className="text-luxury-cream font-serif">{ord.fullName || ord.full_name}</p>
                            <p className="text-luxury-cream/50 mt-0.5">{ord.contactNumber || ord.contact_number}</p>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-luxury-gold/60 block mb-1">Delivery Address</span>
                            <p className="text-luxury-cream/60 leading-relaxed">
                              {ord.shippingAddress?.streetAddress || 'N/A'}, {ord.shippingAddress?.city || ''} - {ord.shippingAddress?.pincode || ''}
                            </p>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-luxury-gold/60 block mb-1">Amount</span>
                            <p className="text-luxury-gold font-bold">INR {parseFloat(ord.totalAmount || ord.total_amount || 0).toLocaleString()}</p>
                            <p className="text-luxury-cream/40 mt-0.5">{ord.paymentMethod || ord.payment_method} / {ord.paymentStatus || ord.payment_status}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {ord.status === 'pending' && (
                            <button onClick={() => updateDeliveryStatus(ord.id, 'processing')} className="border border-blue-500/30 text-blue-400 bg-blue-500/5 px-3 py-1.5 text-[9px] uppercase font-semibold hover:bg-blue-500/10 transition-colors rounded-full">
                              Process
                            </button>
                          )}
                          {ord.status === 'processing' && (
                            <button onClick={() => updateDeliveryStatus(ord.id, 'out_for_delivery')} className="border border-amber-500/30 text-amber-400 bg-amber-500/5 px-3 py-1.5 text-[9px] uppercase font-semibold hover:bg-amber-500/10 transition-colors rounded-full">
                              Dispatch
                            </button>
                          )}
                          {ord.status === 'out_for_delivery' && (
                            <button onClick={() => updateDeliveryStatus(ord.id, 'delivered', 'paid')} className="border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1.5 text-[9px] uppercase font-semibold hover:bg-emerald-500/10 transition-colors rounded-full">
                              Mark Delivered
                            </button>
                          )}
                          {!['delivered', 'cancelled'].includes(ord.status) && (
                            <button onClick={() => updateDeliveryStatus(ord.id, 'cancelled', 'failed')} className="border border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1.5 text-[9px] uppercase font-semibold hover:bg-red-500/10 transition-colors rounded-full">
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========== CUSTOMERS PANEL ========== */}
            {activePanel === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-luxury-cream">Customer Directory</h2>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">{customers.length} registered members</span>
                </div>

                <div className="bg-luxury-charcoal/20 border border-white/5 overflow-hidden rounded-2xl">
                  <table className="w-full text-left text-[10px] uppercase tracking-wider">
                    <thead className="bg-luxury-black/50 text-luxury-gold/80">
                      <tr>
                        <th className="p-4 font-semibold">Member</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Points</th>
                        <th className="p-4 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {customers.map(c => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-serif text-xs text-luxury-cream font-semibold">{c.fullName || c.full_name}</td>
                          <td className="p-4 text-luxury-cream/50 font-mono">{c.email}</td>
                          <td className="p-4 text-luxury-gold font-bold">{c.rewardPoints ?? c.reward_points ?? 0}</td>
                          <td className="p-4 text-luxury-cream/40">{new Date(c.createdAt || c.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-luxury-cream/30 uppercase tracking-widest">No customers yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========== SETTINGS PANEL ========== */}
            {activePanel === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-luxury-cream">Boutique Settings</h2>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">Configure store appearance and contact info</span>
                </div>

                <form onSubmit={handleSettingsSubmit} className="bg-luxury-charcoal/20 border border-white/5 p-6 space-y-5 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Announcement Banner Text</label>
                    <input type="text" value={settingsForm.bannerText} onChange={e => setSettingsForm({...settingsForm, bannerText: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Contact Email</label>
                      <input type="email" value={settingsForm.contactEmail} onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Contact Phone</label>
                      <input type="text" value={settingsForm.contactPhone} onChange={e => setSettingsForm({...settingsForm, contactPhone: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Store Address</label>
                    <input type="text" value={settingsForm.contactAddress} onChange={e => setSettingsForm({...settingsForm, contactAddress: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider" />
                  </div>

                  {/* Social Media Links */}
                  <div className="border-t border-white/5 pt-5 space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">Social Media Links</span>
                    </div>
                    <p className="text-[9px] text-luxury-cream/30 uppercase tracking-wider">Add your brand social profiles (leave blank to hide)</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50 flex items-center space-x-1.5">
                          <span>Instagram</span>
                        </label>
                        <input type="url" value={settingsForm.instagram} onChange={e => setSettingsForm({...settingsForm, instagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Facebook</label>
                        <input type="url" value={settingsForm.facebook} onChange={e => setSettingsForm({...settingsForm, facebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Twitter / X</label>
                        <input type="url" value={settingsForm.twitter} onChange={e => setSettingsForm({...settingsForm, twitter: e.target.value})} placeholder="https://x.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">YouTube</label>
                        <input type="url" value={settingsForm.youtube} onChange={e => setSettingsForm({...settingsForm, youtube: e.target.value})} placeholder="https://youtube.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">TikTok</label>
                        <input type="url" value={settingsForm.tiktok} onChange={e => setSettingsForm({...settingsForm, tiktok: e.target.value})} placeholder="https://tiktok.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Pinterest</label>
                        <input type="url" value={settingsForm.pinterest} onChange={e => setSettingsForm({...settingsForm, pinterest: e.target.value})} placeholder="https://pinterest.com/..." className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none placeholder-luxury-cream/20" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold text-[10px] py-2.5 px-6 font-semibold">
                    {loading ? 'Saving...' : 'Update Settings'}
                  </button>
                </form>
              </div>
            )}

            {/* ========== BLOG CMS PANEL ========== */}
            {activePanel === 'blogs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-luxury-cream">Blog Publisher</h2>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">{blogs.length} published articles</span>
                </div>

                <form onSubmit={handleBlogSubmit} className="bg-luxury-charcoal/20 border border-white/5 p-6 space-y-5 rounded-2xl">
                  <div className="flex items-start space-x-6">
                    <div className="shrink-0">
                      <input ref={blogImageRef} type="file" accept="image/*" onChange={handleBlogImageUpload} className="hidden" />
                      <button type="button" onClick={() => blogImageRef.current?.click()} className="w-32 h-24 border-2 border-dashed border-white/10 hover:border-luxury-gold/30 bg-luxury-black/30 flex flex-col items-center justify-center space-y-1 transition-all rounded-xl">
                        {blogImagePreview ? (
                          <img src={blogImagePreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={16} className="text-luxury-cream/20" />
                            <span className="text-[7px] uppercase tracking-wider text-luxury-cream/30">Cover Image</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Title</label>
                        <input type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Author</label>
                        <input type="text" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Summary</label>
                    <input type="text" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Content</label>
                    <textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2 text-xs text-luxury-cream tracking-wide h-32 focus:border-luxury-gold focus:outline-none" required />
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold text-[10px] py-2.5 px-6 font-semibold">
                    {loading ? 'Publishing...' : 'Publish Article'}
                  </button>
                </form>

                {/* Published articles */}
                {blogs.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40">Published ({blogs.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {blogs.map(b => (
                        <div key={b.id} className="bg-luxury-charcoal/20 border border-white/5 p-4 flex items-start space-x-3 rounded-xl">
                          <div className="w-16 h-12 bg-luxury-black/30 border border-white/5 overflow-hidden shrink-0 rounded-lg">
                            <img src={b.coverImage || b.cover_image || '/logo.jpg'} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs text-luxury-cream font-semibold truncate">{b.title}</h4>
                            <span className="text-[8px] text-luxury-cream/35 uppercase tracking-widest">{b.author}</span>
                            <p className="text-[9px] text-luxury-cream/40 line-clamp-1 mt-1">{b.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
