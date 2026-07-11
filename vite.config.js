import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import glsl from "vite-plugin-glsl"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    glsl()
  ],
})
