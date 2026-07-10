import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, cartTotal, appliedCoupon, applyCoupon, discountAmount } = useCart();
  const { apiUrl } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponError('');

    try {
      const response = await fetch(`${apiUrl}/orders/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: couponCode,
          cartSubtotal
        })
      });

      if (response.ok) {
        const data = await response.json();
        applyCoupon({
          code: data.code,
          discountType: data.discountType,
          value: data.value
        });
        setCouponCode('');
      } else {
        const err = await response.json();
        setCouponError(err.message || 'Invalid coupon code.');
      }
    } catch (err) {
      setCouponError('Network error verifying coupon.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[1000] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-luxury-charcoal border-l border-white/5 shadow-2xl z-[1001] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-serif text-lg uppercase tracking-widest text-luxury-gold">
                Shopping Cart ({cart.length})
              </h2>
              <button
                onClick={onClose}
                className="text-luxury-cream/70 hover:text-luxury-gold transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <ShoppingBagIcon />
                  <p className="font-serif text-lg tracking-wide text-luxury-cream/80 mt-6">
                    YOUR CART IS EMPTY
                  </p>
                  <p className="text-xs text-luxury-cream/50 uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                    Explore our exquisite collections of Oudh, Woody, and Jasmine fragrances.
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="btn-gold mt-8 text-xs font-semibold py-2.5 px-6"
                  >
                    Return to Boutique
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="flex space-x-4 border-b border-white/5 pb-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover border border-white/10 bg-luxury-black rounded-lg"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-luxury-gold/70">
                          {item.category} COLLECTION
                        </span>
                        <h3 className="font-serif text-sm tracking-wide text-luxury-cream mt-0.5">
                          {item.name}
                        </h3>
                        <p className="text-xs text-luxury-gold mt-1">
                          INR {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-white/10 rounded-lg bg-luxury-black/30">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 text-luxury-cream/70 hover:text-luxury-gold"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-medium text-luxury-cream">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 text-luxury-cream/70 hover:text-luxury-gold"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-luxury-cream/40 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom calculation panel */}
            {cart.length > 0 && (
              <div className="p-6 bg-luxury-black border-t border-white/5 space-y-6">
                {/* Hyderabad alert */}
                <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-3 flex items-start space-x-2 rounded-xl">
                  <AlertCircle size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                  <p className="text-[10px] text-luxury-cream/80 uppercase tracking-wider leading-relaxed">
                    EXPRESS SHIPPING ALL OVER INDIA. FREE SHIPPING.
                  </p>
                </div>

                {/* Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 text-luxury-cream/45" size={14} />
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-luxury-charcoal border border-white/10 py-2 pl-9 pr-3 text-xs text-luxury-cream placeholder-luxury-cream/30 uppercase tracking-widest focus:border-luxury-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="border border-luxury-gold px-4 text-xs font-semibold uppercase tracking-wider text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all rounded-full"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[10px] text-red-400 uppercase tracking-wider">{couponError}</p>}

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest bg-white/5 p-2 border border-white/10 rounded-lg">
                    <span className="text-luxury-gold flex items-center">
                      <Tag size={12} className="mr-1" />
                      COUPON: {appliedCoupon.code} APPLIED
                    </span>
                    <button
                      onClick={() => applyCoupon(null)}
                      className="text-luxury-cream/50 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Pricing totals */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between text-xs uppercase tracking-widest text-luxury-cream/70">
                    <span>Subtotal</span>
                    <span>INR {cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs uppercase tracking-widest text-luxury-gold">
                      <span>Discount</span>
                      <span>- INR {discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm uppercase tracking-widest text-luxury-cream font-serif pt-2 border-t border-white/5">
                    <span>Estimated Total</span>
                    <span className="text-luxury-gold font-bold font-sans">
                      INR {cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-gold text-xs font-semibold py-3 flex items-center justify-center space-x-2 tracking-[0.2em]"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ShoppingBagIcon = () => (
  <svg
    className="w-12 h-12 text-luxury-gold animate-pulse"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
