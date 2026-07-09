import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'AM-582044';
  const amount = searchParams.get('amount') || '0';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-luxury-black pb-24 flex items-center">
      <div className="max-w-xl mx-auto px-6 text-center space-y-8">
        
        {/* Animated Check icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-20 h-20 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full flex items-center justify-center mx-auto text-luxury-gold"
        >
          <CheckCircle2 size={40} className="stroke-1" />
        </motion.div>

        {/* Cinematic headers */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
            TRANSACTION SECURED
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-luxury-cream tracking-wide">
            Your Order is Sealed
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-cream/45 max-w-sm mx-auto leading-relaxed">
            Thank you for choosing Al Mashriq. Our courier agents are packaging your reserve bottles.
          </p>
        </div>

        {/* Order Info block */}
        <div className="border border-white/5 bg-luxury-charcoal/30 p-6 space-y-4 text-left text-xs uppercase tracking-widest rounded-2xl">
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-luxury-cream/40">Order Number</span>
            <span className="text-luxury-gold font-bold font-mono">{orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-luxury-cream/40">Total Paid</span>
            <span className="text-luxury-cream font-semibold">INR {parseFloat(amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-luxury-cream/40">Delivery Location</span>
            <span className="text-luxury-cream flex items-center">
              <MapPin size={10} className="mr-1 text-luxury-gold" />
              Hyderabad Limits
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-luxury-cream/40">Estimated Arrival</span>
            <span className="text-luxury-gold flex items-center font-bold">
              <Truck size={10} className="mr-1" />
              24-48 Hours
            </span>
          </div>
        </div>

        {/* Custom luxury packaging note */}
        <p className="text-[10px] text-luxury-cream/50 leading-relaxed uppercase tracking-wider max-w-md mx-auto">
          *Notice: All fragrances are packed in custom lacquer charcoal cases wrapped in raw silk, and hand-delivered directly to the recipient to ensure safety.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-gold text-[10px] py-3 px-8 font-semibold tracking-widest uppercase"
          >
            Track in Dashboard
          </Link>
          <Link
            to="/shop"
            className="border border-white/10 hover:border-luxury-gold text-luxury-cream hover:text-luxury-gold px-8 py-3 text-[10px] tracking-widest uppercase font-semibold transition-colors"
          >
            Return to Boutique
          </Link>
        </div>

      </div>
    </div>
  );
};
