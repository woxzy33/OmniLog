import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/files_for_me/**', '**/.tmp.driveupload/**']
    }
  }
})
