import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel/serverless"
import glsl from "vite-plugin-glsl"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [glsl()],
  },
  output: "server",
  adapter: vercel(),
  server: { port: 3000, host: true },
})
