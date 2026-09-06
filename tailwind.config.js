/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00362a",
        "primary-container": "#134e3f",
        "primary-fixed": "#b5efda",
        "primary-fixed-dim": "#99d2be",
        "on-primary": "#ffffff",
        "on-primary-container": "#86beab",
        "on-primary-fixed": "#002018",
        
        "secondary": "#904d00",
        "secondary-container": "#fe932c",
        "secondary-fixed": "#ffdcc3",
        "secondary-fixed-dim": "#ffb77d",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#663500",
        "on-secondary-fixed": "#2f1500",
        
        "tertiary": "#003625",
        "tertiary-container": "#004f38",
        "tertiary-fixed": "#97f5cc",
        "tertiary-fixed-dim": "#7bd8b1",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#66c49d",

        "surface": "#faf8ff",
        "surface-dim": "#d2d9f4",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "on-surface": "#131b2e",
        "on-surface-variant": "#404945",
        
        "inverse-surface": "#283044",
        "inverse-on-surface": "#eef0ff",
        "inverse-primary": "#99d2be",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        
        "outline": "#707975",
        "outline-variant": "#bfc9c3",
      },
      fontFamily: {
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        code: ["Inter", "monospace"],
      },
    },
  },
  plugins: [],
}
