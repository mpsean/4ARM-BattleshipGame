/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        blanka: ['Blanka', 'sans'],
        museo: ['MuseoModerno', 'sans-serif']
      },
      backgroundImage: {
        'front': "url('assets/images/front-page.png')"
      },
      screens: {
        'xxsm': '270px',
        'xsm': '380px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'lgxl': '1100px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}