import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
    extend: {
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        geist: ['var(--font-geist-sans)'],
        'geist-mono': ['var(--font-geist-mono)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gradient-start': '#F0EEB4',
        'gradient-end': '#DBA508',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      },
    },
  },
  plugins: [],
} satisfies Config;
