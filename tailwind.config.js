/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        'bg-soft': '#0d0d0d',
        surface: '#141413',
        'surface-2': '#1c1c1a',
        white: '#f5f4ef',
        muted: '#95928a',
        'muted-2': '#605e58',
        orange: {
          DEFAULT: '#f2603e',
          dark: '#c8492b',
          light: '#ff6f4a',
          glow: 'rgba(242, 96, 62, 0.28)',
        }
      },
      fontFamily: {
        chakra: ['Chakra Petch', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
