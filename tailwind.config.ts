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
        sans: ['"Comic Sans MS"', 'Comic Sans', 'cursive', 'sans-serif'],
        display: ['"Comic Sans MS"', 'Comic Sans', 'cursive', 'sans-serif'],
        comic: ['"Comic Sans MS"', 'Comic Sans', 'cursive', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#FF4800',
          'orange-deep': '#D83D00',
          peach: '#FFEEE4',
        },
      },
    },
  },
  plugins: [],
};
