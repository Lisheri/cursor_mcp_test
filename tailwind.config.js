/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ebff',
          100: '#b3c2ff',
          200: '#809aff',
          300: '#4d72ff',
          400: '#1a49ff',
          500: '#0031e6',
          600: '#0026b3',
          700: '#001a80',
          800: '#00134d',
          900: '#00071a',
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
} 