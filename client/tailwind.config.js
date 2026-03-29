/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
     "./index.html",          
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
    fadeUp: {
      '0%': { opacity: 0, transform: 'translateY(22px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    blob: {
      '0%,100%': { transform: 'translate(0,0) scale(1)' },
      '33%': { transform: 'translate(30px,-20px) scale(1.05)' },
      '66%': { transform: 'translate(-20px,20px) scale(0.96)' },
    },
    float: {
      '0%,100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-5px)' },
    },
  },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
