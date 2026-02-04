import type { Config } from 'tailwindcss'

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./assets/css/main.css",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        textClr: 'rgb(var(--color-text) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        successAct: 'rgb(var(--color-successAct) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        warningAct: 'rgb(var(--color-warningAct) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        dangerAct: 'rgb(var(--color-dangerAct) / <alpha-value>)',
        bgClr: 'rgb(var(--color-background) / <alpha-value>)',
        WtB: 'rgb(var(--color-WtB) / <alpha-value>)',
        WtBAct: 'rgb(var(--color-WtBAct) / <alpha-value>)',
        BtW: 'rgb(var(--color-BtW) / <alpha-value>)',
        BtWAct: 'rgb(var(--color-BtWAct) / <alpha-value>)',
        ash: 'rgb(var(--color-ash) / <alpha-value>)',
        ashAct: 'rgb(var(--color-ashAct) / <alpha-value>)',
        hsa: 'rgb(var(--color-hsa) / <alpha-value>)',
        hsaAct: 'rgb(var(--color-hsaAct) / <alpha-value>)',
      },

      fontFamily: {
        heading: ['Montserrat', 'Roboto'],
        body: ['Inter', '"Open Sans"'],
        code: ['"JetBrains+Mono"', '"Fira+Code"']
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
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
