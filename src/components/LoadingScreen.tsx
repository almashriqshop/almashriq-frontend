import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 400);
    const endTimer = setTimeout(() => onComplete(), 2800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 12 + 4;
      });
    }, 150);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(endTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-luxury-black flex flex-col justify-center items-center select-none z-[9999]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-6"
      >
        <img
          src="/logo.jpg"
          alt="Al Mashriq"
          className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full"
        />
        <h1 className="text-2xl md:text-3xl font-serif text-luxury-gold tracking-[0.35em] uppercase">
          Al Mashriq
        </h1>

        {/* Loading bar */}
        <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden mt-4">
          <div
            className="absolute inset-y-0 left-0 bg-luxury-gold transition-all duration-200 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};
