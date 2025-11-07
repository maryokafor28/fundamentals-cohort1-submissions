// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      

      // then add your custom ones
      brand: "#38bdf8",
    },
  },
  plugins: [],
} satisfies Config;
