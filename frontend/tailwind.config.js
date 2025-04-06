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
          light: '#5ece7b',
          DEFAULT: '#4CAF50',
          dark: '#3b8f3e',
        },
      },
    },
  },
  plugins: [],
}
