/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#edf7e2', 100: '#d5f5a4', 200: '#b8e17e', 300: '#93c85b', 400: '#70ad45', 500: '#47713a', 600: '#176b50', 700: '#145b45', 800: '#124b3d', 900: '#103c34' },
        brand: { light: '#edf7e2', DEFAULT: '#176b50', dark: '#103c34' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
