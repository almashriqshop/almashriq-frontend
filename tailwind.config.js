/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0A0A0A',
          charcoal: '#121212',
          darkGray: '#1A1A1A',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#C5A028',
          cream: '#F9F6F0',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-in-slow': 'fadeIn 1.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
