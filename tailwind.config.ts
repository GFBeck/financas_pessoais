import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        omni: {
          background: '#191622',
          foreground: '#E1E1E6',
          current: '#44475a',
          comment: '#6272a4',
          cyan: '#78D1E1',
          green: '#67E480',
          orange: '#E89E64',
          pink: '#FF79C6',
          purple: '#988BC7',
          red: '#E96379',
          yellow: '#E7DE79',
        }
      }
    },
  },
  plugins: [],
}
export default config
