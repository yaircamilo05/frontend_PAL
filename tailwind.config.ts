module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode:'media',
    theme: {
      extend: {
        colors: {
          'vue-green': '#42b983',
          'vue-green-dark': '#34495e',
          'vue-gray': '#2c3e50',
          'vue-text-light': '#ecf0f1',
          'vue-gray-light': '#bdc3c7',
        },
      },
    },
    plugins: [],
  };