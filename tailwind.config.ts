import type { Config } from "tailwindcss";

/**
 * Color, font, and radius tokens live in `src/app/globals.css` via Tailwind
 * v4's `@theme` — the single source of truth shared in architecture with
 * the admin dashboard. This file only declares content globs.
 */
const config = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/context/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/lib/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/store/**/*.{js,jsx,ts,tsx,mdx}",
  ],
} satisfies Config;

export default config;
