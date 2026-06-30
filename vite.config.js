import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import flowbiteReact from "flowbite-react/plugin/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    flowbiteReact(),
  ],
})
