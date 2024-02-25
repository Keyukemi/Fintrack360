/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#1d7334',
        headline: "#ffffff",
        paragraph: "#1c2d35",
        highlight: "#e0e1e0",
        secondary: "#8b9592",
        tertiary: "#748974",
      }
    },
  },
  plugins: [],
}