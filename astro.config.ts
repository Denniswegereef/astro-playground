import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel/serverless"
import glsl from "vite-plugin-glsl"

import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [glsl()],
  },
  output: "server",
  adapter: vercel({
    functionPerRoute: false,
  }),
  server: {
    port: 3000,
    host: true,
  },
  integrations: [react()],
})
