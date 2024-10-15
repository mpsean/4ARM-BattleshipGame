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
        blanka: ['blanka', 'sans']
      },
      backgroundImage: {
        'front': "url('assets/images/front-page.png')"
      }
    },
  },
  plugins: [],
}