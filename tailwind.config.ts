import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#e5cdbb",
        dark: "#a98d82",
        rosado: "#e5cdbb",
        celeste: "#8bafdc",
        cafe: "#a98d82",
        secondary: "#ffde59",
        succes: "#9fff33 ",
        danger: "#C70039 ",
        warning: "#FFC300 ",
      },
      fontFamily: {
        // 👇 Add CSS variables
        mono: ["var(--font-roboto-mono)"],
        kalam: ["var(--font-kalam)"],
        oswald: ["var(--font-oswald)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "login-bg": "url('/img/bg-login.png')",
      },
    },
  },
  plugins: [],
};
export default config;
