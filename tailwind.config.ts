/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vue-green': '#42b983',
        'vue-green-dark': '#34495e',
        'vue-gray-input': '#373737',
        'vue-text-light': '#ecf0f1',
        'vue-gray-light': '#bdc3c7',
        'custom-gray': '#373737', 
      },
    },
  },
  plugins: [],
}
