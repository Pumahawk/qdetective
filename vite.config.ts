import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/qdetective/",
  server: {
    proxy: {
      "/status": {
        target: "http://localhost:8080",
      },
    },
  },
});
