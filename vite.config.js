import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        programas: 'programas/index.html',
        salaDeGuerra: 'sala-de-guerra/index.html',
        personalSales: 'tecnologia/personal-sales/index.html',
        proposta: 'proposta/index.html'
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['.monkeycode-ai.live'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['.monkeycode-ai.live']
  }
})
