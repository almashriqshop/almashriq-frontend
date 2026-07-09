import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    google?: any;
    handleGoogleSignIn?: (response: any) => void;
  }
}

export const Login: React.FC = () => {
  const { login, apiUrl } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Sign-In callback
  useEffect(() => {
    window.handleGoogleSignIn = async (response: any) => {
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch(`${apiUrl}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });

        if (res.ok) {
          const data = await res.json();
          login(data.token, data.user);
          navigate(redirect);
        } else {
          const err = await res.json();
          setError(err.message || 'Google sign-in failed.');
        }
      } catch (err) {
        setError('Network error with Google sign-in.');
      } finally {
        setLoading(false);
      }
    };

    // Initialize Google Sign-In only if a real Client ID is configured
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const isGoogleConfigured = googleClientId && !googleClientId.includes('your_') && googleClientId.includes('.apps.googleusercontent.com');
    
    if (window.google && isGoogleConfigured) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: window.handleGoogleSignIn,
        });
        
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: 'outline', 
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'pill'
            }
          );
        }
      } catch (err) {
        console.error('Google Init Error:', err);
      }
    }

    return () => {
      delete window.handleGoogleSignIn;
    };
  }, [apiUrl, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginTab ? 'login' : 'register';
    const payload = isLoginTab ? { email, password } : { email, password, fullName };

    try {
      const response = await fetch(`${apiUrl}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user);
        navigate(redirect);
      } else {
        const err = await response.json();
        setError(err.message || 'Authentication failed.');
      }
    } catch (err) {
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 min-h-screen bg-luxury-black pb-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Decorative gold line */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-transparent via-luxury-gold to-transparent" />
        </div>

        <div className="bg-luxury-charcoal/50 border border-white/5 p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6 backdrop-blur-sm rounded-2xl">
          
          {/* Logo and Brand Heading */}
          <div className="text-center space-y-3">
            <img src="/logo.jpg" alt="Al Mashriq" className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full border border-luxury-gold/30 mx-auto" />
            <h1 className="font-serif text-xl sm:text-2xl tracking-[0.3em] text-luxury-gold uppercase">Al Mashriq</h1>
            <span className="text-[9px] uppercase tracking-[0.5em] text-luxury-cream/40 block">
              {isLoginTab ? 'Welcome Back, Connoisseur' : 'Join The Guild'}
            </span>
          </div>

          {/* Google Sign-In Button */}
          {(() => {
            const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
            const isGoogleConfigured = googleClientId && !googleClientId.includes('your_') && googleClientId.includes('.apps.googleusercontent.com');
            
            if (!isGoogleConfigured) return null;
            
            return (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-widest">
                    <span className="bg-luxury-charcoal/50 px-3 text-luxury-cream/40">or continue with email</span>
                  </div>
                </div>
                
                <div ref={googleButtonRef} className="w-full flex justify-center" />
              </div>
            );
          })()}

          {/* Tab switchers */}
          <div className="grid grid-cols-2 border-b border-white/5 text-center">
            <button
              onClick={() => { setIsLoginTab(true); setError(''); }}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all ${
                isLoginTab ? 'text-luxury-gold border-b border-luxury-gold' : 'text-luxury-cream/40 hover:text-luxury-cream'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setError(''); }}
              className={`pb-3 text-xs uppercase tracking-widest font-semibold transition-all ${
                !isLoginTab ? 'text-luxury-gold border-b border-luxury-gold' : 'text-luxury-cream/40 hover:text-luxury-cream'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-500/20 text-red-300 text-[10px] p-3 flex items-start space-x-1.5 uppercase tracking-wider rounded-xl">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none uppercase tracking-wider placeholder-luxury-cream/20 transition-colors rounded-lg"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider placeholder-luxury-cream/20 transition-colors rounded-lg"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-luxury-cream/50">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-luxury-black/50 border border-white/10 px-3 py-2.5 text-xs text-luxury-cream focus:border-luxury-gold focus:outline-none tracking-wider placeholder-luxury-cream/20 transition-colors rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold text-xs py-3.5 font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-t-2 border-luxury-gold animate-spin rounded-full" />
              ) : (
                <>
                  <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-[9px] text-luxury-cream/30 uppercase tracking-widest">
              {isLoginTab ? "Don't have an account? Click Register above." : "Already a member? Click Sign In above."}
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};
