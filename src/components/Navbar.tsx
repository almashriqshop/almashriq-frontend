import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, ShoppingBag, User, X, LogOut, ShieldAlert, Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${
          isScrolled
            ? 'bg-luxury-black/95 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-luxury-black/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`text-[11px] uppercase tracking-widest transition-colors font-medium ${
                      isActive ? 'text-luxury-gold' : 'text-luxury-cream/70 hover:text-luxury-cream'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile left: hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-luxury-cream/70 hover:text-luxury-gold transition-colors p-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Logo (Center) */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Al Mashriq" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                <span className="font-serif text-base md:text-xl tracking-[0.25em] md:tracking-[0.3em] uppercase text-luxury-gold">
                  Al Mashriq
                </span>
              </Link>
            </div>

            {/* Mobile right: cart + user only */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={onCartToggle}
                className="relative text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-luxury-gold text-luxury-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
            </div>

            {/* Desktop right icons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              <Link
                to="/wishlist"
                className="relative text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={17} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-luxury-gold text-luxury-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={onCartToggle}
                className="relative text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-luxury-gold text-luxury-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAdmin && (
                <Link to="/admin" className="text-luxury-gold/70 hover:text-luxury-gold transition-colors" title="Admin">
                  <ShieldAlert size={17} />
                </Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="text-luxury-cream/70 hover:text-luxury-gold transition-colors" aria-label="Dashboard">
                    <User size={17} />
                  </Link>
                  <button onClick={logout} className="text-luxury-cream/40 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-luxury-cream/70 hover:text-luxury-gold transition-colors" aria-label="Login">
                  <User size={17} />
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-x-0 top-14 z-[60] bg-luxury-black/98 backdrop-blur-md border-b border-white/5 md:hidden">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`block text-sm uppercase tracking-widest transition-colors py-2.5 ${
                      isActive ? 'text-luxury-gold font-semibold' : 'text-luxury-cream/60 hover:text-luxury-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-white/5 pt-3 mt-3 space-y-2">
                <button
                  onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm text-luxury-cream/60 hover:text-luxury-gold transition-colors py-2"
                >
                  <Search size={16} />
                  <span className="uppercase tracking-widest text-[11px]">Search</span>
                </button>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 text-sm text-luxury-cream/60 hover:text-luxury-gold transition-colors py-2"
                >
                  <Heart size={16} />
                  <span className="uppercase tracking-widest text-[11px]">Wishlist</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-x-0 top-0 z-[100] bg-luxury-black/98 backdrop-blur-md border-b border-luxury-gold/20 py-6 px-4 sm:px-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))]">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border-b border-white/20 py-2">
                <Search className="text-luxury-gold mr-3 shrink-0" size={18} />
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-luxury-cream text-sm tracking-wider placeholder-luxury-cream/30 focus:outline-none"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-luxury-cream/50 hover:text-luxury-gold transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
