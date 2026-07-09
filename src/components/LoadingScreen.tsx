import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 600);
    const endTimer = setTimeout(() => onComplete(), 2200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-luxury-black flex flex-col justify-center items-center select-none z-[9999]">
      {!showLogo ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[10px] uppercase tracking-[0.5em] text-luxury-cream/50"
        >
          Loading
        </motion.span>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-4"
        >
          <img
            src="/logo.jpg"
            alt="Al Mashriq"
            className="w-16 h-16 object-contain rounded-full"
          />
          <h1 className="text-xl font-serif text-luxury-gold tracking-[0.3em] uppercase">
            Al Mashriq
          </h1>
        </motion.div>
      )}
    </div>
  );
};
