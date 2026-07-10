import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, ShoppingBag, User, X, LogOut, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 26);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-luxury-gold text-luxury-black py-[5px] px-4 text-center">
        <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em]">
          EXQUISITE CRAFTSMANSHIP — NOW SHIPPING ALL OVER INDIA
        </p>
      </div>

      {/* Main Header */}
      <nav
        className={`fixed left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'top-0 bg-luxury-black border-b border-white/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
            : 'top-[26px] bg-luxury-black/90 backdrop-blur-md border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-[52px] md:h-[56px] lg:h-[60px]">

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`relative text-[10.5px] uppercase tracking-[0.18em] transition-colors duration-300 font-medium py-2 ${
                      isActive
                        ? 'text-luxury-gold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile left: hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center -ml-2 text-white/60 hover:text-white transition-colors"
              aria-label="Menu"
            >
              <div className="w-[18px] flex flex-col items-end gap-[5px]">
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-full rotate-45 translate-y-[3.25px]' : 'w-full'}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 w-0' : 'w-[70%]'}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-300 ${isMobileMenuOpen ? 'w-full -rotate-45 -translate-y-[3.25px]' : 'w-[85%]'}`} />
              </div>
            </button>

            {/* Logo (Center) */}
            <div className="flex-1 flex justify-center lg:justify-center">
              <Link to="/">
                <span className="font-serif text-[15px] md:text-[17px] lg:text-[19px] tracking-[0.2em] md:tracking-[0.28em] uppercase text-luxury-gold">
                  Al Mashriq
                </span>
              </Link>
            </div>

            {/* Mobile right: cart + user */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={onCartToggle}
                className="relative w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-luxury-gold text-luxury-black text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Desktop right icons */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                to="/wishlist"
                className="relative w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-luxury-gold text-luxury-black text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={onCartToggle}
                className="relative w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-luxury-gold text-luxury-black text-[8px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="w-[1px] h-5 bg-white/10 mx-1" />

              {isAdmin && (
                <Link to="/admin" className="w-10 h-10 flex items-center justify-center text-luxury-gold/50 hover:text-luxury-gold transition-colors duration-300" title="Admin">
                  <ShieldAlert size={18} strokeWidth={1.5} />
                </Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center">
                  <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300" aria-label="Dashboard">
                    <User size={18} strokeWidth={1.5} />
                  </Link>
                  <button onClick={logout} className="w-10 h-10 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors duration-300" title="Logout">
                    <LogOut size={15} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-300" aria-label="Login">
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[55] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-luxury-black z-[60] lg:hidden flex flex-col border-r border-white/[0.06]"
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-5 h-[52px] border-b border-white/[0.06]">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-serif text-sm tracking-[0.2em] uppercase text-luxury-gold">Al Mashriq</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile nav links */}
              <div className="flex-1 overflow-y-auto py-3">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`flex items-center px-5 py-3 text-[13px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                        isActive
                          ? 'text-luxury-gold bg-white/[0.03]'
                          : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mx-5 my-3 h-[1px] bg-white/[0.06]" />

                <button
                  onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3 text-[13px] uppercase tracking-[0.15em] text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <Search size={16} strokeWidth={1.5} />
                  Search
                </button>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-5 py-3 text-[13px] uppercase tracking-[0.15em] text-white/50 hover:text-white hover:bg-white/[0.02] transition-colors duration-200"
                >
                  <Heart size={16} strokeWidth={1.5} />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="ml-auto bg-luxury-gold text-luxury-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile menu footer */}
              <div className="px-5 py-4 border-t border-white/[0.06]">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-white/50 hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={15} strokeWidth={1.5} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-white/30 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={15} strokeWidth={1.5} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-[11px] uppercase tracking-[0.18em] text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={14} strokeWidth={1.5} />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-[100]"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="w-full bg-luxury-black border-b border-white/[0.06]" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-3xl mx-auto px-5 py-5">
                <div className="flex items-center gap-4">
                  <Search className="text-white/30 shrink-0" size={20} strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for perfumes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchSubmit(e);
                      if (e.key === 'Escape') setIsSearchOpen(false);
                    }}
                    className="w-full bg-transparent border-none text-white text-base tracking-wide placeholder-white/25 focus:outline-none"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="shrink-0 w-9 h-9 flex items-center justify-center text-white/30 hover:text-white transition-colors"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
