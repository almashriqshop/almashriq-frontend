import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showLogo, setShowLogo] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show logo shortly after component mounts
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    // End loading screen after 3.2 seconds
    const endTimer = setTimeout(() => onComplete(), 3200);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(endTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  // Smoke & floating particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Classes
    class SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = width / 2 + (Math.random() * 40 - 20);
        this.y = height + 20;
        this.vx = Math.random() * 0.8 - 0.4;
        this.vy = -(Math.random() * 1.5 + 0.8);
        this.alpha = 0;
        this.size = Math.random() * 60 + 30;
        this.color = `212, 175, 55`; // Gold tinted smoke
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Fade in first, then fade out
        if (this.y > height * 0.7) {
          this.alpha = Math.min(this.alpha + 0.01, 0.12);
        } else if (this.y < height * 0.4) {
          this.alpha = Math.max(this.alpha - 0.003, 0);
        } else {
          this.alpha = Math.min(this.alpha, 0.12);
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        
        const gradient = c.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(0, 0, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class FloatingStar {
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.3 + 0.1;
        this.alpha = Math.random() * 0.6;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y -= this.speed;
        this.twinkleOffset += this.twinkleSpeed;
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        const twinkle = Math.sin(this.twinkleOffset) * 0.3 + 0.7;
        const currentAlpha = this.alpha * twinkle;
        c.fillStyle = `rgba(243, 229, 171, ${currentAlpha})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    const smokeParticles: SmokeParticle[] = [];
    const stars: FloatingStar[] = Array.from({ length: 50 }, () => new FloatingStar());

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach((star) => {
        star.update();
        star.draw(ctx);
      });

      // Spawn smoke
      if (Math.random() < 0.12 && smokeParticles.length < 50) {
        smokeParticles.push(new SmokeParticle());
      }

      // Draw smoke
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.update();
        p.draw(ctx);
        if (p.y < -100 || p.alpha <= 0) {
          smokeParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-luxury-black overflow-hidden flex flex-col justify-center items-center select-none z-[9999]">
      {/* Dynamic smoke & floating amber points background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Gold radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Cinematic Logo reveal */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center z-10"
          >
            {/* Logo image containing the gold crest */}
            <motion.div 
              initial={{ filter: 'brightness(0)' }}
              animate={{ filter: 'brightness(1)' }}
              transition={{ duration: 1.8, delay: 0.2 }}
              className="relative w-48 h-48 md:w-56 md:h-56 mb-8 flex justify-center items-center"
            >
              {/* Gold Shimmer effect behind the logo */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] rounded-full filter blur-xl animate-pulse" />
              <img 
                src="/logo.jpg" 
                alt="Al Mashriq Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              />
            </motion.div>

            {/* Cinematic text reveal */}
            <motion.h1
              initial={{ letterSpacing: '0.2em', opacity: 0 }}
              animate={{ letterSpacing: '0.4em', opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              className="text-2xl md:text-3xl font-serif text-luxury-gold uppercase tracking-widest text-center"
            >
              Al Mashriq
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-xs uppercase tracking-[0.5em] text-luxury-cream/70 mt-3 font-sans font-light"
            >
              Crafting Luxury
            </motion.p>

            {/* Premium loading bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="mt-8 w-32 h-[1px] bg-white/10 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-luxury-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
