import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// defineConfig viene de 'vitest/config' (y no de 'vite') para que el bloque
// `test` de abajo tenga validación y autocompletado. Fuera de `npm test`,
// Vite sigue ignorando ese bloque.
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simula el DOM del navegador dentro de la terminal (sin EC2 gráfica).
    environment: 'jsdom',
    // Permite describe/it/expect/vi sin importarlos en cada archivo.
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      // Código real medido en el reporte (Guía 15, sección 8).
      include: [
        'src/components/**',
        'src/pages/**',
        'src/utils/**',
        'src/hooks/**',
        'src/context/**',
        'src/App.jsx',
      ],
      // Sin esto, el v8 también contaría los archivos .test y main.jsx/data.
      exclude: [
        '**/*.test.*',
        'src/setupTests.js',
        'src/main.jsx',
        'src/data/**',
        'src/test/**',
      ],
    },
  },
})
