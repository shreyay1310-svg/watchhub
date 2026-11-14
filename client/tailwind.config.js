/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          bg: '#050816',          // Deep Midnight Navy
          surface: '#0B1022',     // Secondary Surface Background
          card: '#10182D',        // Futuristic Card Background
          cardGlass: 'rgba(16, 24, 45, 0.75)',
          purple: '#A855F7',      // Neon Purple
          blue: '#00CFFF',        // Electric Blue
          cyan: '#00F0FF',        // Neon Cyan
          pink: '#FF35C8',        // Neon Pink
          gold: '#F4B942',        // Champagne Gold
          green: '#39F5A5',       // Neon Green
          red: '#FF4567',         // Danger Red
          text: '#F8FAFC',        // Primary Light Text
          muted: '#A6B1C8',       // Secondary Slate Text
          border: 'rgba(255, 255, 255, 0.1)',
          borderGlow: 'rgba(0, 207, 255, 0.3)',
        },
        watch: {
          navy: '#050816',
          'navy-dark': '#03050C',
          'navy-light': '#0B1022',
          gold: '#F4B942',
          'gold-light': '#FDE047',
          'gold-dark': '#D97706',
          'gold-bg': '#10182D',
          dark: '#F8FAFC',
          muted: '#A6B1C8',
          light: '#050816',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'neon-purple': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'neon-gold': '0 0 20px -3px rgba(244, 185, 66, 0.35)',
        'neon-pink': '0 0 20px -3px rgba(255, 53, 200, 0.35)',
        'neon-green': '0 0 20px -3px rgba(57, 245, 165, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(0, 207, 255, 0.15)',
        'luxury': '0 10px 30px rgba(5, 8, 22, 0.5)',
        'luxury-lg': '0 20px 50px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'border-beam': 'borderBeam 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        borderBeam: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}
