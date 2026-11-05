/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        watch: {
          navy: '#101C2B',
          'navy-dark': '#080D15',
          'navy-light': '#1A293D',
          gold: '#D9A441',
          'gold-light': '#F4CA64',
          'gold-dark': '#B88218',
          'gold-bg': '#FDF8EB',
          dark: '#171717',
          muted: '#64748B',
          light: '#F5F6F8',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px rgba(16, 28, 43, 0.12)',
        'luxury-lg': '0 20px 50px rgba(8, 13, 21, 0.25)',
      }
    },
  },
  plugins: [],
}

