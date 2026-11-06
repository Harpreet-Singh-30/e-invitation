/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fad0d4',
          300: '#f6a8af',
          400: '#f0758a',
          500: '#e54666',
          600: '#d12a50',
          700: '#af1d43',
          800: '#921b3e',
          900: '#7d1a3a',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      }
    },
  },
  plugins: [],
}
