import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CreditCard, ChevronRight, User, ShoppingBag, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Checkout: React.FC = () => {
  const { cart, cartSubtotal, cartTotal, appliedCoupon, discountAmount, clearCart } = useCart();
  const { isAuthenticated, user, token, apiUrl } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Telangana');

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // UPI QR Code Modal state
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiTimer, setUpiTimer] = useState(120); // 2 minutes countdown

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  // Set default address if user is logged in
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setFullName(def.fullName);
      setPhone(def.phone);
      setStreetAddress(def.streetAddress);
      setCity(def.city);
      setPincode(def.pincode);
      setState(def.state);
    }
  }, [user]);

  // UPI countdown timer
  useEffect(() => {
    if (!showUpiModal) return;
    if (upiTimer <= 0) {
      setShowUpiModal(false);
      setError('UPI Payment session timed out. Please try again.');
      return;
    }
    const cd = setTimeout(() => setUpiTimer(upiTimer - 1), 1000);
    return () => clearTimeout(cd);
  }, [showUpiModal, upiTimer]);

  const validateCheckout = () => {
    if (!fullName || !email || !phone || !streetAddress || !pincode) {
      setError('Please fill in all shipping fields.');
      return false;
    }
    if (city.toLowerCase() !== 'hyderabad') {
      setError('Al Mashriq currently offers delivery within Hyderabad only.');
      return false;
    }
    if (!pincode.startsWith('500')) {
      setError('Please enter a valid Hyderabad pincode (starts with 500).');
      return false;
    }
    setError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckout()) return;
    
    if (paymentMethod === 'upi') {
      setUpiTimer(120);
      setShowUpiModal(true);
      return;
    }
    
    await executeCheckout();
  };

  const executeCheckout = async () => {
    setLoading(true);
    setError('');
    
    const checkoutData = {
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod,
      shippingAddress: {
        fullName,
        phone,
        streetAddress,
        city,
        pincode,
        state
      },
      contactNumber: phone,
      email,
      fullName,
      couponCode: appliedCoupon ? appliedCoupon.code : null
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(checkoutData)
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        navigate(`/success?orderNumber=${data.orderNumber}&amount=${data.totalAmount}`);
      } else {
        const err = await response.json();
        setError(err.message || 'Failed to place order.');
        setShowUpiModal(false);
      }
    } catch (err) {
      setError('Network error placing order.');
      setShowUpiModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest text-luxury-cream/45 mb-6 sm:mb-8">
          <Link to="/shop" className="hover:text-luxury-gold">Boutique</Link>
          <ChevronRight size={8} className="sm:hidden" />
          <ChevronRight size={10} className="hidden sm:block" />
          <span className="text-luxury-cream">Checkout</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif tracking-wide text-luxury-cream mb-8 sm:mb-12">Bespoke Checkout</h1>

        {error && (
          <div className="bg-red-950/20 border border-red-500/30 text-red-300 text-[10px] sm:text-xs p-3 sm:p-4 mb-6 sm:mb-8 flex items-start space-x-2 uppercase tracking-wider rounded-xl">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Shipping Form (Left column) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold flex items-center">
                <User size={14} className="mr-2" />
                1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Recipient Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Contact Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider"
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
                  placeholder="Apartment, building, suite, street address"
                  className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">City (Hyderabad Only)</label>
                  <input
                    type="text"
                    value={city}
                    disabled
                    className="w-full bg-luxury-black border border-white/5 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream/50 cursor-not-allowed uppercase tracking-wider"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="5000XX"
                    className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">State</label>
                  <input
                    type="text"
                    value={state}
                    disabled
                    className="w-full bg-luxury-black border border-white/5 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream/50 cursor-not-allowed uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-luxury-cream/60">Email Address (For Order Tracking)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2.5 sm:py-2 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <h2 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold flex items-center">
                <CreditCard size={14} className="mr-2" />
                2. Method of Payment
              </h2>

              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border text-left flex flex-col justify-between transition-all rounded-2xl ${
                    paymentMethod === 'cod'
                      ? 'border-luxury-gold bg-luxury-gold/5'
                      : 'border-white/5 bg-luxury-charcoal/20 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs uppercase tracking-widest text-luxury-cream font-bold">Cash On Delivery</span>
                  <span className="text-[9px] text-luxury-cream/45 uppercase tracking-widest mt-2">
                    Pay with cash or card upon direct hand-delivery.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 border text-left flex flex-col justify-between transition-all rounded-2xl ${
                    paymentMethod === 'upi'
                      ? 'border-luxury-gold bg-luxury-gold/5'
                      : 'border-white/5 bg-luxury-charcoal/20 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs uppercase tracking-widest text-luxury-cream font-bold">UPI / QR Code</span>
                  <span className="text-[9px] text-luxury-cream/45 uppercase tracking-widest mt-2">
                    Scan dynamic QR code on checkout screen to pay.
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Cart Summary (Right column) */}
          <div className="lg:col-span-5 bg-luxury-charcoal/30 border border-white/5 p-4 sm:p-6 space-y-4 sm:space-y-6 self-start rounded-2xl">
            <h2 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold flex items-center border-b border-white/5 pb-4">
              <ShoppingBag size={14} className="mr-2" />
              Order Summary
            </h2>

            {/* Cart products */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt="" className="w-8 h-10 object-cover border border-white/5 bg-luxury-black" />
                    <div>
                      <span className="text-luxury-cream font-medium line-clamp-1">{item.name}</span>
                      <span className="text-[9px] text-luxury-cream/40 uppercase tracking-widest">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="text-luxury-cream font-medium">
                    INR {(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal breakdowns */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs uppercase tracking-widest text-luxury-cream/60">
                <span>Subtotal</span>
                <span>INR {cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs uppercase tracking-widest text-luxury-gold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- INR {discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs uppercase tracking-widest text-luxury-cream/60">
                <span>Delivery</span>
                <span className="text-luxury-gold">FREE (HYD LIMITS)</span>
              </div>

              <div className="flex justify-between text-sm uppercase tracking-widest text-luxury-cream font-serif pt-3 border-t border-white/5">
                <span>Total Amount</span>
                <span className="text-luxury-gold font-bold font-sans">
                  INR {cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full btn-gold text-xs py-3 font-semibold uppercase tracking-[0.2em]"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>

      {/* UPI QR Code Payment Simulation Modal */}
      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black cursor-pointer"
              onClick={() => setShowUpiModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-[90vw] sm:max-w-sm w-full bg-luxury-charcoal border border-luxury-gold/30 p-6 sm:p-8 shadow-2xl space-y-6 text-center z-10 rounded-2xl"
            >
              <h3 className="font-serif text-lg text-luxury-gold uppercase tracking-widest">
                Scan UPI QR Code
              </h3>
              <p className="text-[10px] text-luxury-cream/50 uppercase tracking-widest">
                Please scan the code below using any UPI App (GPay, PhonePe, Paytm).
              </p>

              {/* MOCK QR CODE PANEL */}
              <div className="w-36 h-36 sm:w-48 sm:h-48 bg-white p-3 sm:p-4 mx-auto relative flex justify-center items-center shadow-lg border border-luxury-gold/50 rounded-xl">
                <QrCode size={120} className="text-luxury-black sm:hidden" />
                <QrCode size={160} className="text-luxury-black hidden sm:block" />
              </div>

              {/* Dynamic Payment amount */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-cream/40 block">Amount to Pay</span>
                <span className="text-xl font-bold text-luxury-gold font-sans">
                  INR {cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Timer */}
              <div className="bg-luxury-black/40 p-2 border border-white/5 text-[10px] uppercase tracking-widest text-luxury-cream/70 rounded-full">
                Session expires in: <span className="text-luxury-gold font-mono font-bold">{Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, '0')}</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={executeCheckout}
                  disabled={loading}
                  className="w-full btn-gold text-xs py-2 uppercase tracking-widest font-semibold"
                >
                  {loading ? 'Confirming...' : 'I Have Paid'}
                </button>
                
                <button
                  onClick={() => setShowUpiModal(false)}
                  className="text-[10px] uppercase tracking-widest text-luxury-cream/45 hover:text-red-400 block mx-auto transition-colors pt-2"
                >
                  Cancel Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
