import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { LoadingScreen } from './components/LoadingScreen';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductPage } from './pages/ProductPage';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { About, Contact, Collections, Blog, FAQ, NotFound, LegalPages } from './pages/StaticPages';

import { useAuth } from './context/AuthContext';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, apiUrl } = useAuth();
  const [socialLinks, setSocialLinks] = useState({
    instagram: '', facebook: '', twitter: '', youtube: '', tiktok: '', pinterest: ''
  });

  // Fetch social links from settings
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await fetch(`${apiUrl}/settings`);
        if (res.ok) {
          const data = await res.json();
          setSocialLinks({
            instagram: data.instagram || '',
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            youtube: data.youtube || '',
            tiktok: data.tiktok || '',
            pinterest: data.pinterest || ''
          });
        }
      } catch (err) { console.error(err); }
    };
    fetchSocialLinks();
  }, [apiUrl]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-luxury-black text-luxury-cream">
      
      {/* Top Banner announcement */}
      <div className="bg-luxury-gold text-luxury-black py-1.5 px-4 text-center text-[9px] font-bold uppercase tracking-[0.25em] z-50">
        EXQUISITE CRAFTSMANSHIP — DIRECT DELIVERIES TO HYDERABAD METRO ONLY
      </div>

      {/* Navigation */}
      <Navbar onCartToggle={() => setIsCartOpen(true)} />

      {/* Cart Slider Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Main Pages */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin panel routing protection */}
          <Route 
            path="/admin" 
            element={
              isAdmin ? <AdminDashboard /> : (
                <div className="pt-32 text-center min-h-screen bg-luxury-black flex flex-col justify-center items-center px-6">
                  <AlertCircle className="text-red-500 mb-4 animate-bounce" size={40} />
                  <h1 className="font-serif text-3xl mb-2 text-luxury-cream">Privilege Access Required</h1>
                  <p className="text-xs uppercase tracking-widest text-luxury-cream/45 mb-8">This terminal is restricted to Al Mashriq directors only.</p>
                  <Link to="/login?redirect=/admin" className="btn-gold text-[10px] py-2.5">Login as Admin</Link>
                </div>
              )
            } 
          />
          
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Legal documents */}
          <Route path="/privacy" element={<LegalPages type="privacy" />} />
          <Route path="/refund" element={<LegalPages type="refund" />} />
          <Route path="/terms" element={<LegalPages type="terms" />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Premium Footer */}
      <footer className="bg-luxury-charcoal border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-12">
          
          {/* Brand and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="" className="w-8 h-8 rounded-full border border-luxury-gold/30 object-contain" />
              <span className="font-serif text-md tracking-[0.25em] uppercase text-luxury-gold">Al Mashriq</span>
            </Link>
            <p className="text-[10px] uppercase text-luxury-cream/50 tracking-wider leading-relaxed font-light">
              An ultra-luxury fragrance house dedicated to the art of pure agarwood distilling, Mysore sandalwood curing, and absolute organic perfumery.
            </p>
          </div>

          {/* Column: Vaults */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-widest">Vaults</h4>
            <div className="flex flex-col space-y-2 text-[10px] uppercase tracking-widest text-luxury-cream/60">
              <Link to="/shop?category=oudh" className="hover:text-luxury-gold transition-colors">Oudh Reserves</Link>
              <Link to="/shop?category=woody" className="hover:text-luxury-gold transition-colors">Woody Sanctuary</Link>
              <Link to="/shop?category=jasmine" className="hover:text-luxury-gold transition-colors">Jasmine absolute</Link>
            </div>
          </div>

          {/* Column: Concierge */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-widest">Concierge</h4>
            <div className="flex flex-col space-y-2 text-[10px] uppercase tracking-widest text-luxury-cream/60">
              <Link to="/about" className="hover:text-luxury-gold transition-colors">The House story</Link>
              <Link to="/faq" className="hover:text-luxury-gold transition-colors">General Inquiries</Link>
              <Link to="/contact" className="hover:text-luxury-gold transition-colors">Private Booking</Link>
              <Link to="/blog" className="hover:text-luxury-gold transition-colors">Journal Logs</Link>
            </div>
          </div>

          {/* Column: Legal */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-widest">Policies</h4>
            <div className="flex flex-col space-y-2 text-[10px] uppercase tracking-widest text-luxury-cream/60">
              <Link to="/privacy" className="hover:text-luxury-gold transition-colors">Discretion Act</Link>
              <Link to="/refund" className="hover:text-luxury-gold transition-colors">Exchange Policy</Link>
              <Link to="/terms" className="hover:text-luxury-gold transition-colors">Deliveries Scope</Link>
            </div>
          </div>

        </div>

        {/* Social Media Links */}
        {(socialLinks.instagram || socialLinks.facebook || socialLinks.twitter || socialLinks.youtube || socialLinks.tiktok || socialLinks.pinterest) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span>Instagram</span>
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Facebook</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>Twitter / X</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YouTube</span>
                </a>
              )}
              {socialLinks.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  <span>TikTok</span>
                </a>
              )}
              {socialLinks.pinterest && (
                <a href={socialLinks.pinterest} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest text-luxury-cream/50 hover:text-luxury-gold transition-colors flex items-center space-x-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>
                  <span>Pinterest</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Fine print */}
        <div className="border-t border-white/5 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.25em] text-luxury-cream/40 gap-4">
          <span>&copy; 2026 Al Mashriq Perfumes Ltd. All rights reserved.</span>
          <span>Bespoke Distillation. Delivered in Hyderabad Limits only.</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
