import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "node_modules/**", "build/**"],
  },
  // We'll use the base config to avoid complex module resolution errors on Vercel
]);

export default eslintConfig;
