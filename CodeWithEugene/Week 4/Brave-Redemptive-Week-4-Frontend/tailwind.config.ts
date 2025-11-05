import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#d9e9ff",
          200: "#b8d5ff",
          300: "#90baff",
          400: "#5c96ff",
          500: "#336dff",
          600: "#1f51e6",
          700: "#163dc0",
          800: "#16369c",
          900: "#172f7d"
        }
      }
    }
  },
  plugins: []
};

export default config;
