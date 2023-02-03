import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import glsl from "vite-plugin-glsl";
// Vite v4 does not work on Framed
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    glsl(),
    preact(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
