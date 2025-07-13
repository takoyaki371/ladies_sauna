/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f1',
          100: '#ffdddf',
          200: '#ffc1c6',
          300: '#ff969e',
          400: '#ff5a66',
          500: '#ff2936',
          600: '#ed0b1a',
          700: '#c8070f',
          800: '#a50911',
          900: '#880e14',
          950: '#4b0406',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}