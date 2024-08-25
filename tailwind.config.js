import { Slide } from 'react-toastify'
import { Transform } from 'stream'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        black:{
          100: "#17153B",
          200: "#1E0342",
          300: "#45146e",
          400: "#26355D",
        },
        gray:{
          100: "#35374B",
          200: "#222831",
          300: "#F5F7F8"
        },
        purple: {
          100: "#C8ACD6"
        }
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '50%': { opacity:0.5 },
          '100%': { opacity: 0 },
        },
        slideUp: {
          '0%': {
            tranform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-50%)'
          },
          '100%': {
            transform: 'translateY(-110%)'
          }
        }
      },

      animation: {
        slideDown: 'slideDown 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-in-out',
        fadeOut: 'fadeOut 2s ease-in-out'
      },
      transition: {
        fadeOut: 'fadeOut 2s ease-in-out'
      }

    },
  },
  plugins: [
    function ({addUtilities}) {
      const newUtilities = {
        ".scrollbar-thin" : {
          scrollbarWidth: "thin",
          scrollbarColor: "#C8ACD6 rgba(208, 219, 242, 0.1)"
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar" : {
            width: "5px",
          },
          "&::-webkit-scrollbar-track" : {
            background: "white"
          },
          "&::-webkit-scrollbar-thumb" : {
            backgroundColor: "rgba(208, 219, 242, 0.1)",
            borderRadius: "20px",
            border: "1px solid #C8ACD6"
          }
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }


  ],
}

