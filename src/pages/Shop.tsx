import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SlidersHorizontal, Search, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, SORT_OPTIONS } from '../lib/constants';
import { formatPrice, getProductImage } from '../lib/utils';
import type { Product } from '../types';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { apiUrl } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '0';
  const maxPrice = searchParams.get('maxPrice') || '20000';
  const sortBy = searchParams.get('sortBy') || 'popularity';
  const page = searchParams.get('page') || '1';

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  const [localSearch, setLocalSearch] = useState(search);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);

  useEffect(() => {
    setLocalSearch(search);
    setLocalMaxPrice(maxPrice);
    setLocalMinPrice(minPrice);
  }, [search, maxPrice, minPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category,
        search,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit: '12'
      });

      const response = await fetch(`${apiUrl}/products?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 12, pages: 1 });
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, search, minPrice, maxPrice, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch) {
      params.set('search', localSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategorySelect = (catSlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (catSlug) {
      params.set('category', catSlug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams);
    params.set('maxPrice', localMaxPrice);
    params.set('minPrice', localMinPrice);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePriceReset = () => {
    setLocalMinPrice('0');
    setLocalMaxPrice('20000');
    const params = new URLSearchParams(searchParams);
    params.delete('minPrice');
    params.delete('maxPrice');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortSelect = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', val);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (pageNum: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString());
    setSearchParams(params);
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setLocalMinPrice('0');
    setLocalMaxPrice('20000');
  };

  const hasActiveFilters = category || search || minPrice !== '0' || maxPrice !== '20000';

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center py-4 sm:py-8 space-y-2 sm:space-y-3">
          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-luxury-gold font-semibold">
            THE AL MASHRIQ CATALOGUE
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-serif tracking-wide text-luxury-cream">
            The Fragrance Boutique
          </h1>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-luxury-cream/45 max-w-lg mx-auto">
            {pagination.total} Premium creations, hand-blended and sealed in dark lacquer bottles.
          </p>
        </div>

        {/* Toolbar Filter / Search */}
        <div className="border-y border-white/5 py-3 sm:py-4 my-4 sm:my-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Categories Tab selector */}
          <div className="flex flex-nowrap overflow-x-auto gap-2 items-center justify-start w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[10px] uppercase tracking-widest font-semibold transition-all rounded-full whitespace-nowrap flex-shrink-0 ${
                  (category.toLowerCase() === cat.slug.toLowerCase())
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-transparent text-luxury-cream/60 hover:text-luxury-gold border border-white/5 hover:border-luxury-gold/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:space-x-4 w-full sm:w-auto justify-end">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-none sm:w-64 max-w-xs">
              <input
                type="text"
                placeholder="Search boutique..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-luxury-charcoal border border-white/10 py-1.5 pl-8 pr-3 text-[10px] sm:text-xs text-luxury-cream placeholder-luxury-cream/40 focus:border-luxury-gold focus:outline-none uppercase tracking-wider transition-colors"
              />
              <Search className="absolute left-2.5 top-2.5 text-luxury-cream/35" size={12} />
            </form>

            {/* Mobile Filters toggler */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1.5 sm:space-x-2 text-[8px] sm:text-[10px] uppercase tracking-widest border py-1.5 sm:py-2 px-3 sm:px-4 transition-all rounded-full flex-shrink-0 ${
                showFilters
                  ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                  : 'text-luxury-cream border-white/10 hover:border-luxury-gold hover:text-luxury-gold'
              }`}
            >
              <SlidersHorizontal size={12} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-luxury-cream/40">Active Filters:</span>
            {category && (
              <span className="flex items-center space-x-1 bg-luxury-gold/10 border border-luxury-gold/20 px-2 sm:px-2 py-1 text-[8px] sm:text-[9px] uppercase tracking-widest text-luxury-gold min-h-[28px] sm:min-h-auto">
                <span>{category}</span>
                <button onClick={() => handleCategorySelect('')} className="hover:text-luxury-cream ml-1 p-0.5">
                  <X size={10} />
                </button>
              </span>
            )}
            {search && (
              <span className="flex items-center space-x-1 bg-luxury-gold/10 border border-luxury-gold/20 px-2 sm:px-2 py-1 text-[8px] sm:text-[9px] uppercase tracking-widest text-luxury-gold min-h-[28px] sm:min-h-auto">
                <span>&quot;{search}&quot;</span>
                <button onClick={() => { setLocalSearch(''); handleCategorySelect(category); }} className="hover:text-luxury-cream ml-1 p-0.5">
                  <X size={10} />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAllFilters}
              className="text-[8px] sm:text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors ml-1 sm:ml-2 min-h-[28px] px-2 py-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Filters Tray / Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-luxury-charcoal border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 rounded-2xl">
                {/* Price Filter slider */}
                <div className="space-y-3">
                  <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-luxury-gold font-semibold">Price Range</h3>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-luxury-cream/50">
                    <span>INR {parseInt(localMinPrice).toLocaleString('en-IN')}</span>
                    <span>INR {parseInt(localMaxPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] sm:text-[9px] text-luxury-cream/40 uppercase tracking-wider">Min</label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      className="w-full accent-luxury-gold bg-luxury-black h-1"
                    />
                    <label className="text-[8px] sm:text-[9px] text-luxury-cream/40 uppercase tracking-wider">Max</label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="w-full accent-luxury-gold bg-luxury-black h-1"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handlePriceApply}
                      className="flex-1 text-[8px] sm:text-[9px] uppercase tracking-wider border border-luxury-gold text-luxury-gold px-3 py-1.5 hover:bg-luxury-gold hover:text-luxury-black transition-all rounded-full"
                    >
                      Apply Range
                    </button>
                    <button
                      onClick={handlePriceReset}
                      className="flex-1 text-[8px] sm:text-[9px] uppercase tracking-wider border border-white/10 text-luxury-cream/60 px-3 py-1.5 hover:border-white/20 transition-all rounded-full"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Sort selector */}
                <div className="space-y-3">
                  <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-luxury-gold font-semibold">Sort By</h3>
                  <div className="flex flex-col space-y-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        className={`text-left text-[9px] sm:text-[10px] uppercase tracking-widest hover:text-luxury-gold transition-colors ${
                          sortBy === option.value ? 'text-luxury-gold font-bold' : 'text-luxury-cream/60'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Information box */}
                <div className="space-y-3 border-l border-white/5 pl-6 hidden sm:block">
                  <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Bespoke Shipping</h3>
                  <p className="text-[9px] sm:text-[10px] text-luxury-cream/50 leading-relaxed uppercase tracking-wider">
                    All fragrances are hand-delivered within 24-48 hours. Fresh batches only. Pincode validation applies at checkout.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 sm:h-96 bg-luxury-charcoal/50 animate-pulse border border-white/5 p-3 sm:p-4 flex flex-col justify-between rounded-2xl">
                <div className="w-full h-40 sm:h-64 bg-luxury-black/30" />
                <div className="w-1/2 h-3 sm:h-4 bg-white/10 mt-2" />
                <div className="w-full h-6 sm:h-8 bg-white/10 mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 sm:py-24 text-center border border-white/5 bg-luxury-charcoal/20 rounded-2xl">
            <p className="font-serif text-sm sm:text-lg tracking-wider text-luxury-cream/70 px-4">
              NO FRAGRANCES MATCHED YOUR FILTER SELECTION
            </p>
            <p className="text-[10px] sm:text-xs text-luxury-cream/40 uppercase tracking-widest mt-2 px-4">
              Try resetting filters, searching for Oudh or Jasmine, or widening price settings.
            </p>
            <button
              onClick={handleClearAllFilters}
              className="btn-gold mt-6 sm:mt-8 text-[10px] sm:text-xs py-2 px-6"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
              {products.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group flex flex-col justify-between border border-white/5 p-2.5 sm:p-4 bg-luxury-charcoal/45 hover:border-luxury-gold/45 transition-all duration-300 relative hover-lift rounded-2xl"
                  >
                    {/* Wishlist Heart */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 text-luxury-cream/50 hover:text-luxury-gold transition-colors p-1 sm:p-1.5"
                    >
                      <Heart size={14} className={isWishlisted ? 'fill-luxury-gold text-luxury-gold' : ''} />
                    </button>

                    <Link to={`/products/${product.slug}`} className="block overflow-hidden relative aspect-[3/4] bg-luxury-black mb-2 sm:mb-4">
                      <img
                        src={getProductImage(product.images, product.category)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] sm:text-[10px] uppercase tracking-widest text-red-400 font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </Link>

                    <div>
                      <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-luxury-gold/70 block mb-0.5 sm:mb-1">
                        {product.category} COLLECTION
                      </span>
                      <Link to={`/products/${product.slug}`} className="font-serif text-[10px] sm:text-sm tracking-wide text-luxury-cream hover:text-luxury-gold transition-colors line-clamp-1 block">
                        {product.name}
                      </Link>
                      <p className="text-[8px] sm:text-xs text-luxury-cream/45 line-clamp-2 mt-1 sm:mt-2 leading-relaxed h-6 sm:h-8">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3 sm:mt-6">
                        <span className="text-[10px] sm:text-xs font-semibold text-luxury-gold">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={product.stock <= 0}
                          className="text-[8px] sm:text-[10px] uppercase tracking-widest text-luxury-cream border border-white/10 hover:border-luxury-gold hover:text-luxury-gold disabled:border-white/5 disabled:text-luxury-cream/25 disabled:cursor-not-allowed transition-all py-1 sm:py-1.5 px-2 sm:px-3 rounded-full"
                        >
                          {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-8 sm:mt-16 border-t border-white/5 pt-4 sm:pt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10 hover:border-luxury-gold text-[10px] sm:text-xs uppercase tracking-widest disabled:opacity-20 transition-all text-luxury-cream rounded-full"
                >
                  Prev
                </button>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 text-[9px] sm:text-[10px] uppercase tracking-widest transition-all rounded-full ${
                        pagination.page === pageNum
                          ? 'bg-luxury-gold text-luxury-black font-bold'
                          : 'border border-white/10 text-luxury-cream/60 hover:border-luxury-gold hover:text-luxury-gold'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-white/10 hover:border-luxury-gold text-[10px] sm:text-xs uppercase tracking-widest disabled:opacity-20 transition-all text-luxury-cream rounded-full"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
