/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FBE9D0',
      navy: '#244856',
      red: '#E74833',
      maroon: '#874F42',
      blue: '#90AEAE',
    },
    extend: {},
  },
  plugins: [],
}
