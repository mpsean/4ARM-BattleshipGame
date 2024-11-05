/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        blanka: ['Blanka', 'sans'],
        museo: ['MuseoModerno', 'sans-serif']
      },
      backgroundImage: {
        'front': "url('assets/images/front-page.png')"
      }
    },
  },
  plugins: [],
}