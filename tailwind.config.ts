import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas & Surfaces (Modern Academic "Ink & Canvas")
        background: "#fbf8fb",
        surface: "#fbf8fb",
        "surface-dim": "#dcd9dc",
        "surface-bright": "#fbf8fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f5",
        "surface-container": "#f0edf0",
        "surface-container-high": "#eae7ea",
        "surface-container-highest": "#e4e2e4",
        "surface-variant": "#e4e2e4",
        "surface-tint": "#535e7a",

        // Text & Contrast
        "on-background": "#1b1b1d",
        "on-surface": "#1b1b1d",
        "on-surface-variant": "#45464d",
        "inverse-surface": "#303032",
        "inverse-on-surface": "#f3f0f2",
        outline: "#76777e",
        "outline-variant": "#c6c6ce",

        // Primary (Ink Anchor)
        primary: "#010a22",
        "on-primary": "#ffffff",
        "primary-container": "#16213a",
        "on-primary-container": "#7e88a7",
        "primary-fixed": "#d9e2ff",
        "primary-fixed-dim": "#bbc6e7",
        "on-primary-fixed": "#101b34",
        "on-primary-fixed-variant": "#3c4661",
        "inverse-primary": "#bbc6e7",

        // Secondary (Trail Accent / Growth Action)
        secondary: "#1a6a5b",
        "on-secondary": "#ffffff",
        "secondary-container": "#a7f1de",
        "on-secondary-container": "#237061",
        "secondary-fixed": "#a7f1de",
        "secondary-fixed-dim": "#8bd4c3",
        "on-secondary-fixed": "#00201a",
        "on-secondary-fixed-variant": "#005144",

        // Tertiary (Scholar Gold / Gamified Achievement)
        tertiary: "#110a00",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#2e1f00",
        "on-tertiary-container": "#ac8225",
        "tertiary-fixed": "#ffdea4",
        "tertiary-fixed-dim": "#f0bf5c",
        "on-tertiary-fixed": "#261900",
        "on-tertiary-fixed-variant": "#5d4200",

        // Error / Alert
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // High-level brand aliases
        canvas: "#F3F4EE",
        ink: "#16213A",
        trail: "#2F7A6B",
        gold: "#C89B3C",
      },
      borderRadius: {
        DEFAULT: "0.25rem", // 4px
        sm: "0.125rem", // 2px
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        full: "9999px",
      },
      spacing: {
        unit: "8px",
        "container-max-width": "1280px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "trail-width": "4px",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        "display-lg": ["'Source Serif 4'", "serif"],
        "headline-lg": ["'Source Serif 4'", "serif"],
        "headline-lg-mobile": ["'Source Serif 4'", "serif"],
        "headline-md": ["'Source Serif 4'", "serif"],
        "headline-sm": ["'Source Serif 4'", "serif"],
        "body-lg": ["'Inter'", "sans-serif"],
        "body-md": ["'Inter'", "sans-serif"],
        "body-sm": ["'Inter'", "sans-serif"],
        "label-md": ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(22, 33, 58, 0.05)",
        card: "0 2px 8px -2px rgba(22, 33, 58, 0.06)",
        ambient: "0 4px 16px rgba(22, 33, 58, 0.08)",
        modal: "0 12px 32px -4px rgba(22, 33, 58, 0.16)",
      },
      animation: {
        "pulse-subtle": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
