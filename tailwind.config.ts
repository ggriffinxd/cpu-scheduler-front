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
        "background-primary": "var(--background-primary)",
        everwhite: "var(--everwhite)",
        everblack: "var(--everblack)",
      },
    },
  },
  plugins: [],
};

export default config;
