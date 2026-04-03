import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // FastAPI calls — proxied from /api/core/* → http://localhost:8000/api/*
      "/api/core": {
        target: "http://localhost:8000",
        rewrite: (path) => path.replace(/^\/api\/core/, "/api"),
        changeOrigin: true,
      },
      // Node.js calls — proxied from /api/rt/* → http://localhost:3001/api/*
      "/api/rt": {
        target: "http://localhost:3001",
        rewrite: (path) => path.replace(/^\/api\/rt/, "/api"),
        changeOrigin: true,
      },
    },
  },
});
