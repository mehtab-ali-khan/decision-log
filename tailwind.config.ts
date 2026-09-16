import type { Config } from "tailwindcss";
import { theme } from "./src/theme";

const EASE_OUT_EXPRESSIVE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      spacing: theme.spacing,
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(-4px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": `fade-in 180ms ${EASE_OUT_EXPRESSIVE} both`,
        "fade-in-up": `fade-in-up 280ms ${EASE_OUT_EXPRESSIVE} both`,
        "scale-in": `scale-in 200ms ${EASE_OUT_EXPRESSIVE} both`,
        "pop-in": `pop-in 140ms ${EASE_OUT_EXPRESSIVE} both`,
        "slide-in-right": `slide-in-right 300ms ${EASE_OUT_EXPRESSIVE} both`,
        "slide-in-bottom": `slide-in-bottom 300ms ${EASE_OUT_EXPRESSIVE} both`,
        shimmer: "shimmer 1.6s linear infinite",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
} as unknown as Config;
