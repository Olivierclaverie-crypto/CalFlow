import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { readFileSync, writeFileSync } from "fs";

function swVersionPlugin() {
  return {
    name: "sw-version",
    config() {
      const swPath = "./public/sw.js";
      let sw = readFileSync(swPath, "utf-8");
      sw = sw.replace(/__TIMESTAMP__/, Date.now());
      writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  plugins: [react(), swVersionPlugin()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
