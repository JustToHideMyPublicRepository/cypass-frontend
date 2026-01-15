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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        textClr: 'var(--color-text)',
        danger: 'var(--color-danger)',
        dangerAct: 'var(--color-dangerAct)',
        bgClr: 'var(--color-background)',
        WtB: 'var(--color-WtB)',
        WtBAct: 'var(--color-WtBAct)',
        BtW: 'var(--color-BtW)',
        BtWAct: 'var(--color-BtWAct)',
        ash: 'var(--color-ash)',
        ashAct: 'var(--color-ashAct)',
        hsa: 'var(--color-hsa)',
        hsaAct: 'var(--color-hsaAct)',


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
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'fade-down': 'fade-down 0.8s ease-out forwards',
        'fade-left': 'fade-left 0.8s ease-out forwards',
        'fade-right': 'fade-right 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
