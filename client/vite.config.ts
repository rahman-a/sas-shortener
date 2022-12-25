import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api/v1': 'http://localhost:5000',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@chakra-ui/react',
      '@chakra-ui/icons',
      'framer-motion',
      '@emotion/styled',
      'react-query',
    ],
  },
})
