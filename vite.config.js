import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  build: {
    outDir: 'dist', // Asegura que la carpeta de salida se llame 'dist'
  },
})