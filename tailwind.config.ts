import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3ff',
          100: '#dde4ff',
          200: '#c2ccff',
          300: '#97a5ff',
          400: '#6b73ff',
          500: '#4a4eff',
          600: '#3a2df7',
          700: '#2f20db',
          800: '#1e1a99',
          900: '#1a1870',
          950: '#0f0e45',
        },
        slate: {
          850: '#1a2332',
        }
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #e8edf5 0%, #d1dae8 25%, #c5d0e0 50%, #dde4ee 75%, #eef1f7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #162033 50%, #1a2744 75%, #0f172a 100%)',
        'gradient-sidebar-light': 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 50%, #b8c6d9 100%)',
        'gradient-sidebar-dark': 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #162033 100%)',
        'gradient-card-light': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(22,32,51,0.8) 100%)',
      },
      boxShadow: {
        'elegant': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'elegant-lg': '0 8px 40px -4px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
        'dark-elegant': '0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 2px 8px -2px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
export default config
