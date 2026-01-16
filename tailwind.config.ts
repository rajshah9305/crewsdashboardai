import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nexus-orange': '#ff6b00',
        'nexus-orange-light': '#ff8c32',
        'nexus-orange-dark': '#e65100',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #ff6b00, 0 0 10px #ff6b00' },
          '100%': { boxShadow: '0 0 10px #ff6b00, 0 0 20px #ff6b00, 0 0 30px #ff6b00' },
        },
      },
    },
  },
  plugins: [],
}
export default config
