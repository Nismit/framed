import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import glsl from "vite-plugin-glsl";
// Framed runs on an Old Chronium version
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
