import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#41463D",
        lavender: "#9D8DF1",
        "ice-blue": "#B8CDF8",
        mint: "#95F2D9",
        "neon-mint": "#1CFEBA",
        brand: {
          charcoal: "#41463D",
          lavender: "#9D8DF1",
          "ice-blue": "#B8CDF8",
          mint: "#95F2D9",
          "neon-mint": "#1CFEBA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
