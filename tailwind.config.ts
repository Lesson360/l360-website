/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Comic Sans MS"', '"Comic Sans"', '"Comic Neue"', 'cursive', 'sans-serif'],
        display: ['"Comic Sans MS"', '"Comic Sans"', '"Comic Neue"', 'cursive', 'sans-serif'],
        comic: ['"Comic Sans MS"', '"Comic Sans"', '"Comic Neue"', 'cursive', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FFB085',
          'orange-deep': '#F4976C',
          peach: '#FFF1E6',
          purple: '#C8B6E2',
          lavender: '#E8D7F1',
          pink: '#FFC6FF',
          blue: '#B5E2FA',
          mint: '#C7F9CC',
          yellow: '#FFFAA0',
        },
      },
    },
  },
  plugins: [],
};
