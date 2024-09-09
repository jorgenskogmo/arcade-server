const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "src/**/*.{js,ts,html,css,scss}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      primary: colors.violet,
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "dracula"],
  },
};
