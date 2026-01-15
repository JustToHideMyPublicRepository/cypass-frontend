/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        cypass: {
          blue: '#1e3a8a', // Deep security blue
          green: '#059669', // Certified green
          dark: '#0f172a',
          light: '#f8fafc',
        }
      },

      fontFamily: {
        heading: ['Montserrat', 'Roboto', 'sans-serif'],
        body: ['Inter', '"Open Sans"', 'sans-serif'],
        code: ['"JetBrains+Mono"', '"Fira+Code"', 'sans-serif']
      },
    },
  },
  plugins: [],
}
