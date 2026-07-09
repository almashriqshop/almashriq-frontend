import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const endTimer = setTimeout(() => onComplete(), 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev < 70 ? Math.random() * 20 + 10 : Math.random() * 5 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => {
      clearTimeout(endTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-luxury-black flex flex-col justify-center items-center z-[9999]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center space-y-5"
      >
        <img
          src="/logo.jpg"
          alt="Al Mashriq"
          className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-full"
        />
        <h1 className="text-lg md:text-2xl font-serif text-luxury-gold tracking-[0.35em] uppercase">
          Al Mashriq
        </h1>
      </motion.div>

      {/* Thin progress bar at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 md:w-32">
        <div className="h-[1px] bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-luxury-gold transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
