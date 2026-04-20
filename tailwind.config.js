/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#080a0f',
        cardBg: '#12171f',
        accent: '#fcc419', // Gold
        cyanCustom: '#00d4ff',
        danger: '#ff4757',
        success: '#20C607',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}