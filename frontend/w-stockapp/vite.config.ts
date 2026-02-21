import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['stockapp', 'localhost', 'stockapp.agaviocarlos.com']
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['stockapp', 'localhost', 'stockapp.agaviocarlos.com']
  }
})
