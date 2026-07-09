import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = prev < 60 ? Math.random() * 18 + 8 : Math.random() * 6 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onComplete(), 400);
      }, 200);
      return () => clearTimeout(fadeTimer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-luxury-black z-[9999] flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <img
              src="/logo.jpg"
              alt="Al Mashriq"
              className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full"
            />
            <h1 className="mt-5 text-xl md:text-2xl font-serif text-luxury-gold tracking-[0.35em] uppercase">
              Al Mashriq
            </h1>
          </div>

          {/* Full-width progress bar at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
            <div
              className="h-full bg-luxury-gold transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
