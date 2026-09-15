import type { Config } from "tailwindcss";
import { theme } from "./src/theme";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.fontFamily,
      borderRadius: theme.borderRadius,
      spacing: theme.spacing,
    },
  },
  plugins: [],
} satisfies Config;
