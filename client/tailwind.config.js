/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        card: '#1a1d27',
        accent: '#00d4ff',
        'severity-critical': '#ff4444',
        'severity-high': '#ff8800',
        'severity-medium': '#ffcc00',
        'severity-low': '#44bb44',
        'severity-info': '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
