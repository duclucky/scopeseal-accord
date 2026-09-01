import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/genlayer-rpc": {
        target: "https://studio.genlayer.com",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/api",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
