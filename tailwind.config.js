/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F7F1E3", // main cream background
        surface: "#FFFFFF", // card surface
        primary: "#1F1F1F", // main text (dark charcoal)
        accent: "#1B1B1E", // active tab bg / high-contrast accent
        muted: "#6B6B66", // secondary/description text
        border: "#D8D2C0", // inactive tab border
        divider: "#ECE6D6", // thin divider lines
        infoBox: "#FBF3D9", // info/alert box background
        brand: "#F2B705", // brand accent (gold/yellow)
        opinionBg: "#FCE79C", // "OPINION" tag background
        opinionText: "#3D3200", // "OPINION" tag text
        link: "#2E7D6B", // link color (e.g. "How?")
        navActive: "#F2B705", // bottom nav active icon circle
        profileBg: "#A88FC2", // profile icon background

        // --- dark theme ---
        darkBackground: "#121212",
        darkSurface: "#1E1E1E",
        darkPrimary: "#F2F2F0",
        darkAccent: "#F2B705", // keeps white button/tab text readable on top
        darkMuted: "#A0A09A",
        darkBorder: "#3A3A36",
        darkDivider: "#2A2A26",
        darkInfoBox: "#2A2610",
        darkOpinionBg: "#4A3F0A",
        darkOpinionText: "#F2E7A8",
        darkLink: "#4FBFA0",
      },
    },
  },
  plugins: [],
};
