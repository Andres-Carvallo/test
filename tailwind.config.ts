// tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        kalam: ["var(--font-kalam)", "cursive"],
        robotoMono: ["var(--font-roboto-mono)", "monospace"],
        oswald: ["var(--font-oswald)", "sans-serif"],
        lato: ["var(--font-lato)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        titulos: {
          DEFAULT: "hsl(var(--titulos))",
          foreground: "hsl(var(--titulos-foreground))",
        },
        botonprimario: {
          DEFAULT: "hsl(var(--botonprimario))",
          foreground: "hsl(var(--botonprimario-foreground))",
        },
        botonsecundario: {
          DEFAULT: "hsl(var(--botonsecundario))",
          foreground: "hsl(var(--botonsecundario-foreground))",
        },
        botonprimariodark: {
          DEFAULT: "hsl(var(--botonprimariodark))",
          foreground: "hsl(var(--botonprimariodark-foreground))",
        },
        botonsecundariodark: {
          DEFAULT: "hsl(var(--botonsecundariodark))",
          foreground: "hsl(var(--botonsecundariodark-foreground))",
        },
        botonprimariolight: {
          DEFAULT: "hsl(var(--botonprimariolight))",
          foreground: "hsl(var(--botonprimariolight-foreground))",
        },
        botonsecundariolight: {
          DEFAULT: "hsl(var(--botonsecundariolight))",
          foreground: "hsl(var(--botonsecundariolight-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
