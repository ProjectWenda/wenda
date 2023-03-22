/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-gray": "#32373a",
        "disc-light-blue": "#7289da",
        "disc-blue": "#5865f2",
        "disc-dark-1": "#424549",
        "disc-dark-2": "#36393e",
        "disc-dark-3": "#282b30",
        "disc-dark-4": "#1e2124",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};
