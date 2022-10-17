/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d9488",
        primaryLight: "#ccfbf1",
        primaryDark: "#061716",
        secondary: "#f43f5e",
        secondaryLight: "#ffe4e6",
        secondaryDark: "#171717",
        contentLight: "#0f172a",
        contentDark: "#f1f5f9",
        success: "#16a34a",
        danger: "#ed3737",
        warning: "#eab308",
      },
    },
  },
  plugins: [],
};
