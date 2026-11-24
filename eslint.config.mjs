import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * House ESLint config — identical in every Next.js repository on github.com/mouminkam.
 *
 * `react-hooks/set-state-in-effect` is a warning rather than an error: it flags mount
 * and sync effects that work today, and each one is tracked in the README's trade-offs.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // CommonJS config and tooling files (jest.config.js, scripts) load modules with require().
    files: ["**/*.js", "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
]);
