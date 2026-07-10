import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Truck, ShieldCheck, Heart, Award, Star } from 'lucide-react';
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
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.05]);

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
      name: 'Priya S.',
      text: 'The oudh in this is real — not that synthetic stuff you find everywhere else. Lasts easily 12+ hours on skin.',
      rating: 5,
    },
    {
      name: 'Arjun R.',
      text: 'Ordered for my wife\'s birthday. The packaging alone felt premium. She loved the jasmine absolute.',
      rating: 5,
    },
    {
      name: 'Meera P.',
      text: 'Finally a Hyderabad brand that actually uses pure oils. The sandalwood is incredible.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '45+', label: 'Fragrances' },
    { number: '100%', label: 'Pure Oils' },
    { number: '24-48h', label: 'City Delivery' },
    { number: '4.9', label: 'Avg Rating' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-luxury-black/20" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 text-center z-10 space-y-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[10px] sm:text-xs uppercase text-luxury-gold tracking-[0.4em] block"
          >
            Handcrafted in Hyderabad
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif text-luxury-cream tracking-wide"
          >
            AL MASHRIQ
          </motion.h1>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-luxury-cream max-w-xl mx-auto font-light">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.4 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="h-[1px] w-8 sm:w-16 bg-luxury-cream hidden sm:block"
            />
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="whitespace-nowrap"
            >
              The Essence of the East
            </motion.span>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.4 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="h-[1px] w-8 sm:w-16 bg-luxury-cream hidden sm:block"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-6 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop" className="btn-gold w-full sm:w-auto text-center">
              Shop Now
            </Link>
            <Link to="/about" className="border border-white/20 hover:border-luxury-gold text-luxury-cream hover:text-luxury-gold px-8 py-3 text-xs uppercase tracking-widest transition-all duration-300 rounded-full w-full sm:w-auto text-center">
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none">
          <span className="text-[8px] uppercase tracking-[0.3em] text-luxury-cream/40">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-luxury-gold/60 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <span className="text-xl sm:text-2xl font-serif text-luxury-gold">{stat.number}</span>
                <span className="text-[9px] uppercase tracking-widest text-luxury-cream/50 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 sm:py-28 bg-luxury-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold block">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif leading-snug">
              Not another perfume brand.
            </h2>
            <div className="w-12 h-[1px] bg-luxury-gold" />
            <p className="text-sm text-luxury-cream/60 leading-relaxed max-w-lg">
              We started Al Mashriq because we were tired of paying premium prices for perfume alcohol with "oud" on the label. Every fragrance we make uses real Cambodi oudh, Mysore sandalwood, or Indian jasmine absolute — sourced directly, distilled in small batches, blended by hand.
            </p>
            <p className="text-sm text-luxury-cream/60 leading-relaxed max-w-lg">
              No fillers. No synthetics passed off as natural. Just oil, the way attar has been made in Hyderabad for centuries.
            </p>
            <div className="pt-2">
              <Link to="/about" className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-luxury-goldLight transition-colors">
                <span>Read more</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] border border-white/5 bg-luxury-charcoal overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800"
              alt="Perfume crafting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
              Shop by Note
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif">Our Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((coll) => (
              <div
                key={coll.slug}
                className="group relative h-72 md:h-80 overflow-hidden border border-white/5 cursor-pointer hover-lift rounded-lg"
                onClick={() => navigate(`/shop?category=${coll.slug}`)}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${coll.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                  <h3 className="font-serif text-lg text-luxury-cream group-hover:text-luxury-gold transition-colors">
                    {coll.title}
                  </h3>
                  <p className="text-[10px] text-luxury-cream/60 uppercase tracking-widest">
                    {coll.desc}
                  </p>
                  <div className="flex items-center space-x-1 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
                    <span className="text-[10px] uppercase tracking-widest">Explore</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
                Best Sellers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif">Customer favourites</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-luxury-gold hover:underline mt-4 sm:mt-0 flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-luxury-charcoal/50 animate-pulse border border-white/5 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col justify-between border border-white/5 p-3 bg-luxury-charcoal/30 hover:border-luxury-gold/30 transition-all duration-300 relative hover-lift rounded-lg"
                  >
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 text-luxury-cream/40 hover:text-luxury-gold transition-colors"
                    >
                      <Heart size={16} className={isWishlisted ? 'fill-luxury-gold text-luxury-gold' : ''} />
                    </button>

                    <Link to={`/products/${product.slug}`} className="block overflow-hidden relative aspect-[3/4] bg-luxury-black mb-3">
                      <img
                        src={getProductImage(product.images, product.category)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-luxury-gold/60 block mb-1">
                        {product.category}
                      </span>
                      <Link to={`/products/${product.slug}`} className="font-serif text-sm text-luxury-cream hover:text-luxury-gold transition-colors line-clamp-1 block">
                        {product.name}
                      </Link>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-semibold text-luxury-gold">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="text-[10px] uppercase tracking-widest text-luxury-cream border border-white/10 hover:border-luxury-gold hover:text-luxury-gold transition-all py-1.5 px-3 rounded-full"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-luxury-charcoal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="space-y-3 p-4 text-center">
              <Award className="text-luxury-gold mx-auto" size={24} />
              <h3 className="font-serif text-sm uppercase tracking-wide">Pure Oils</h3>
              <p className="text-[10px] text-luxury-cream/50 leading-relaxed">
                Real absolute oils, not synthetic replacements.
              </p>
            </div>
            <div className="space-y-3 p-4 text-center">
              <ShieldCheck className="text-luxury-gold mx-auto" size={24} />
              <h3 className="font-serif text-sm uppercase tracking-wide">Small Batch</h3>
              <p className="text-[10px] text-luxury-cream/50 leading-relaxed">
                Distilled in limited quantities for quality control.
              </p>
            </div>
            <div className="space-y-3 p-4 text-center">
              <Truck className="text-luxury-gold mx-auto" size={24} />
              <h3 className="font-serif text-sm uppercase tracking-wide">Hyderabad Only</h3>
              <p className="text-[10px] text-luxury-cream/50 leading-relaxed">
                Same-day dispatch within city limits.
              </p>
            </div>
            <div className="space-y-3 p-4 text-center">
              <Heart className="text-luxury-gold mx-auto" size={24} />
              <h3 className="font-serif text-sm uppercase tracking-wide">Gift Ready</h3>
              <p className="text-[10px] text-luxury-cream/50 leading-relaxed">
                Premium packaging included with every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">
              Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif">What people say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-luxury-charcoal/20 border border-white/5 p-6 space-y-4 rounded-lg"
              >
                <div className="flex text-luxury-gold">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-luxury-gold" />
                  ))}
                </div>
                <p className="text-sm text-luxury-cream/60 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <span className="text-xs text-luxury-cream/80 block">{testimonial.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-luxury-charcoal border-t border-white/5">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-serif">Stay in the loop</h2>
          <p className="text-xs text-luxury-cream/50 uppercase tracking-widest">
            New drops, restocks, and updates. No spam.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-luxury-black border border-white/10 px-4 py-3 text-xs text-luxury-cream placeholder-luxury-cream/30 focus:border-luxury-gold focus:outline-none transition-colors rounded-lg"
              required
            />
            <button type="submit" className="w-full sm:w-auto btn-gold text-xs py-3 px-6 shrink-0 rounded-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
