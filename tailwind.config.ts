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
        sans: ['Monoglyphic', 'system-ui', 'sans-serif'],
        display: ['Monoglyphic', 'system-ui', 'sans-serif'],
        comic: ['Monoglyphic', 'Monoglyphic-Black', 'system-ui', 'sans-serif'],
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
