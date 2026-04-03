/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:     '#0a0e1a',
        card:   '#111827',
        card2:  '#0d1526',
        dark:   '#060c18',
        green:  '#00ffb4',
        teal:   '#00d4ff',
        yellow: '#f5c842',
        red:    '#ff4466',
        purple: '#7c3aed',
        blue:   '#3b82f6',
        sub:    '#64748b',
      },
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
};
