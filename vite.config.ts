// vite.config.ts  (at the repo root)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // point Vite to the React app folder
  root: resolve(__dirname, "client"),

  plugins: [react()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "attached_assets")
    }
  },

  build: {
    // output to client/dist so Vercel can serve it
    outDir: resolve(__dirname, "client", "dist"),
    emptyOutDir: true
  }
});
