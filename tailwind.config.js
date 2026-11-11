/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./custome/index.html",
    "./custome/src/**/*.{js,ts,jsx,tsx}",
    "./*.html",
    "./navbar/**/*.js",
    "./colectiondata/**/*.js",
    "./footer.js",
    "./produk.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#EE0000",
        "background-light": "#FFFFFF",
        "background-dark": "#121212",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
      },
    },
  },
  plugins: [],
}
