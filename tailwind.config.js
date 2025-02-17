const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Habilitar el modo oscuro basado en clases
  theme: {
    extend: {},
  },
  plugins: [],
});