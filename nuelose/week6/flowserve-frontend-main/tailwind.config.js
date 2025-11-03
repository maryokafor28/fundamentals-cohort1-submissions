/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightGreen: "#CBFBEB",
        pryGreen: "#14B8A5",
        darkGreen: "#00776F",
        pineGreen: "#19756D",
        normalText: "#1A2A38",
        headingText: "#0A141C",
      },
    },
  },
  plugins: [],
};
