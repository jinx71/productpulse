/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // App accent — Coral (ProductPulse).
        coral: {
          50: '#FFF1EE',
          100: '#FFE3DD',
          200: '#FFC7BB',
          300: '#FFA593',
          400: '#FF8369',
          500: '#FF6B5C',
          600: '#F04E37',
          700: '#C93C28',
          800: '#A03124',
          900: '#7E2A20',
        },
        // Neutral grays (slate) for text, borders, surfaces.
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 28px -10px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};
