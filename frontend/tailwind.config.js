/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        brandBlack: "#1d1d1f",
        brandGray: "#f5f5f7",
        brandRed: "#FF3B30",
      },
    },
  },
  plugins: [],
};
