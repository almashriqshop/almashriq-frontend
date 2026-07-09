import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Heart, Award, Star, Quote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { COLLECTIONS } from '../lib/constants';
import { formatPrice, getProductImage } from '../lib/utils';
import type { Product } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { apiUrl } = useAuth();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${apiUrl}/products?limit=4&sortBy=popularity`);
        if (response.ok) {
          const data = await response.json();
          setBestSellers(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching best sellers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, [apiUrl]);

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Fragrance Collector',
      text: 'The Oudh Royale is unlike anything I have ever experienced. The depth and longevity is extraordinary.',
      rating: 5,
    },
    {
      name: 'Arjun Reddy',
      role: 'Connoisseur',
      text: 'Al Mashriq has redefined luxury perfumery in Hyderabad. Every bottle is a masterpiece.',
      rating: 5,
    },
    {
      name: 'Meera Patel',
      role: 'Loyal Customer',
      text: 'The packaging, the scent, the delivery experience - everything speaks pure luxury.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '45+', label: 'Premium Perfumes' },
    { number: '100%', label: 'Pure Absolute Oils' },
    { number: '24-48h', label: 'Hyderabad Delivery' },
    { number: '5★', label: 'Customer Rating' },
  ];

  return (
    <div className="w-full">
      {/* 1. Fullscreen Cinematic Video Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <motion.div 
          style={{ scale: heroScale }}
          className="absolute inset-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=1920"
          >
            <source src="https://videos.pexels.com/video-files/6621331/6621331-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-luxury-black/20" />
          <div className="absolute inset-0 bg-luxury-black/30" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 text-center z-10 space-y-6">
          <motion.div
            initial={{ letterSpacing: '0.1em', opacity: 0, y: 30 }}
            animate={{ letterSpacing: '0.4em', opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <span className="text-[10px] sm:text-xs uppercase text-luxury-gold font-medium tracking-[0.6em]">
              THE ART OF HAUTE PARFUMERIE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
            className="text-3xl sm:text-6xl md:text-8xl font-serif text-luxury-cream tracking-wide leading-tight"
          >
            AL MASHRIQ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="text-[10px] sm:text-sm uppercase tracking-[0.35em] text-luxury-cream max-w-2xl mx-auto font-light leading-relaxed"
          >
            Exquisite fragrances distilled for perfume connoisseurs. Hand-delivered within Hyderabad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop" className="btn-gold w-full sm:w-auto text-center">
              Explore Collection
            </Link>
            <Link to="/about" className="border border-white/20 hover:border-luxury-gold text-luxury-cream hover:text-luxury-gold px-8 py-3 text-sm uppercase tracking-widest transition-all duration-500 font-semibold rounded-full w-full sm:w-auto text-center">
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none">
          <span className="text-[8px] uppercase tracking-[0.4em] text-luxury-cream/40">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-luxury-gold to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center space-y-1"
              >
                <span className="text-2xl sm:text-3xl font-serif text-luxury-gold">{stat.number}</span>
                <span className="text-[9px] uppercase tracking-widest text-luxury-cream/50 block">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Brand Story / Editorial Section */}
      <section className="py-24 sm:py-32 bg-luxury-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-8"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold block">
              OUR HERITAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-wide leading-snug">
              Every drop tells a tale of luxury and devotion.
            </h2>
            <div className="w-16 h-[1px] bg-luxury-gold" />
            <p className="text-sm text-luxury-cream/70 font-light leading-relaxed max-w-lg">
              Al Mashriq is a sanctuary of olfactory mastery. Inspired by the rich cultural heritage and exotic raw materials of the Orient, we select only the finest Cambodi Oudh, clean Mysore Sandalwood, and hand-plucked Indian Jasmine absolute. 
            </p>
            <p className="text-sm text-luxury-cream/70 font-light leading-relaxed max-w-lg">
              Our master perfumers merge traditional attar-distilling wisdom with modern French architecture. The result is a selection of perfumes that sit on the skin like liquid poetry.
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-luxury-goldLight transition-colors">
                <span>The House Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="relative aspect-[4/5] border border-white/5 bg-luxury-charcoal overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800"
              alt="Luxury Perfume Crafting"
              className="w-full h-full object-cover filter brightness-90 contrast-105 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Collections Categories */}
      <section className="py-20 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
              CURATED ESSENCES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif">Fragrance Families</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {COLLECTIONS.map((coll, idx) => (
              <motion.div
                key={coll.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group relative h-64 md:h-96 overflow-hidden border border-white/5 cursor-pointer hover-lift rounded-2xl"
                onClick={() => navigate(`/shop?category=${coll.slug}`)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${coll.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <h3 className="font-serif text-lg tracking-wide text-luxury-cream group-hover:text-luxury-gold transition-colors">
                    {coll.title}
                  </h3>
                  <p className="text-[10px] text-luxury-cream/65 uppercase tracking-widest">
                    {coll.desc}
                  </p>
                  <div className="flex items-center space-x-1 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] uppercase tracking-widest">Explore</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
                CONNOISSEUR PICKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif">The Best Sellers</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-luxury-gold hover:underline mt-4 sm:mt-0 flex items-center space-x-1">
              <span>View Boutique</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-luxury-charcoal/50 animate-pulse border border-white/5 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="group flex flex-col justify-between border border-white/5 p-2 sm:p-4 bg-luxury-charcoal/45 hover:border-luxury-gold/40 transition-all duration-300 relative hover-lift rounded-2xl"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-6 right-6 z-10 text-luxury-cream/50 hover:text-luxury-gold transition-colors p-1.5"
                    >
                      <Heart size={16} className={isWishlisted ? 'fill-luxury-gold text-luxury-gold' : ''} />
                    </button>

                    <Link to={`/products/${product.slug}`} className="block overflow-hidden relative aspect-[3/4] bg-luxury-black mb-4">
                      <img
                        src={getProductImage(product.images, product.category)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-luxury-gold/70 block mb-1">
                        {product.category}
                      </span>
                      <Link to={`/products/${product.slug}`} className="font-serif text-sm tracking-wide text-luxury-cream hover:text-luxury-gold transition-colors line-clamp-1 block">
                        {product.name}
                      </Link>
                      <p className="text-xs text-luxury-cream/45 line-clamp-2 mt-2 leading-relaxed h-8">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-xs font-semibold text-luxury-gold">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="text-[10px] uppercase tracking-widest text-luxury-cream border border-white/10 hover:border-luxury-gold hover:text-luxury-gold transition-all py-1.5 px-3 rounded-full"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Choose Al Mashriq Section */}
      <section className="py-24 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
              THE AL MASHRIQ PROMISE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="space-y-3 p-3 md:p-4 text-center md:text-left hover-lift rounded-2xl">
              <Award className="text-luxury-gold mx-auto md:mx-0" size={28} />
              <h3 className="font-serif text-sm md:text-lg tracking-wide uppercase">Pure Absolute Oils</h3>
              <p className="text-[10px] md:text-xs text-luxury-cream/60 leading-relaxed font-light">
                We use single-source authentic raw extracts, avoiding synthetic replacements to ensure a premium sillage.
              </p>
            </div>
            <div className="space-y-3 p-3 md:p-4 text-center md:text-left hover-lift rounded-2xl">
              <Sparkles className="text-luxury-gold mx-auto md:mx-0" size={28} />
              <h3 className="font-serif text-sm md:text-lg tracking-wide uppercase">Master Blended</h3>
              <p className="text-[10px] md:text-xs text-luxury-cream/60 leading-relaxed font-light">
                Distilled in small batches under the surveillance of master perfumers, ensuring unparalleled projection.
              </p>
            </div>
            <div className="space-y-3 p-3 md:p-4 text-center md:text-left hover-lift rounded-2xl">
              <Truck className="text-luxury-gold mx-auto md:mx-0" size={28} />
              <h3 className="font-serif text-sm md:text-lg tracking-wide uppercase">Hyderabad Courier</h3>
              <p className="text-[10px] md:text-xs text-luxury-cream/60 leading-relaxed font-light">
                Direct-to-skin delivery. Handled by our official brand couriers within the municipal limits of Hyderabad.
              </p>
            </div>
            <div className="space-y-3 p-3 md:p-4 text-center md:text-left hover-lift rounded-2xl">
              <ShieldCheck className="text-luxury-gold mx-auto md:mx-0" size={28} />
              <h3 className="font-serif text-sm md:text-lg tracking-wide uppercase">Bespoke Cases</h3>
              <p className="text-[10px] md:text-xs text-luxury-cream/60 leading-relaxed font-light">
                Delivered in charcoal lacquer boxes wrapped with thick raw silk, perfect for gifting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
              TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif">What Our Connoisseurs Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-luxury-charcoal/30 border border-white/5 p-8 space-y-6 hover:border-luxury-gold/20 transition-colors duration-500 rounded-2xl"
              >
                <Quote className="text-luxury-gold/30" size={24} />
                <p className="text-sm text-luxury-cream/70 leading-relaxed font-light italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex text-luxury-gold">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-luxury-gold" />
                  ))}
                </div>
                <div>
                  <span className="text-xs font-semibold text-luxury-cream block">{testimonial.name}</span>
                  <span className="text-[9px] text-luxury-cream/45 uppercase tracking-widest">{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription */}
      <section className="py-24 bg-luxury-charcoal border-y border-white/5 relative overflow-hidden">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-luxury-gold to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold block">
            JOIN THE GUILD
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-wide text-luxury-cream">
            Subscribe to Private Reserves
          </h2>
          <p className="text-xs sm:text-sm text-luxury-cream/60 max-w-md mx-auto uppercase tracking-widest font-light leading-relaxed">
            Receive exclusive updates, invitations to private decant releases, and seasonal perfume launches.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to private reserve releases.'); }} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-luxury-black border border-white/10 px-4 py-3 text-xs text-luxury-cream placeholder-luxury-cream/40 focus:border-luxury-gold focus:outline-none transition-colors"
              required
            />
            <button type="submit" className="w-full sm:w-auto btn-gold text-xs py-3 px-8 shrink-0">
              Subscribe
            </button>
          </form>
          
          <p className="text-[9px] text-luxury-cream/30 uppercase tracking-widest">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
