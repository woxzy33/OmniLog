import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/files_for_me/**', '**/.tmp.driveupload/**', '**/android/**', '**/ios/**']
    },
    hmr: {
      overlay: true
    }
  }
})
