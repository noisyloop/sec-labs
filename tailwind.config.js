/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f12',
        surface: '#13161b',
        elevated: '#1a1e25',
        border: '#272c35',
        primary: '#e2e8f0',
        muted: '#8b95a5',
        faint: '#5a6473',
        accent: '#00d4ff',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
