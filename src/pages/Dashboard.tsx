import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, ShoppingBag, User, Award, Tag, Trash2, Plus, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, token, logout, addAddress, deleteAddress, apiUrl } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'coupons'>('orders');
  
  // Tab-specific states
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address Form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [addressError, setAddressError] = useState('');

  // Fetch orders
  const fetchMyOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const response = await fetch(`${apiUrl}/orders/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab, token]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');

    if (!fullName || !phone || !streetAddress || !pincode) {
      setAddressError('Please fill in all address fields.');
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setAddressError('Please enter a valid 6-digit India pincode.');
      return;
    }

    const success = await addAddress({
      fullName,
      phone,
      streetAddress,
      city,
      pincode,
      state
    });

    if (success) {
      setShowAddressForm(false);
      setFullName('');
      setPhone('');
      setStreetAddress('');
      setCity('');
      setPincode('');
      setState('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
      case 'out_for_delivery': return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
      default: return 'text-luxury-cream/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-luxury-black pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-luxury-charcoal rounded-2xl border border-white/5 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold block">
              WELCOME BACK,
            </span>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-luxury-cream tracking-wide">
              {user?.fullName || 'Connoisseur'}
            </h1>
            <p className="text-[10px] text-luxury-cream/45 uppercase tracking-widest">{user?.email}</p>
          </div>

          {/* Reward Points */}
          <div className="flex items-center space-x-3 bg-luxury-black/40 rounded-xl border border-white/5 p-3 sm:p-4 self-stretch md:self-auto">
            <Award className="text-luxury-gold" size={20} />
            <div>
              <span className="text-[9px] text-luxury-cream/55 uppercase tracking-widest block">Reward Points</span>
              <span className="text-base sm:text-lg font-bold text-luxury-gold font-sans">
                {user?.rewardPoints ?? user?.reward_points ?? 0} PTS
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Tab Navigation Menu */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 overflow-x-auto flex-nowrap lg:flex-wrap pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {[
              { id: 'orders', label: 'My Orders', icon: ShoppingBag },
              { id: 'addresses', label: 'Addresses', icon: MapPin },
              { id: 'coupons', label: 'Active Coupons', icon: Tag },
              { id: 'profile', label: 'Account Profile', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs rounded-full uppercase tracking-widest transition-all font-semibold whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-luxury-gold text-luxury-black font-bold'
                      : 'text-luxury-cream/65 hover:text-luxury-gold hover:bg-luxury-charcoal/30'
                  }`}
                >
                  <Icon size={12} className="lg:hidden" />
                  <Icon size={14} className="hidden lg:block" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 text-[10px] lg:text-xs uppercase tracking-widest text-red-400 hover:bg-red-950/10 transition-all font-semibold border-t border-white/5 mt-0 lg:mt-4 whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>

          {/* Tab Contents */}
          <div className="lg:col-span-9 bg-luxury-charcoal/30 rounded-2xl border border-white/5 p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px]">
            
            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg sm:text-xl tracking-wide border-b border-white/5 pb-4">Order History</h2>
                
                {loadingOrders ? (
                  <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-cream/40">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center text-xs uppercase tracking-widest text-luxury-cream/40">
                    No orders placed under this account yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-white/5 bg-luxury-charcoal/50 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-luxury-cream/50">
                          <div>
                            <span>Order: </span>
                            <span className="text-luxury-gold font-bold font-mono">{order.orderNumber || order.order_number}</span>
                          </div>
                          <span>Placed: {new Date(order.createdAt || order.created_at).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 border ${getStatusColor(order.status)} font-semibold text-[8px]`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order items */}
                        <div className="space-y-2 sm:space-y-3">
                          {order.items && JSON.parse(typeof order.items === 'string' ? order.items : JSON.stringify(order.items)).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] sm:text-xs gap-2">
                              <span className="text-luxury-cream/80 truncate">{item.name} x {item.quantity}</span>
                              <span className="text-luxury-cream font-medium whitespace-nowrap">INR {item.price.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[11px] sm:text-xs">
                          <span className="uppercase tracking-widest text-luxury-cream/40">Total</span>
                          <span className="text-luxury-gold font-bold">INR {parseFloat(order.totalAmount || order.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-3">
                  <h2 className="font-serif text-lg sm:text-xl tracking-wide">Shipping Addresses</h2>
                  <button
                    onClick={() => { setShowAddressForm(!showAddressForm); setAddressError(''); }}
                    className="flex items-center justify-center space-x-1.5 text-[10px] uppercase tracking-widest text-luxury-gold border border-luxury-gold/50 py-2 sm:py-1.5 px-3 hover:bg-luxury-gold hover:text-luxury-black transition-all font-semibold self-start sm:self-auto"
                  >
                    <Plus size={10} />
                    <span>New Address</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-luxury-charcoal/50 border border-luxury-gold/20 rounded-xl p-4 sm:p-6 space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">New Shipping Address</h3>
                    
                    {addressError && (
                      <div className="bg-red-950/20 border border-red-500/20 text-red-300 text-[10px] p-3 flex items-start space-x-1.5 uppercase tracking-wider">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{addressError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Street Address</label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter city"
                          className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g. 560001"
                          className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">State</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Enter state"
                          className="w-full bg-luxury-black border border-white/10 px-3 py-2 sm:py-1.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                      <button type="submit" className="btn-gold text-[10px] py-2.5 sm:py-2 px-6 w-full sm:w-auto">
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="border border-white/10 text-luxury-cream px-6 py-2.5 sm:py-2 text-[10px] uppercase tracking-widest font-semibold hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* List saved addresses */}
                {(!user?.addresses || user.addresses.length === 0) ? (
                  <p className="text-xs text-luxury-cream/45 uppercase tracking-widest py-8 text-center">No addresses saved. Please add one above for checkout convenience.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {user.addresses.map((addr: any) => (
                      <div key={addr.id} className="border border-white/5 bg-luxury-charcoal/20 rounded-xl p-4 space-y-2 relative flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-luxury-cream uppercase tracking-wide">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[7.5px] uppercase tracking-widest bg-luxury-gold/15 text-luxury-gold px-1.5 py-0.5 border border-luxury-gold/20 font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-luxury-cream/60 leading-relaxed font-light mt-2 uppercase tracking-wide">
                            {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-[11px] text-luxury-cream/45 font-mono mt-1">{addr.phone}</p>
                        </div>
                        <div className="flex justify-end pt-4 border-t border-white/5 mt-4">
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-luxury-cream/40 hover:text-red-400 p-1 flex items-center space-x-1 text-[9px] uppercase tracking-widest transition-colors font-semibold"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Coupons */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg sm:text-xl tracking-wide border-b border-white/5 pb-4">Available Promo Offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { code: 'WELCOME10', reward: '10% OFF orders over 5k', details: 'Perfect for first reserve selections.' },
                    { code: 'HYDOUD', reward: 'INR 1,500 OFF orders over 10k', details: 'Special discount celebrating our launch across India.' },
                    { code: 'JASMINE5', reward: '5% OFF orders over 2k', details: 'Applicable to any perfume absolute.' }
                  ].map((cop) => (
                    <div key={cop.code} className="border border-dashed border-luxury-gold/30 rounded-xl p-4 sm:p-6 space-y-3 bg-luxury-charcoal/20">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm font-bold text-luxury-gold tracking-widest bg-luxury-gold/5 px-2.5 py-1 border border-luxury-gold/20 select-all">
                          {cop.code}
                        </span>
                        <span className="text-[8px] uppercase tracking-widest text-green-400 font-semibold bg-green-400/5 px-1.5 py-0.5 border border-green-500/10">Active</span>
                      </div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-luxury-cream">{cop.reward}</h4>
                      <p className="text-[10px] text-luxury-cream/50 leading-relaxed font-light">{cop.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif text-lg sm:text-xl tracking-wide border-b border-white/5 pb-4">Account Profile</h2>
                <div className="space-y-4 max-w-full sm:max-w-md">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-cream/45 block mb-1">Email Address</span>
                    <span className="text-xs font-semibold text-luxury-cream block bg-luxury-black/30 rounded-lg border border-white/5 px-3 py-2">{user?.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-cream/45 block mb-1">Account Role</span>
                    <span className="text-xs font-semibold text-luxury-gold uppercase tracking-wider block bg-luxury-black/30 rounded-lg border border-white/5 px-3 py-2">{user?.role}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-cream/45 block mb-1">Total Points Balance</span>
                    <span className="text-xs font-semibold text-luxury-cream block bg-luxury-black/30 rounded-lg border border-white/5 px-3 py-2">{user?.rewardPoints ?? user?.reward_points ?? 0} Reward Points</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
