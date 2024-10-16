import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dark-purple": "#a445eb",
        "light-purple": "#e9d0fa",
        "black": "#343434",
        "gray": "#5a5a59",
        "light-gray": "#848484",
        "very-light-gray": "#f4f4f4"
    
      
      },
    },
  },
  plugins: [],
};
export default config;
