/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FAFBFC", // light background color
        surface: "#FFFFFF", // surface
        primary: "#0F1B2D", // primary color
        accent: "#1E5F8C", // buton, active link color
        muted: "#64748B", // muted text color
        border: "#E2E8F0", // border color
      },
    },
  },
  plugins: [],
};
