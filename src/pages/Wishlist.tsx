import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';

export const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { apiUrl } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/products?limit=50`);
        if (response.ok) {
          const data = await response.json();
          const allProducts = data.products || [];
          const wishlistProducts = allProducts.filter((p: Product) =>
            wishlist.includes(p.id)
          );
          setProducts(wishlistProducts);
        }
      } catch (err) {
        console.error('Error fetching wishlist products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, apiUrl]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center py-8 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.6em] text-luxury-gold font-semibold">
            YOUR CURATED SELECTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide text-luxury-cream">
            Wishlist
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-cream/45 max-w-lg mx-auto">
            {wishlist.length} {wishlist.length === 1 ? 'fragrance' : 'fragrances'} saved for later consideration.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-luxury-charcoal/50 animate-pulse border border-white/5 rounded-2xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center border border-white/5 bg-luxury-charcoal/20 rounded-2xl">
            <Heart className="text-luxury-gold/30 mx-auto mb-6" size={48} />
            <p className="font-serif text-lg tracking-wider text-luxury-cream/70">
              YOUR WISHLIST IS EMPTY
            </p>
            <p className="text-xs text-luxury-cream/40 uppercase tracking-widest mt-2 max-w-sm mx-auto">
              Explore our boutique and save your favorite reserves for future consideration.
            </p>
            <Link to="/shop" className="btn-gold mt-8 text-xs py-2 px-6 inline-block">
              Browse Boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col justify-between border border-white/5 p-4 bg-luxury-charcoal/45 hover:border-luxury-gold/45 transition-all duration-300 relative rounded-2xl"
              >
                {/* Remove from Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-6 right-6 z-10 text-luxury-gold hover:text-red-400 transition-colors p-1.5"
                  title="Remove from Wishlist"
                >
                  <Heart size={16} className="fill-luxury-gold" />
                </button>

                <Link
                  to={`/products/${product.slug}`}
                  className="block overflow-hidden relative aspect-[3/4] bg-luxury-black mb-4"
                >
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] uppercase tracking-widest text-red-400 font-semibold">
                      Out of Stock
                    </div>
                  )}
                </Link>

                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold/70 block mb-1">
                    {product.category} COLLECTION
                  </span>
                  <Link
                    to={`/products/${product.slug}`}
                    className="font-serif text-sm tracking-wide text-luxury-cream hover:text-luxury-gold transition-colors line-clamp-1 block"
                  >
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
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="text-[10px] uppercase tracking-widest text-luxury-cream border border-white/10 hover:border-luxury-gold hover:text-luxury-gold disabled:border-white/5 disabled:text-luxury-cream/25 disabled:cursor-not-allowed transition-all py-1.5 px-3 flex items-center space-x-1 rounded-full"
                    >
                      <ShoppingBag size={10} />
                      <span>{product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
