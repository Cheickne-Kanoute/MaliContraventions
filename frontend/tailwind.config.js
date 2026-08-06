/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mali-green': '#008751',
        'mali-yellow': '#FCD116',
        'mali-red': '#CE1126',
        'mali-dark': '#0a3622', // Dark green for sidebar/login background
      },
    },
  },
  plugins: [],
}
