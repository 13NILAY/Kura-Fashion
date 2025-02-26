/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // xl:1280px
  // lg:1024px 
  // md:768px
  // sm:640px
  theme: {
    extend: {
      screens:{
        'mobileL':"430px",
        'mobileM':"385px",
        'mobileS':"320px"
      },
      colors:{
        background:"#fefefe",
        typography:"#444444",
        primary:"#09814A",
        bannerBG:"#EEF1F8"
      },
      fontFamily:{
        headings: ["Noto Serif", "serif"],
        texts:[ "Raleway", "sans-serif"]
      },
      padding:{
        'sectionPadding':'5rem',
        'mobileScreenPadding':'3rem'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}