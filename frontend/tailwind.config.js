/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#EA580C",
          600: "#DC2626",
        },
        navy: {
          700: "#1D4ED8",
          800: "#1E3A8A",
          900: "#0F172A",
        }
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      }
    },
  },
  plugins: [],
}
