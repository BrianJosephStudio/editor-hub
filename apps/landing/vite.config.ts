import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //@ts-ignore
  plugins: [react()],
  base: 'landing'
})
