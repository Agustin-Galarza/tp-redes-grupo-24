import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: [
      {
        find: "#amplify",
        replacement: fileURLToPath(new URL("./amplify", import.meta.url)),
      },
    ],
  },
});
