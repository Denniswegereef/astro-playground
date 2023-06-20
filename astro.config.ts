import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import glsl from "vite-plugin-glsl";
import node from "@astrojs/node";


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [glsl()]
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});