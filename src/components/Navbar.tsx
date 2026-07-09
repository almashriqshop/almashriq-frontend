import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, ShoppingBag, User, X, LogOut, ShieldAlert, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartToggle }) => {
  const { cartCount, wishlist } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll-aware navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${
          isScrolled
            ? 'bg-luxury-black/90 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-luxury-black/75 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Navigation items (Left on desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="relative text-xs uppercase tracking-widest transition-colors font-medium text-luxury-cream/80 hover:text-luxury-gold"
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute -bottom-1 left-0 w-full h-[1px] bg-luxury-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Logo (Center) - Big & Bold */}
            <div className="flex-1 flex justify-center md:justify-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.jpg" alt="Al Mashriq" className="w-11 h-11 md:w-14 md:h-14 object-contain rounded-full" />
                <span className="font-serif text-xl md:text-3xl tracking-[0.4em] uppercase text-luxury-gold font-semibold ml-3">
                  AL MASHRIQ
                </span>
              </Link>
            </div>

            {/* Utility items (Right) */}
            <div className="flex items-center space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Search products"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={onCartToggle}
                className="relative text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Admin quick access */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-luxury-gold hover:text-luxury-goldDark transition-colors p-1 flex items-center space-x-1"
                  title="Admin Dashboard"
                >
                  <ShieldAlert size={18} />
                </Link>
              )}

              {/* Account Dropdown / Link */}
              {isAuthenticated ? (
                <div className="relative group flex items-center space-x-2">
                  <Link
                    to="/dashboard"
                    className="text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1 flex items-center"
                    aria-label="User Dashboard"
                  >
                    <User size={18} />
                  </Link>
                  <button
                    onClick={logout}
                    className="text-luxury-cream/50 hover:text-red-400 transition-colors p-1"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1"
                  aria-label="Login page"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-luxury-cream/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-16 md:top-20 z-[60] bg-luxury-black/95 backdrop-blur-xl border-b border-white/5 md:hidden overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`block text-sm uppercase tracking-widest transition-colors py-3 px-2 rounded-lg ${
                      isActive ? 'text-luxury-gold font-semibold bg-luxury-gold/5' : 'text-luxury-cream/70 hover:text-luxury-gold hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen slide-down Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-0 top-0 z-[100] bg-luxury-black/95 backdrop-blur-2xl border-b border-luxury-gold/20 py-8 px-4 sm:px-6 pt-[calc(2rem+env(safe-area-inset-top,0px))]"
          >
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border-b border-luxury-gold/50 py-2">
                <Search className="text-luxury-gold mr-3 shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-luxury-cream text-base sm:text-lg tracking-wider placeholder-luxury-cream/40 focus:outline-none uppercase"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-luxury-cream/70 hover:text-luxury-gold transition-colors p-2 self-end sm:self-auto"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
